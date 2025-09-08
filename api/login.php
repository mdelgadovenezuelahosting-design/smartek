<?php
session_start();
include_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Usuario y contraseña son requeridos']);
        exit;
    }

    try {
        // Consulta CORREGIDA para usar password_hash en lugar de password
        $query = "SELECT id, username, password_hash, full_name, role, is_active FROM users WHERE username = :username AND is_active = 1";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            // Verificar la contraseña (usando password_hash)
            if (password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['full_name'] = $user['full_name'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['logged_in'] = true;
                
                // Actualizar último login
                $update_sql = "UPDATE users SET last_login = NOW() WHERE id = :user_id";
                $update_stmt = $pdo->prepare($update_sql);
                $update_stmt->bindParam(':user_id', $user['id']);
                $update_stmt->execute();
                
                echo json_encode([
                    'success' => true, 
                    'message' => 'Login exitoso',
                    'user' => [
                        'id' => $user['id'],
                        'username' => $user['username'],
                        'full_name' => $user['full_name'],
                        'role' => $user['role']
                    ]
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
            }
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado o inactivo']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error del sistema: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
?>
