<?php

$type = $_GET['type'] ?? '';
if (!in_array($type, ['hey', 'bye'], true)) {
    http_response_code(400);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'type must be hey or bye.']);
    return;
}
$apiEndpoint = 'greetings';
require dirname(__DIR__, 2) . '/api.php';
