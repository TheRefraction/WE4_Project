<?php

require_once __DIR__ .'/../models/Cart.php';
require_once __DIR__ .'/../models/ProductCustomization.php';

/*
* CartController is responsible for handling all cart-related actions, such as adding and removing products from the cart, viewing the cart, and saving customizations.
* It interacts with the Cart model to manage the cart data stored in the session and renders the appropriate views for the cart.
*/
class CartController{

    private $cartModel;
    private $customizationModel;

    public function __construct(PDO $dbConnection){
        $this->cartModel = new Cart();
        $this->customizationModel = new ProductCustomization($dbConnection);
    }

    public function viewCart(){
        $cart = $this->cartModel->getCart();
        $total = $this->cartModel->computeTotal();

        require_once __DIR__ . "/../views/cart.php";
    }

    public function cartAction() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /cart');
            exit;
        }

        $id = (int) ($_POST['product_id'] ?? 0);
        $name = (string) ($_POST['product_name'] ?? '');
        $price = (float) ($_POST['product_price'] ?? 0);
        $isFromCart = $_POST['is_from_cart'] ?? 'False';
        $lineKey = $_POST['line_key'] ?? null;
        $options = $_POST['customization'] ?? [];

        if (is_string($options)) {
            $decodedOptions = json_decode($options, true);
            $options = is_array($decodedOptions) ? $decodedOptions : [];
        }

        if (!is_array($options)) {
            $options = [];
        }

        if (!empty($options) && array_keys($options) !== range(0, count($options) - 1)) {
            $normalizedOptions = [];

            foreach ($options as $slotId => $selectedOptions) {
                $slot = $this->customizationModel->getCustomizationSlotById((int) $slotId);
                if (!$slot) {
                    continue;
                }

                $selectedChoices = [];
                $selectedOptions = is_array($selectedOptions) ? $selectedOptions : [$selectedOptions];

                foreach ($selectedOptions as $selectedOptionId) {
                    if ($selectedOptionId === '' || $selectedOptionId === null) {
                        continue;
                    }

                    $option = $this->customizationModel->getCustomizationOptionById((int) $selectedOptionId);
                    if (!$option) {
                        continue;
                    }

                    $selectedChoices[] = [
                        'optionProductId' => (int) $option->option_product_id,
                        'name' => $option->option_product_name,
                        'priceDelta' => (float) $option->price_delta,
                    ];
                }

                $normalizedOptions[] = [
                    'slotId' => (int) $slot->id,
                    'categoryName' => $slot->category_name,
                    'choices' => $selectedChoices,
                ];
            }

            $options = $normalizedOptions;
        }

        if ($_POST['action'] === 'add') {
            $this->cartModel->addProductToCart($id, $name, $price, $options);
        } else if ($_POST['action'] === 'remove') {
            if (!$lineKey) {
                $lineKey = $this->cartModel->buildLineKey($id, $options);
            }
            $this->cartModel->removeProductFromCart($lineKey);
        }

        if ($isFromCart === 'True'){
            header('Location: /cart');
        } else {
            header('Location: /product?id=' . urlencode($id));
        }
    }
}