<?php

require_once __DIR__ . '/BaseModel.php';

/**
 * Product model that handles all database interactions related to payments.
 * This includes CRUD operations and any payment-specific queries.
 */
class Payment extends BaseModel {
    /**
     * Creates a payment record
     * @param int $status Whether the payment failed, succeeded, is pending or was refunded
     * @return int last id inserted in the payment table
     */
    public function createPayment($status) {
        $query = "INSERT INTO payment (date, mode_id, status_id)
            VALUES (:date, :mode_id, :status_id)";


        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(":date", date("Y-m-d"), PDO::PARAM_STR);
        $stmt->bindValue(":mode_id", 2, PDO::PARAM_INT);
        $stmt->bindValue(":status_id", $status, PDO::PARAM_INT);

        $stmt->execute();
        return $this->conn->lastInsertId();
    }
}
?>
