<?php

require_once __DIR__ . '/../models/Account.php';

class AuthController {
    private $accountModel;

    public function __construct(PDO $dbConnection) {
        $this->accountModel = new Account($dbConnection);
    }

    public function viewSignUp() {
        $title = 'Sign Up';
        require_once __DIR__ . '/../views/sign-up.php';
    }

    public function viewSignIn() {
        $title = 'Sign In';
        require_once __DIR__ . '/../views/sign-in.php';
    }

    public function viewAccount() {
        if (!isset($_SESSION['user_id'])) {
            header('Location: /sign-in');
            exit;
        }

        $title = 'My account';
        require_once __DIR__ . '/../views/account.php';
    }

    public function signUp() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /sign-up');
            exit;
        }

        $firstName = trim($_POST["first_name"] ?? '') ;
        $lastName = trim($_POST["last_name"] ?? '');
        $phone = !empty($_POST["phone"]) ? trim($_POST["phone"]) : null;
        $email = trim($_POST["email"] ?? '');
        $password = trim($_POST["password"] ?? '');
        $conPassword = trim($_POST["confirm_password"] ?? '');

        $errors = [];

        if (empty($firstName) || empty($lastName) || empty($email) || empty($password) || empty($conPassword)) {
            $_SESSION['errors'] = ["Please fill in all the fields."];
            header('Location: /sign-up');
            exit;
        }

        if ($this->accountModel->getAccountByEmail($email)) {
            $_SESSION['errors'] = ["Email already exists."];
            header('Location: /sign-up');
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Valid email is required.";
        if (strlen($password) < 6) $errors[] = "Password must be at least 6 characters.";
        if ($password !== $conPassword) $errors[] = "Passwords do not match.";

        if (!empty($errors)) {
            $_SESSION['errors'] = $errors;
            header('Location: /sign-up');
            exit;
        }

        if ($this->accountModel->createAccount($firstName, $lastName, $email, $phone, $password)) {
            $_SESSION['success'] = "Account created successfully!";
            header('Location: /sign-in');
            exit;
        }

        $_SESSION['errors'] = ["Error creating account!"];
        header('Location: /sign-up');
        exit;
    }

    public function signIn() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header('Location: /sign-in');
            exit;
        }

        $email = trim($_POST['email'] ?? '');
        $password = trim($_POST['password'] ?? '');

        $user = $this->accountModel->getAccountByEmail($email);

        if ($user && password_verify($password, $user->password)) {
            $_SESSION['user_id'] = $user->id;
            $_SESSION['user_first_name'] = $user->first_name;
            $_SESSION['user_last_name'] = $user->last_name;
	    $_SESSION['user_email'] = $user->email;
	    $_SESSION['user_phone'] = $user->phone;

            $role = $this->accountModel->getAccountRole($user->id); 
            if ($role === 'admin') {
                header('Location: /admin');
                exit;
            }

            header('Location: /account');
            exit;
        }

        $_SESSION['errors'] = ["Invalid email or password."];
        header('Location: /sign-in');
        exit;
    }

    public function signOut() {
        $_SESSION = [];
        session_destroy();
        header('Location: /');
        exit;
    }

    public function getAccountData() {
        header('Content-Type: application/json');

        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Access denied.']);
            exit;
        }

        $data = [
            'first_name' => $_SESSION['user_first_name'] ?? '',
            'last_name'  => $_SESSION['user_last_name'] ?? '',
            'email'      => $_SESSION['user_email'] ?? '',
            'phone'      => $_SESSION['user_phone'] ?? ''
        ];

        echo json_encode($data);
        exit;
    }

    public function updateAccount() {
        $firstName = trim($_POST["first_name"] ?? '');
        $lastName = trim($_POST["last_name"] ?? '');
        $phone = trim($_POST["phone"] ?? '');
        $email = $_SESSION['user_email'];

        if (empty($firstName) || empty($lastName)) {
            $_SESSION['errors'] = ["First name and Last name are required."];
            header('Location: /account');
            exit;
        }

        if ($this->accountModel->updateAccountInfo($firstName, $lastName, $email, $phone)) {
            $_SESSION['user_first_name'] = $firstName;
            $_SESSION['user_last_name'] = $lastName;
            $_SESSION['user_phone'] = $phone;
            $_SESSION['success'] = "Profile updated!";
        } else {
            $_SESSION['errors'] = ["Error updating account."];
        }

        header('Location: /account');
        exit;
    }
}
