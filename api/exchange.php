<?php
header('Content-Type: application/json');

$ch = curl_init("https://ve.dolarapi.com/v1/dolares/oficial");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$valorDolar = $data['promedio'] ?? null;

if ($valorDolar) {
    echo json_encode([
        'success' => true,
        'rate' => floatval($valorDolar)
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo obtener la tasa de cambio'
    ]);
}

