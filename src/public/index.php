<?php

session_start();

require_once __DIR__ . '/../config/database.php';
$database = new Database();
$dbConnection = $database->getConnection();

$routes = require_once __DIR__ . "/../routes/web.php";

function normalize_path($path) {
    return '/' . trim($path, '/');
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

$request = normalize_path(parse_url($uri, PHP_URL_PATH) ?? '/');

$viewDir = '/../app/views/';
$controllerDir = '/../app/controllers/';

if (isset($routes[$method][$request])) {
    $controllerInfo = $routes[$method][$request];
    $controllerName = $controllerInfo[0];
    $controllerAction = $controllerInfo[1];

    $controllerFile = __DIR__ . $controllerDir . $controllerName . '.php';
    if (file_exists($controllerFile)) {
        require_once $controllerFile;

        $controller = new $controllerName($dbConnection);
        if (method_exists($controller, $controllerAction)) {
            $controller->$controllerAction();
        } else {
            http_response_code(500);
            echo "Action $controllerAction in $controllerName is undefined!";
        }
    } else {
        http_response_code(500);
        echo "Controller $controllerName does not exist!";
    }
} else {
    http_response_code(404);
    require __DIR__ . $viewDir . "404.php";
}