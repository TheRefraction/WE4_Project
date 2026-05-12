<?php
class Database {
    private $host;
    private $port;
    private $dbname;
    private $username;
    private $password;

    public function __construct() {
        $this->host = getenv('MYSQL_HOST');
        $this->port = getenv('MYSQL_PORT');
        $this->dbname = getenv('MYSQL_DATABASE');
        $this->username = getenv('MYSQL_USER');
        $this->password = getenv('MYSQL_PASSWORD');
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
