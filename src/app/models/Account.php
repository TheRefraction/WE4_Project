<?php
require_once __DIR__ . '/BaseModel.php';

/**
 * Account model for managing user accounts, including creation, retrieval, updating, and deletion.
 * This model also handles password hashing and role management for accounts.
 */
class Account extends BaseModel {
    /**
     * Creates a new account with the provided details. The password is securely hashed before storage.
     * @param string $firstName The first name of the account holder.
     * @param string $lastName The last name of the account holder.
     * @param string $email The email address of the account holder (must be unique).
     * @param string|null $phone The phone number of the account holder (optional).
     * @param string $password The plaintext password for the account (will be hashed).
     * @return bool Returns true on successful account creation, false otherwise.
     */
    public function createAccount($firstName, $lastName, $email, $phone, $password) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $query = "INSERT INTO account (first_name, last_name, email, phone, password) 
                  VALUES (:firstName, :lastName, :email, :phone, :password)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':firstName',      $firstName,         PDO::PARAM_STR);
        $stmt->bindValue(':lastName',       $lastName,          PDO::PARAM_STR);
        $stmt->bindValue(':email',          $email,             PDO::PARAM_STR);
        $stmt->bindValue(':phone',          $phone,             PDO::PARAM_STR);
        $stmt->bindValue(':password',       $hashedPassword,    PDO::PARAM_STR);

        return $stmt->execute();
    }

    /**
     * Retrieves all accounts.
     * @return array The list of all accounts.
     */
    public function getAllAccounts() {
        $query = "SELECT a.*, 
                         r.name         AS role_name 
                  FROM account a
                  LEFT JOIN role r          ON a.role_id = r.id
                  ORDER BY a.date_creation DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves an account by its ID.
     * @param int $id The ID of the account to retrieve.
     * @return object|false The account data or false if not found.
     */
    public function getAccountById($id) {
        $query = "SELECT a.*, r.name         AS role_name 
                  FROM account a
                  LEFT JOIN role r          ON a.role_id = r.id
                  WHERE a.id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',         $id,        PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves an account by its email address.
     * @param string $email The email address of the account to retrieve.
     * @return object|false The account data or false if not found.
     */
    public function getAccountByEmail($email) {
        $query = "SELECT * 
                  FROM account
                  WHERE email = :email";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':email',         $email,             PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_OBJ);
    }

    /**
     * Retrieves the role name associated with a given account ID.
     * @param int $id The ID of the account.
     * @return string|null The name of the role or null if not found.
     */
    public function getAccountRole($id) {
        $query = "SELECT name 
                  FROM account a
                  INNER JOIN role r ON a.role_id = r.id
                  WHERE a.id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',         $id,        PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchColumn();
    }

    /**
     * Retrieves all available roles from the database.
     * @return array The list of all roles.
     */
    public function getAllRoles() {
        $query = "SELECT * FROM role 
                  ORDER BY name";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_OBJ);
    }

    /**
     * Updates an existing account.
     * @param int $id The ID of the account to update.
     * @param string $firstName The new first name.
     * @param string $lastName The new last name.
     * @param string $email The new email address.
     * @param string|null $phone The new phone number.
     * @param int $roleId The ID of the new role.
     * @return bool True if the update was successful, false otherwise.
     */
    public function updateAccount($id, $firstName, $lastName, $email, $phone, $roleId) {
        $query = "UPDATE account
                  SET first_name = :firstName,
                      last_name = :lastName,
                      email = :email,
                      phone = :phone,
                      role_id = :roleId
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id',             $id,                PDO::PARAM_INT);
        $stmt->bindValue(':firstName',      $firstName,         PDO::PARAM_STR);
        $stmt->bindValue(':lastName',       $lastName,          PDO::PARAM_STR);
        $stmt->bindValue(':email',          $email,             PDO::PARAM_STR);
        $stmt->bindValue(':phone',          $phone,             PDO::PARAM_STR);
        $stmt->bindValue(':roleId',         $roleId,            PDO::PARAM_INT);

        return $stmt->execute();
    }

    /**
     * Updates the account information for a user based on their email address. 
     * This is typically used for users to update their own profile information.
     * @param string $firstName The new first name.
     * @param string $lastName The new last name.
     * @param string $email The email address of the account to update (used as identifier).
     * @param string|null $phone The new phone number.
     * @return bool True if the update was successful, false otherwise.
     */
    public function updateAccountInfo($firstName, $lastName, $email, $phone) {
        $query = "UPDATE account 
                  SET first_name = :firstName, 
                      last_name = :lastName, 
                      phone = :phone 
                  WHERE email = :email";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':firstName', $firstName, PDO::PARAM_STR);
        $stmt->bindValue(':lastName', $lastName, PDO::PARAM_STR);
        $stmt->bindValue(':phone', $phone, PDO::PARAM_STR);
        $stmt->bindValue(':email', $email, PDO::PARAM_STR);

        return $stmt->execute();
    }

    /**
     * Deletes an account by its ID.
     * @param int $id The ID of the account to delete.
     * @return bool True if the deletion was successful, false otherwise.
     */
    public function deleteAccount($id) {
        $query = "DELETE FROM account 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    }


    /**
     * Deletes all account that havn't logged for more than 2 years.
     * @return int Number of deleted account.
     */
    public function deleteInactiveAccounts() {
        $query = "DELETE FROM account 
              WHERE last_login < DATE_SUB(NOW(), INTERVAL 2 YEAR) 
              AND role_id = 1";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->rowCount();
    }
}