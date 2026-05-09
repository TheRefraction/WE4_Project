<?php

require_once __DIR__ . '/Account.php';
require_once __DIR__ . '/Product.php';
require_once __DIR__ . '/ProductCustomization.php';
require_once __DIR__ . '/Category.php';
require_once __DIR__ . '/Menu.php';
require_once __DIR__ . '/Supplier.php';
require_once __DIR__ . '/AdminDashboard.php';

/**
 * Admin class that serves as a facade to delegate calls to specific admin models.
 * This allows the AdminController to interact with a single Admin class, 
 * while the actual logic is handled by the respective models.
 */
class Admin {
    /** @var array<int, object> */
    private array $delegates;

    public function __construct(PDO $dbConnection) {
        $this->delegates = [
            new Account($dbConnection),
            new Product($dbConnection),
            new ProductCustomization($dbConnection),
            new Category($dbConnection),
            new Menu($dbConnection),
            new Supplier($dbConnection),
            new AdminDashboard($dbConnection)
        ];
    }

    public function __call(string $name, array $arguments) {
        foreach ($this->delegates as $delegate) {
            if (method_exists($delegate, $name)) {
                return $delegate->{$name}(...$arguments);
            }
        }

        throw new BadMethodCallException('Undefined admin method: ' . $name);
    }
}
