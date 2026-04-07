<?php
class Database {
    private $host;
    private $port;
    private $dbname;
    private $username;
    private $password;

    public function __construct() {
        $this->host = $_ENV['MYSQL_HOST'];
        $this->port = $_ENV['MYSQL_PORT'];
        $this->dbname = $_ENV['MYSQL_DATABASE'];
        $this->username = $_ENV['MYSQL_USER'];
        $this->password = $_ENV['MYSQL_PASSWORD'];
    }

    public function getConnection() {
        $connection = null;

        try {
            $connection = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->dbname,
                $this->username,
                $this->password
            );
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }

        return $connection;
    }
}