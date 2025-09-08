<?php
session_start();
echo "Session ID: " . session_id() . "<br>";
echo "Session status: " . session_status() . "<br>";

$_SESSION['test'] = 'SESION_FUNCIONA';
echo "Session test value: " . ($_SESSION['test'] ?? 'NO_SET') . "<br>";

// Verificar si las sesiones persisten
if(isset($_SESSION['test'])) {
    echo "✅ LAS SESIONES ESTÁN FUNCIONANDO<br>";
} else {
    echo "❌ PROBLEMA CON LAS SESIONES<br>";
}

// Verificar configuración
echo "session.save_path: " . ini_get('session.save_path') . "<br>";
?>
