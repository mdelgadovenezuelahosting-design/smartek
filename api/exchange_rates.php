<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Incluir la conexión a la base de datos centralizada
require_once 'db.php'; // Ajusta la ruta según tu estructura de carpetas

try {
    // Obtener la tasa más reciente
    $stmt = $pdo->query("SELECT rate, updated_at FROM exchange_rates ORDER BY updated_at DESC LIMIT 1");
    $row = $stmt->fetch();

    if ($row) {
        echo json_encode([
            'rate' => floatval($row['rate']),
            'updated_at' => $row['updated_at']
        ]);
    } else {
        echo json_encode([
            'rate' => null,
            'updated_at' => null
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener la tasa: ' . $e->getMessage()]);
}

