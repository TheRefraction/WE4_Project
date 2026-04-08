<?php

require __DIR__ .'/../models/account.php';
require __DIR__ .'/../../config/database.php';

$first_name = $_REQUEST["first_name"];
$last_name = $_REQUEST["last_name"];
$phone = $_REQUEST["phone"];
$email = $_REQUEST["email"];
$password = $_REQUEST["password"];

if (
    empty($_POST["first_name"]) ||
    empty($_POST["last_name"]) ||
    empty($_POST["phone"]) ||
    empty($_POST["email"]) ||
    empty($_POST["password"])) {
    http_response_code(400);
    header('Location: /sign-up?error=1');
}

$query = getConnection()->prepare('INSERT INTO account (first_name, last_name, phone, email, password, date_creation, role) VALUES (?, ?, ?, ?, ?, ?, ?)');
$query->execute([$first_name, $last_name, $phone, $email, password_hash($password, PASSWORD_DEFAULT), date("Y-m-d"), 1]);

header('Location: /sign-in');