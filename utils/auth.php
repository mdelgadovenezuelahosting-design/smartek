<?php
session_start();
require_once '/home/smartek/smartek/config/database.php';

// Verificar si el usuario ya está autenticado
function isAuthenticated() {
    return isset($_SESSION['auth']) && $_SESSION['auth'] === true;
}

// Redirigir a login si no está autenticado
function requireAuth() {
    if (!isAuthenticated()) {
        header("Location: ../login.php");
        exit;
    }
}

// Redirigir a index si ya está autenticado
function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        header("Location: ../index.php");
        exit;
    }
}

// Procesar login
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
            DB_USER,
            DB_PASSWORD
        );
        
        // Buscar usuario en la base de datos
        $stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = ? AND active = 1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            // Credenciales correctas
            $_SESSION['auth'] = true;
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $username;
            echo json_encode(["success" => true]);
            exit;
        } else {
            // Credenciales incorrectas
            echo json_encode(["success" => false, "message" => "Usuario o contraseña incorrectos"]);
            exit;
        }
    } catch (PDOException $e) {
        error_log("Auth error: " . $e->getMessage());
        echo json_encode(["success" => false, "message" => "Error interno del sistema"]);
        exit;
    }
}
?>
