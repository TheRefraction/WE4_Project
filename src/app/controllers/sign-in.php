<?php

require __DIR__ .'/../models/account.php';
require __DIR__ .'/../../config/database.php';

$email = $_REQUEST["email"];
$password = $_REQUEST["password"];

if(empty($_POST["email"])) {
    http_response_code(400);
    header('Location: /sign-in.php?error=1');
}
if(empty($_POST["password"])) {
    http_response_code(400);
    header('Location: /sign-in?error=1');
}

$query  = getConnection()->prepare('SELECT * FROM account WHERE email = :email');
$query->execute(['email' => $email]);
$account = $query->fetchObject(Account::class);

if(!$account) {
    header('Location: /sign-in?error=2');
} else if(!password_verify($password, $account->password)) {
    header('Location: /sign-in?error=3');
} else {
    session_start();
    $_SESSION['account'] = $account;
    //header('Location: /accueil');
}
