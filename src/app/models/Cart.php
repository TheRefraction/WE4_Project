<?php

class Cart {
    public function __construct() {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
            $_SESSION['cart']['products'] = [];
            $_SESSION['cart']['menus'] = [];
        }
    }

    public function getCart() {
        return $_SESSION['cart'];
    }

    private function normalizeOptions($options) {
        if (!is_array($options)) {
            return [];
        }

        $normalized = [];

        foreach ($options as $slot) {
            if (!is_array($slot)) {
                continue;
            }

            $choices = [];

            if (isset($slot['choices']) && is_array($slot['choices'])) {
                foreach ($slot['choices'] as $choice) {
                    if (!is_array($choice)) {
                        continue;
                    }

                    $choices[] = [
                        'optionProductId' => isset($choice['optionProductId']) ? (int) $choice['optionProductId'] : null,
                        'name' => (string) ($choice['name'] ?? ''),
                        'priceDelta' => (float) ($choice['priceDelta'] ?? 0),
                    ];
                }
            }

            $normalized[] = [
                'slotId' => isset($slot['slotId']) ? (int) $slot['slotId'] : null,
                'categoryName' => (string) ($slot['categoryName'] ?? ''),
                'choices' => $choices,
            ];
        }

        return $normalized;
    }

    public function buildLineKey($product_id, $options = []) {
        return $product_id . ':' . md5(json_encode($this->normalizeOptions($options)));
    }

    public function addProductToCart($product_id, $name, $price, $options = []) {
        if (!isset($_SESSION['cart']['products'])) {
            $_SESSION['cart']['products'] = [];
        }

        $normalizedOptions = $this->normalizeOptions($options);
        $lineKey = $this->buildLineKey($product_id, $normalizedOptions);

        if (isset($_SESSION['cart']['products'][$lineKey])) {
            $_SESSION['cart']['products'][$lineKey]['quantity']++;
        } else {
            $_SESSION['cart']['products'][$lineKey] = [
                'line_key' => $lineKey,
                'product_id' => $product_id,
                'name' => $name,
                'quantity' => 1,
                'price' => $price,
                'options' => $normalizedOptions,
            ];
        }

        return $lineKey;
    }

    public function removeProductFromCart($lineKey) {
        if (!isset($_SESSION['cart']['products'])) {
            $_SESSION['cart']['products'] = [];
            return;
        }

        if (isset($_SESSION['cart']['products'][$lineKey])) {
            if ($_SESSION['cart']['products'][$lineKey]['quantity'] - 1 === 0) {
                unset($_SESSION['cart']['products'][$lineKey]);
            } else {
                $_SESSION['cart']['products'][$lineKey]['quantity'] --;
            }
        }
    }

    public function getProductQuantityById($productId) {
        if (!isset($_SESSION['cart']['products'])) {
            return 0;
        }

        $quantity = 0;

        foreach ($_SESSION['cart']['products'] as $product) {
            if ((int) ($product['product_id'] ?? 0) === (int) $productId) {
                $quantity += (int) ($product['quantity'] ?? 0);
            }
        }

        return $quantity;
    }

    public function getTotalCount() {
        if (!isset($_SESSION['cart']) || !isset($_SESSION['cart']['products']) || !isset($_SESSION['cart']['menus'])) {
            return 0;
        }

        $totalCount = 0;

        foreach ($_SESSION['cart']['products'] as $product) {
            $totalCount += $product['quantity'];
        }

        foreach ($_SESSION['cart']['menus'] as $menu) {
            $totalCount += $menu['quantity'];
        }

        return $totalCount;
    }

    public function computeTotal() {
        $total = 0;
        if (!isset($_SESSION['cart']['products'])) {
            return $total;
        }

        foreach ($_SESSION['cart']['products'] as $product) {
            $quantity = (int) ($product['quantity'] ?? 0);
            $price = (float) ($product['price'] ?? 0);

            $total += $quantity * $price;

            if (isset($product['options']) && is_array($product['options'])) {
                foreach ($product['options'] as $slot) {
                    if (!isset($slot['choices']) || !is_array($slot['choices'])) {
                        continue;
                    }

                    foreach ($slot['choices'] as $choice) {
                        $total += $quantity * (float) ($choice['priceDelta'] ?? 0);
                    }
                }
            }
        }
        return $total;
    }

}