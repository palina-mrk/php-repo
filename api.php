<?php
header('Content-Type: application/json; charset=utf-8');

const URL = 'https://sendmelead.com/api/v3/lead/add';

$name = trim((string) ($_POST['name'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));

if ($name === '' || $phone === '') {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'status' => 'error',
        'message' => 'Name and phone are required',
    ]);
    exit;
}

$body = [
    'offerId' => '9f3ed64c-44f7-4608-ad95-41d805db5ccf',
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'name' => $name,
    'phone' => $phone,
    'clickid' => $_POST['sub1'] ?? '',
    'utm_medium' => $_POST['sub2'] ?? '',
    'utm_term' => $name,
    'utm_content' => $phone,
];

$payload = json_encode($body);
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => [
            'Content-Type: application/json',
            'Content-Length: ' . strlen($payload),
            'X-Token: 3dede3bd8f2c5bb88189d6f9fa440340',
        ],
        'content' => $payload,
        'ignore_errors' => true,
    ],
]);

$result = @file_get_contents(URL, false, $context);

date_default_timezone_set('Etc/GMT-3');
$txt = PHP_EOL . 'LEAD' . PHP_EOL;
$txt .= date('F j, Y,H:i:s') . PHP_EOL;
foreach ($body as $key => $value) {
    $txt .= "$key: $value" . PHP_EOL;
}
$txt .= ($result !== false ? $result : 'REQUEST_FAILED') . PHP_EOL;
@file_put_contents(__DIR__ . '/lead.txt', $txt, FILE_APPEND);

if ($result === false) {
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'status' => 'error',
        'message' => 'API request failed',
    ]);
    exit;
}

$decoded = json_decode($result, true);
if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
    echo json_encode($decoded);
    exit;
}

$isSuccess = stripos($result, 'success') !== false || stripos($result, 'ok') !== false;

echo json_encode([
    'success' => $isSuccess,
    'status' => $isSuccess ? 'success' : 'error',
    'raw' => $result,
]);
