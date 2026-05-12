<?php

require_once __DIR__ . '/BaseModel.php';

/**
 * Invoice model for managing invoices, including retrieval of invoices by account ID.
 * This model also handles the association of invoice status and payment mode for better invoice management.
 */
class Invoice extends BaseModel {
    /**
     * Retrieves all invoices associated with a specific account ID, including their status and payment mode.
     *
     * @param int $accountId The ID of the account for which to retrieve invoices.
     * @return array An array of invoice objects, each containing invoice details along with status and payment mode information.
     */
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
        $stmt->bindValue(':total', 0.0);
        $stmt->bindValue(':statusId', $statusId, PDO::PARAM_INT);
        $stmt->bindValue(':paymentId', $paymentId, PDO::PARAM_INT);
        $stmt->bindValue(':addressId', $addressId, PDO::PARAM_INT);
        $stmt->execute();

        $invoiceId = $this->conn->lastInsertId();
        $totalFacture = 0.0;

        $products = $cart['products'] ?? [];
        foreach ($products as $lineKey => $item) {

            $basePrice = (float)$item['price'];
            $optionsDeltaSum = 0.0;

            if (!empty($item['options'])) {
                foreach ($item['options'] as $slot) {
                    foreach ($slot['choices'] as $choice) {
                        $optionsDeltaSum += (float)($choice['priceDelta'] ?? 0);
                    }
                }
            }

            $finalUnitPrice = $basePrice + $optionsDeltaSum;
            $quantity = (int)$item['quantity'];

            $queryLine = "INSERT INTO invoice_line (unit_price, quantity, invoice_id, product_id, menu_id) 
                VALUES (:unitPrice, :quantity, :invoiceId, :productId, NULL)";

            $stmtLine = $this->conn->prepare($queryLine);
            $stmtLine->bindValue(':unitPrice', $finalUnitPrice);
            $stmtLine->bindValue(':quantity', $quantity, PDO::PARAM_INT);
            $stmtLine->bindValue(':invoiceId', $invoiceId, PDO::PARAM_INT);
            $stmtLine->bindValue(':productId', $item['product_id'], PDO::PARAM_INT);
            $stmtLine->execute();

            $invoiceLineId = $this->conn->lastInsertId();

            if (!empty($item['options'])) {
                foreach ($item['options'] as $slot) {
                    foreach ($slot['choices'] as $choice) {
                        $queryOpt = "INSERT INTO invoice_line_product_option (invoice_line_id, product_option_id, unit_price_delta, quantity) 
                            VALUES (:invoiceLineId, :optionId, :unitPriceDelta, :quantity)";

                        $stmtOpt = $this->conn->prepare($queryOpt);
                        $stmtOpt->bindValue(':invoiceLineId', $invoiceLineId, PDO::PARAM_INT);
                        $stmtOpt->bindValue(':optionId', $choice['optionProductId'], PDO::PARAM_INT);
                        $stmtOpt->bindValue(':unitPriceDelta', $choice['priceDelta']);
                        $stmtOpt->bindValue(':quantity', $quantity, PDO::PARAM_INT); // Quantité calquée sur le produit
                        $stmtOpt->execute();
                    }
                }
            }

            $totalFacture += ($finalUnitPrice * $quantity);
        }

        /*
        // Add menu items to the invoice
        $menus = $cart['menus'] ?? [];
        foreach ($menus as $menuId => $menu) {
            $query = "INSERT INTO invoice_line (unit_price, quantity, invoice_id, product_id, menu_id) 
                      VALUES (:unitPrice, :quantity, :invoiceId, NULL, :menuId)";

            $menuPrice = $menu['price'];
            $menuQuantity = $menu['quantity'];
            $menuItems = $menu['items'] ?? [];

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':unitPrice', $menuPrice);
            $stmt->bindValue(':invoiceId', $invoiceId, PDO::PARAM_INT);
            $stmt->bindValue(':menuId', $menuId, PDO::PARAM_INT);
            $stmt->bindValue(':quantity', $menuQuantity, PDO::PARAM_INT);

            $stmt->execute();

            $invoiceLineId = $this->conn->lastInsertId();

            // Insert menu items for the invoice line
            foreach ($menuItems as $item) {
                // price and price_delta are used for redundancy
                // $menuPrice should already include the price of the items, 
                // but we store it for easier retrieval when displaying the invoice
                $itemId = $item['id'];
                $itemPrice = $item['price'];
                $itemDelta = $item['price_delta'];
                $itemQuantity = $item['quantity'];

                $query = "INSERT INTO invoice_line_menu_item (invoice_line_id, product_id, unit_price, unit_price_delta, quantity) 
                          VALUES (:invoiceLineId, :itemId, :unitPrice, :unitPriceDelta, :quantity)";

                $stmt = $this->conn->prepare($query);

                $stmt->bindValue(':invoiceLineId', $invoiceLineId, PDO::PARAM_INT);
                $stmt->bindValue(':itemId', $itemId, PDO::PARAM_INT);
                $stmt->bindValue(':unitPrice', $itemPrice);
                $stmt->bindValue(':unitPriceDelta', $itemDelta);
                $stmt->bindValue(':quantity', $itemQuantity, PDO::PARAM_INT);

                $stmt->execute();

                // Insert product options for the menu item
                $menuOptions = $item['options'] ?? [];
                $optionsTotal = 0.0;

                foreach ($menuOptions as $option) {
                    $query = "INSERT INTO invoice_line_product_option (invoice_line_id, product_option_id, unit_price_delta, quantity) 
                            VALUES (:invoiceLineId, :optionId, :unitPriceDelta, :quantity)";

                    $optionId = $option['id'];
                    $optionPriceDelta = $option['price_delta'];
                    $optionQuantity = $option['quantity'];

                    $stmt = $this->conn->prepare($query);

                    $stmt->bindValue(':invoiceLineId', $invoiceLineId, PDO::PARAM_INT);
                    $stmt->bindValue(':optionId', $optionId, PDO::PARAM_INT);
                    $stmt->bindValue(':unitPriceDelta', $optionPriceDelta);
                    $stmt->bindValue(':quantity', $optionQuantity, PDO::PARAM_INT);

                    $stmt->execute();

                    $optionsTotal += $optionPriceDelta * $optionQuantity;
                }
            }

            $total += ($menuPrice + $optionsTotal) * $menuQuantity;
        }

         */

        // Update the invoice total
        $queryUpdate = "UPDATE invoice SET total = :total WHERE id = :invoiceId";
        $stmtUpdate = $this->conn->prepare($queryUpdate);
        $stmtUpdate->bindValue(':total', $totalFacture);
        $stmtUpdate->bindValue(':invoiceId', $invoiceId, PDO::PARAM_INT);
        $stmtUpdate->execute();

        return $invoiceId;
    }


    public function createInvoice($accountId, $cart, $statusId, $paymentId, $addressId) {
        $query = "INSERT INTO invoice (total, account_id, payment_id, status_id, billing_address_id) 
                  VALUES (:total, :accountId, :paymentId, :statusId, :addressId)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':accountId', $accountId, PDO::PARAM_INT);
        $stmt->bindValue(':total', 0.0);
        $stmt->bindValue(':statusId', $statusId, PDO::PARAM_INT);
        $stmt->bindValue(':paymentId', $paymentId, PDO::PARAM_INT);
        $stmt->bindValue(':addressId', $addressId, PDO::PARAM_INT);

        $stmt->execute();

        $invoiceId = $this->conn->lastInsertId();
        $total = 0.0;

        // Insert invoice lines for each product in the cart
        $products = $cart['products'] ?? [];
        foreach ($products as $productId => $product) {
            $query = "INSERT INTO invoice_line (unit_price, quantity, invoice_id, product_id, menu_id) 
                      VALUES (:unitPrice, :quantity, :invoiceId, :productId, NULL)";

            $productPrice = $product['price'];
            $productQuantity = $product['quantity'];
            $productOptions = $product['options'] ?? [];

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':unitPrice', $productPrice);
            $stmt->bindValue(':invoiceId', $invoiceId, PDO::PARAM_INT);
            $stmt->bindValue(':productId', $productId, PDO::PARAM_INT);
            $stmt->bindValue(':quantity', $productQuantity, PDO::PARAM_INT);

            $stmt->execute();

            $invoiceLineId = $this->conn->lastInsertId();

            $optionsTotal = 0.0;

            // Insert product options for the invoice line
            foreach ($productOptions as $option) {
                $query = "INSERT INTO invoice_line_product_option (invoice_line_id, product_option_id, unit_price_delta, quantity) 
                          VALUES (:invoiceLineId, :optionId, :unitPriceDelta, :quantity)";

                $optionId = $option['id'];
                $optionPriceDelta = $option['price_delta'];
                $optionQuantity = $option['quantity'];

                $stmt = $this->conn->prepare($query);

                $stmt->bindValue(':invoiceLineId', $invoiceLineId, PDO::PARAM_INT);
                $stmt->bindValue(':optionId', $optionId, PDO::PARAM_INT);
                $stmt->bindValue(':unitPriceDelta', $optionPriceDelta);
                $stmt->bindValue(':quantity', $optionQuantity, PDO::PARAM_INT);

                $stmt->execute();

                $optionsTotal += $optionPriceDelta * $optionQuantity;
            }

            $total += ($productPrice + $optionsTotal) * $productQuantity;
        }

        // Add menu items to the invoice
        $menus = $cart['menus'] ?? [];
        foreach ($menus as $menuId => $menu) {
            $query = "INSERT INTO invoice_line (unit_price, quantity, invoice_id, product_id, menu_id) 
                      VALUES (:unitPrice, :quantity, :invoiceId, NULL, :menuId)";

            $menuPrice = $menu['price'];
            $menuQuantity = $menu['quantity'];
            $menuItems = $menu['items'] ?? [];

            $stmt = $this->conn->prepare($query);

            $stmt->bindValue(':unitPrice', $menuPrice);
            $stmt->bindValue(':invoiceId', $invoiceId, PDO::PARAM_INT);
            $stmt->bindValue(':menuId', $menuId, PDO::PARAM_INT);
            $stmt->bindValue(':quantity', $menuQuantity, PDO::PARAM_INT);

            $stmt->execute();

            $invoiceLineId = $this->conn->lastInsertId();

            // Insert menu items for the invoice line
            foreach ($menuItems as $item) {
                /* price and price_delta are used for redundancy
                   $menuPrice should already include the price of the items, 
                   but we store it for easier retrieval when displaying the invoice*/
                $itemId = $item['id'];
                $itemPrice = $item['price'];
                $itemDelta = $item['price_delta'];
                $itemQuantity = $item['quantity'];

                $query = "INSERT INTO invoice_line_menu_item (invoice_line_id, product_id, unit_price, unit_price_delta, quantity) 
                          VALUES (:invoiceLineId, :itemId, :unitPrice, :unitPriceDelta, :quantity)";

                $stmt = $this->conn->prepare($query);

                $stmt->bindValue(':invoiceLineId', $invoiceLineId, PDO::PARAM_INT);
                $stmt->bindValue(':itemId', $itemId, PDO::PARAM_INT);
                $stmt->bindValue(':unitPrice', $itemPrice);
                $stmt->bindValue(':unitPriceDelta', $itemDelta);
                $stmt->bindValue(':quantity', $itemQuantity, PDO::PARAM_INT);

                $stmt->execute();

                // Insert product options for the menu item
                $menuOptions = $item['options'] ?? [];
                $optionsTotal = 0.0;

                foreach ($menuOptions as $option) {
                    $query = "INSERT INTO invoice_line_product_option (invoice_line_id, product_option_id, unit_price_delta, quantity) 
                            VALUES (:invoiceLineId, :optionId, :unitPriceDelta, :quantity)";

                    $optionId = $option['id'];
                    $optionPriceDelta = $option['price_delta'];
                    $optionQuantity = $option['quantity'];

                    $stmt = $this->conn->prepare($query);

                    $stmt->bindValue(':invoiceLineId', $invoiceLineId, PDO::PARAM_INT);
                    $stmt->bindValue(':optionId', $optionId, PDO::PARAM_INT);
                    $stmt->bindValue(':unitPriceDelta', $optionPriceDelta);
                    $stmt->bindValue(':quantity', $optionQuantity, PDO::PARAM_INT);

                    $stmt->execute();

                    $optionsTotal += $optionPriceDelta * $optionQuantity;
                }
            }

            $total += ($menuPrice + $optionsTotal) * $menuQuantity;
        }

        // Update the invoice total
        $query = "UPDATE invoice 
                  SET total = :total 
                  WHERE id = :invoiceId";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':total', $total);
        $stmt->bindValue(':invoiceId', $invoiceId, PDO::PARAM_INT);
        $stmt->execute();

        return $invoiceId;
    }


}
