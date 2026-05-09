<?php
require_once __DIR__ . '/BaseModel.php';
class Invoice extends BaseModel
{
    public function getInvoicesByAccountId($accountId) {
        $query = "SELECT i.*, 
                  s.name AS status_name, 
                  m.name AS payment_mode_name
                  FROM invoice i
                  LEFT JOIN invoice_status s ON i.status_id = s.id
                  LEFT JOIN payment p        ON i.payment_id = p.id
                  LEFT JOIN payment_mode m   ON p.mode_id = m.id
                  WHERE i.account_id = :accountId
                  ORDER BY i.date DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindValue(':accountId', $accountId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }
}