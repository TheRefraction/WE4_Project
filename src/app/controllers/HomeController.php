<?php
class HomeController {
    public function home() {
        require_once __DIR__ . '/../views/home.php';
    }
    public function gdpr() {
        require_once __DIR__ . '/../views/gdpr.php';
    }
}