<?php

require_once __DIR__ . '/../models/Invoice.php';

class InvoiceController {
    private $invoiceModel;

    public function __construct(PDO $dbConnection) {
        $this->invoiceModel = new Invoice($dbConnection);
    }

    public function invoices() {
        $accountId = $_SESSION['user_id'] ?? null;

        if (!isset($accountId)) {
            header('Location: /sign-in');
            exit;
        }
        
        $invoices = $this->invoiceModel->getInvoicesByAccountId($accountId);
        $title = 'My Invoices';
        require_once __DIR__ . '/../views/invoices.php';
    }

    public function invoiceData($id) {
        $accountId = $_SESSION['user_id'] ?? null;

        if (!isset($accountId)) {
            http_response_code(401);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $invoiceId = (int) $id;
        if ($invoiceId <= 0) {
            http_response_code(400);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Invalid invoice id']);
            return;
        }

        $invoice = $this->invoiceModel->getInvoiceDetailsByIdAndAccountId($invoiceId, (int) $accountId);

        if (!$invoice) {
            http_response_code(404);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode(['error' => 'Invoice not found']);
            return;
        }

        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($invoice, JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION);
    }
}