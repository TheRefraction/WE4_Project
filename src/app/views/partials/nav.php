<?php

require __DIR__ . '/../../models/account.php';

session_start();
if (!isset($_SESSION['account'])) {
    $account = null;
} else {
    $account = $_SESSION['account'];
}
?>
<nav>
<!--TODO : this file may be deleted since it has been implemented in navbar.php-->
</nav>
