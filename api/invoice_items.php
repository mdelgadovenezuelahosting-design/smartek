<?php
require 'db.php';
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT ii.*, p.name AS product_name FROM invoice_items ii JOIN products p ON ii.product_id=p.id ORDER BY ii.id DESC");
        echo json_encode($stmt->fetchAll());
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("INSERT INTO invoice_items (invoice_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['invoice_id'], $data['product_id'], $data['quantity'], $data['price']]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID requerido']); exit; }

        $data = json_decode(file_get_contents("php://input"), true);
        $stmt = $pdo->prepare("UPDATE invoice_items SET invoice_id=?, product_id=?, quantity=?, price=? WHERE id=?");
        $stmt->execute([$data['invoice_id'], $data['product_id'], $data['quantity'], $data['price'], $id]);
        echo json_encode(['success' => true]);
        break;

    case 'DELETE':
        parse_str($_SERVER['QUERY_STRING'], $params);
        $id = $params['id'] ?? null;
        if (!$id) { http_response_code(400); echo json_encode(['error' => 'ID requerido']); exit; }

        $stmt = $pdo->prepare("DELETE FROM invoice_items WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
?>

