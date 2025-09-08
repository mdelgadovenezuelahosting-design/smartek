<?php
session_start();

// Credenciales válidas
$valid_username = "socram1009";
$valid_password = "0qXTOXuN8HDb";

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
    
    if ($username === $valid_username && $password === $valid_password) {
        // Credenciales correctas
        $_SESSION['auth'] = true;
        $_SESSION['username'] = $username;
        echo json_encode(["success" => true]);
        exit;
    } else {
        // Credenciales incorrectas
        echo json_encode(["success" => false, "message" => "Usuario o contraseña incorrectos"]);
        exit;
    }
}
?>
