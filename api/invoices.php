<?php
header('Content-Type: application/json');
require_once 'db.php'; // tu archivo de conexión a la DB

try {
    $method = $_SERVER['REQUEST_METHOD'];

    // GET: obtener todas las facturas
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM invoices ORDER BY id DESC");
        $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($invoices);
        exit;
    }

    // POST: crear nueva factura
    if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        // Validaciones mínimas
        if (empty($data['clientId']) || empty($data['items'])) {
            echo json_encode(['success' => false, 'message' => 'Cliente o items faltantes']);
            exit;
        }

        // Calcular totales
        $subtotal = 0;
        foreach ($data['items'] as $item) {
            $subtotal += $item['total'];
        }
        $ivaAmount = $subtotal * ($data['ivaRate'] / 100);
        $total = $subtotal + $ivaAmount;

        // Generar número de factura (simple: incremental)
        $stmt = $pdo->query("SELECT MAX(id) AS last_id FROM invoices");
        $lastId = $stmt->fetch(PDO::FETCH_ASSOC)['last_id'] ?? 0;
        $invoiceNumber = $lastId + 1;

        // Insertar factura
        $stmt = $pdo->prepare("INSERT INTO invoices (invoice_number, client_id, date, subtotal, iva_rate, iva_amount, total, currency, status, notes)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $invoiceNumber,
            $data['clientId'],
            $data['date'],
            $subtotal,
            $data['ivaRate'],
            $ivaAmount,
            $total,
            $data['currency'],
            'pending',
            $data['notes'] ?? ''
        ]);

        $invoiceId = $pdo->lastInsertId();

        // Insertar items de la factura
        $stmtItem = $pdo->prepare("INSERT INTO invoice_items (invoice_id, product_id, product_name, price, quantity, total)
                                   VALUES (?, ?, ?, ?, ?, ?)");
        foreach ($data['items'] as $item) {
            $stmtItem->execute([
                $invoiceId,
                $item['productId'],
                $item['productName'],
                $item['price'],
                $item['quantity'],
                $item['total']
            ]);
        }

        echo json_encode(['success' => true, 'invoiceNumber' => $invoiceNumber]);
        exit;
    }

    // PUT: actualizar factura (opcional)
    if ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            echo json_encode(['success' => false, 'message' => 'ID de factura requerido']);
            exit;
        }

        // Ejemplo: actualizar estado de factura
        $stmt = $pdo->prepare("UPDATE invoices SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'] ?? 'pending', $data['id']]);
        echo json_encode(['success' => true]);
        exit;
    }

    // DELETE: eliminar factura
    if ($method === 'DELETE') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['id'])) {
            echo json_encode(['success' => false, 'message' => 'ID de factura requerido']);
            exit;
        }

        // Primero eliminar items
        $stmt = $pdo->prepare("DELETE FROM invoice_items WHERE invoice_id = ?");
        $stmt->execute([$data['id']]);

        // Luego eliminar factura
        $stmt = $pdo->prepare("DELETE FROM invoices WHERE id = ?");
        $stmt->execute([$data['id']]);

        echo json_encode(['success' => true]);
        exit;
    }

    // Método no soportado
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no soportado']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

