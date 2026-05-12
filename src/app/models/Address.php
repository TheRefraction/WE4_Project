<?php
require_once __DIR__ . '/BaseModel.php';

class Address extends BaseModel {


    public function createSafeAddress($house_num, $house_suf, $street, $city, $postal_code, $country) {
        try {
            $this->conn->beginTransaction();

            // 1. Ensure Country exists
            $country_id = $this->getOrCreate('country', 'name', "France");

            // 2. Ensure Postal Code exists (linked to country)
            // Note: You may need a more complex 'getOrCreate' if unique constraints span multiple columns
            $pc_id = $this->getOrCreate('postal_code', 'code', $postal_code, ['country_id' => $country_id]);

            // 3. Ensure City exists
            $city_id = $this->getOrCreate('city', 'name', $city, ['postal_code_id' => $pc_id]);

            // 4. Ensure Street exists
            $street_id = $this->getOrCreate('street', 'name', $street, ['city_id' => $city_id]);

            // 5. Check if Address exists
            $checkStmt = $this->conn->prepare("SELECT id FROM address WHERE house_number = :num AND house_number_suffix <=> :suffix AND street_id = :sid");
            $checkStmt->execute([
                ':num' => $house_num,
                ':suffix' => !empty($house_suf) ? $house_suf : null,
                ':sid' => $street_id
            ]);
            $existing = $checkStmt->fetchColumn();

            if ($existing) {
                $this->conn->commit();
                return $existing;
            }

            // 6. Insert Address
            $insertStmt = $this->conn->prepare("INSERT INTO address (house_number, house_number_suffix, street_id) VALUES (:num, :suffix, :sid)");
            $insertStmt->execute([
                ':num' => $house_num,
                ':suffix' => !empty($house_suf) ? $house_suf : null,
                ':sid' => $street_id
            ]);

            $id = $this->conn->lastInsertId();
            $this->conn->commit();
            return $id;

        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    /**
     * Helper to find an ID or create it if missing
     */
    private function getOrCreate($table, $column, $value, $extraData = []) {
        $sql = "SELECT id FROM $table WHERE $column LIKE :val";
        // Add extra conditions for hierarchy (e.g., WHERE name = 'X' AND city_id = 1)
        foreach ($extraData as $col => $dat) {
            $sql .= " AND $col = :$col";
        }

        $stmt = $this->conn->prepare($sql);
        $params = [':val' => $value];
        foreach ($extraData as $col => $dat) { $params[":$col"] = $dat; }

        $stmt->execute($params);
        $id = $stmt->fetchColumn();

        if (!$id) {
            $cols = array_merge([$column], array_keys($extraData));
            $placeholders = array_map(fn($c) => ":$c", $cols);

            $insertSql = "INSERT INTO $table (" . implode(',', $cols) . ") VALUES (" . implode(',', $placeholders) . ")";
            $insertStmt = $this->conn->prepare($insertSql);

            $insertParams = [":$column" => $value];
            foreach ($extraData as $col => $dat) { $insertParams[":$col"] = $dat; }

            $insertStmt->execute($insertParams);
            $id = $this->conn->lastInsertId();
        }
        return $id;
    }
}
?>
