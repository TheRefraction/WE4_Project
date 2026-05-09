<?php

class InvoiceController
{
    private $dbConnection;

    public function __construct(PDO $dbConnection) {
        $this->dbConnection = $dbConnection;
    }
    public function invoices() {
        if (!isset($_SESSION['user_id'])) {
            header('Location: /sign-in');
            exit;
        }
        require_once __DIR__ . '/../models/Invoice.php';
        $invoiceModel = new Invoice($this->dbConnection);
        $accountId = $_SESSION['user_id'];
        $invoices = $invoiceModel->getInvoicesByAccountId($accountId);
        $title = 'My Invoices';
        require_once __DIR__ . '/../views/invoices.php';
    }
}