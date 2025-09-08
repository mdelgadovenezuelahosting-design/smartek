<?php
header('Content-Type: application/json');

$from = $_GET['from'] ?? 'USD';
$to = $_GET['to'] ?? 'VES';

if ($from === $to) {
    echo json_encode(['success' => true, 'rate' => 1]);
    exit;
}

$apiUrl = "https://ve.dolarapi.com/v1/dolares/oficial";
$response = file_get_contents($apiUrl);
if (!$response) {
    echo json_encode(['success' => false, 'message' => 'No se pudo obtener tasa']);
    exit;
}

$data = json_decode($response, true);
$rate = $data['promedio'] ?? null;

if (!$rate) {
    echo json_encode(['success' => false, 'message' => 'Tasa inválida']);
    exit;
}

// USD -> VES
if ($from === 'USD' && $to === 'VES') {
    echo json_encode(['success' => true, 'rate' => $rate]);
}
// VES -> USD
elseif ($from === 'VES' && $to === 'USD') {
    echo json_encode(['success' => true, 'rate' => 1 / $rate]);
} else {
    echo json_encode(['success' => false, 'message' => 'Conversión no soportada']);
}

