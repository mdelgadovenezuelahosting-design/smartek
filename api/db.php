<?php
header('Content-Type: application/json');

// Incluir configuración segura DESDE FUERA de public_html
require_once '/home/smartek/smartek/config/database.php';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET, 
        DB_USER, 
        DB_PASSWORD, 
        $options
    );
} catch (PDOException $e) {
    // Log seguro del error (no exponer detalles)
    error_log("Database connection error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
    exit;
}
?>
