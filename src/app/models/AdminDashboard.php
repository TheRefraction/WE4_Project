<?php

require_once __DIR__ . '/BaseModel.php';

/** 
 * Admin dashboard model.
 */
class AdminDashboard extends BaseModel {
    /** 
     * Get dashboard statistics.
     * @return array The dashboard statistics.
     */
    public function getDashboardStats() {
        $stats = [];

        $query = "SELECT COUNT(*) as count FROM account";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_accounts'] = $stmt->fetchColumn();

        $query = "SELECT COUNT(*) as count FROM product";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_products'] = $stmt->fetchColumn();

        /*$query = "SELECT COUNT(*) as count FROM invoice";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_invoices'] = $stmt->fetchColumn();

        $query = "SELECT COALESCE(SUM(total), 0) as total FROM invoice";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_revenue'] = $stmt->fetchColumn();*/

        $query = "SELECT COUNT(*) as count FROM supplier";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['total_suppliers'] = $stmt->fetchColumn();

        /*$query = "SELECT COUNT(*) as count FROM stock
                  WHERE quantity_available <= reorder_threshold";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $stats['low_stock_count'] = $stmt->fetchColumn();*/

        return $stats;
    }
}
