<?php


require __DIR__ .'/../models/Cart.php';
require __DIR__ .'/../models/Payment.php';
require __DIR__ .'/../models/Address.php';
require __DIR__ .'/../models/Invoice.php';


class CheckoutController {
    private $cartModel;
    private $paymentModel;
    private $addressModel;
    private $invoiceModel;

    public function __construct(PDO $dbConnection) {
        $this->cartModel = new Cart();
        $this->paymentModel = new Payment($dbConnection);
        $this->addressModel = new Address($dbConnection);
        $this->invoiceModel = new Invoice($dbConnection);
    }

    public function viewCheckout() {
        $total = $this->cartModel->computeTotal();
        require_once __DIR__ . "/../views/checkout.php";
    }

    public function saveOrder() {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (!$data) {
            $this->jsonResponse(false, "Données invalides.");
        }

        $payment_id = $this->paymentModel->createPayment($data['simulate_status']);

        $address_id = $this->addressModel->createSafeAddress(
            $data["house-number"],
            $data["house-suffix"],
            $data["street"],
            $data["city"],
            $data["code-postal"],
            $data["country"]
        );

        $this->invoiceModel->createInvoice(
            $_SESSION['user_id'],
            $_SESSION['cart'],
            3,
            $payment_id,
            $address_id
        );



        // TODO: take into account all payment statuses and check in a cleaner way
        if($data['simulate_status'] == 3) {
            $this->jsonResponse(false, "Paiement refusé par la banque");
        } else {
            $this->jsonResponse(true, "Commande enregistrée");
        }
    }

    private function jsonResponse($success, $message) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => $success,
            'message' => $message
        ]);
        exit;
    }

}

?>
