<?php
class HomeController {
    public function home() {
        require_once __DIR__ . '/../views/home.php';
    }

    public function viewSignIn() {
        require_once __DIR__ . '/../views/sign-in.php';
    }

    public function viewSignUp() {
        require_once __DIR__ . '/../views/sign-up.php';
    }

    public function viewAccount() {
        require_once __DIR__ . '/../views/account_view.php';
    }
}