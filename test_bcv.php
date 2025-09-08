<?php
$ch = curl_init("https://ve.dolarapi.com/v1/dolares/oficial");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$valorDolar = $data['promedio'] ?? null;

if ($valorDolar) {
    echo "1 USD = " . number_format($valorDolar, 2, ',', '.') . " VES";
} else {
    echo "No se pudo obtener la tasa de cambio";
}
?>
