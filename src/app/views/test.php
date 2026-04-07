<!DOCTYPE html>
<html lang="en">
    <head>
        <title><?= htmlspecialchars($title) ?></title>
    </head>

    <body>
        <h1><?= $title ?></h1>
        <p><?= $testModel->getStatus(); ?></p>
    </body>
</html>