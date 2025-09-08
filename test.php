<?php
// Script de diagnóstico para el problema de redirección
echo "<h2>Diagnóstico del problema de redirección</h2>";

// 1. Verificar si existe login.html
echo "<h3>1. Archivos de login existentes:</h3>";
$files = ['login.html', 'login.php', '.htaccess'];
foreach ($files as $file) {
    if (file_exists($file)) {
        echo "<p style='color:green;'>✓ $file existe (" . filesize($file) . " bytes)</p>";
    } else {
        echo "<p style='color:red;'>✗ $file no existe</p>";
    }
}

// 2. Verificar contenido de .htaccess
echo "<h3>2. Contenido de .htaccess:</h3>";
if (file_exists('.htaccess')) {
    $content = htmlspecialchars(file_get_contents('.htaccess'));
    echo "<pre>$content</pre>";
} else {
    echo "<p>No existe archivo .htaccess</p>";
}

// 3. Buscar redirecciones en archivos PHP
echo "<h3>3. Búsqueda de redirecciones en archivos PHP:</h3>";
function buscarRedirecciones($directorio) {
    $resultados = [];
    $archivos = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($directorio),
        RecursiveIteratorIterator::SELF_FIRST
    );
    
    foreach ($archivos as $archivo) {
        if ($archivo->isFile() && $archivo->getExtension() === 'php') {
            $contenido = file_get_contents($archivo->getRealPath());
            if (preg_match('/header\s*\(\s*["\']Location:\s*[^"\']*login\.html["\']\s*\)/i', $contenido)) {
                $resultados[] = $archivo->getRealPath();
            }
        }
    }
    
    return $resultados;
}

$redirecciones = buscarRedirecciones(__DIR__);
if (count($redirecciones) > 0) {
    echo "<p style='color:red;'>Se encontraron redirecciones a login.html en:</p>";
    echo "<ul>";
    foreach ($redirecciones as $archivo) {
        echo "<li>" . htmlspecialchars($archivo) . "</li>";
    }
    echo "</ul>";
} else {
    echo "<p style='color:green;'>No se encontraron redirecciones PHP a login.html</p>";
}

// 4. Verificar configuración del servidor
echo "<h3>4. Información del servidor:</h3>";
echo "<p>Software: " . $_SERVER['SERVER_SOFTWARE'] . "</p>";
echo "<p>PHP: " . phpversion() . "</p>";

// 5. Probar si mod_rewrite está habilitado
echo "<h3>5. Prueba de mod_rewrite:</h3>";
if (function_exists('apache_get_modules')) {
    $modulos = apache_get_modules();
    if (in_array('mod_rewrite', $modulos)) {
        echo "<p style='color:green;'>✓ mod_rewrite está habilitado</p>";
    } else {
        echo "<p style='color:red;'>✗ mod_rewrite NO está habilitado</p>";
    }
} else {
    echo "<p>No se puede verificar mod_rewrite (apache_get_modules no disponible)</p>";
}
?>
