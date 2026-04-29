<?php

session_start();

require_once __DIR__ . '/../config/database.php';
$database = new Database();
$dbConnection = $database->getConnection();

$routes = require_once __DIR__ . "/../routes/web.php";

function normalize_path($path) {
    return '/' . trim($path, '/');
}

function match_route($path, $routePattern) {
    $pathSegments = array_filter(explode('/', $path));
    $routeSegments = array_filter(explode('/', $routePattern));

    if (count($pathSegments) !== count($routeSegments)) {
        return false;
    }

    $params = [];
    foreach ($routeSegments as $index => $segment) {
        if (strpos($segment, ':') === 0) {
            // This is a parameter
            $paramName = substr($segment, 1);
            $params[$paramName] = $pathSegments[$index];
        } else {
            // This is a literal segment
            if ($segment !== $pathSegments[$index]) {
                return false;
            }
        }
    }

    return $params;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

$request = normalize_path(parse_url($uri, PHP_URL_PATH) ?? '/');

$viewDir = '/../app/views/';
$controllerDir = '/../app/controllers/';

$matched = false;
$matchedController = null;
$matchedAction = null;
$allowedAccess = [];
$routeParams = [];

// Try to match exact routes first
if (isset($routes[$method][$request])) {
    $controllerInfo = $routes[$method][$request];
    $matchedController = $controllerInfo['controller'];
    $matchedAction = $controllerInfo['action'];
    $allowedAccess = $controllerInfo['access'] ?? [];
    $matched = true;
} else {
    // Try to match dynamic routes
    foreach ($routes[$method] as $routePattern => $controllerInfo) {
        $params = match_route($request, $routePattern);
        if ($params !== false) {
            $matchedController = $controllerInfo['controller'];
            $matchedAction = $controllerInfo['action'];
            $allowedAccess = $controllerInfo['access'] ?? [];
            $routeParams = $params;
            $matched = true;
            break;
        }
    }
}

if ($matched) {
    $role = 'guest';

    if (isset($_SESSION['user_id'])) {
        require_once __DIR__ . '/../app/models/Account.php';
        $accountModel = new Account($dbConnection);
        $role = $accountModel->getRole($_SESSION['user_id']);
    }

    if (!in_array($role, $allowedAccess, true)) {
        if ($role === 'admin') {
            header('Location: /admin');
        } else if ($role === 'client') {
            header('Location: /account');
        } else {
            header('Location: /sign-in');
        }
        exit;
    }

    $controllerFile = __DIR__ . $controllerDir . $matchedController . '.php';
    if (file_exists($controllerFile)) {
        require_once $controllerFile;

        $controller = new $matchedController($dbConnection);
        if (method_exists($controller, $matchedAction)) {
            // Pass route parameters to the action
            if (!empty($routeParams)) {
                $controller->$matchedAction(...array_values($routeParams));
            } else {
                $controller->$matchedAction();
            }
        } else {
            http_response_code(500);
            echo "Action $matchedAction in $matchedController is undefined!";
        }
    } else {
        http_response_code(500);
        echo "Controller $matchedController does not exist!";
    }
} else {
    http_response_code(404);
    require __DIR__ . $viewDir . "404.php";
}