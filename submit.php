<?php
// Включаем отображение ошибок (для отладки)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Проверяем, что запрос POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $message = $_POST['message'] ?? '';

    // Можно сохранить в файл
    $line = date('Y-m-d H:i:s') . " | $name | $email | $phone | $message\n";
    file_put_contents('requests.txt', $line, FILE_APPEND);

    // Перенаправление
    header('Location: thankyou.html');
    exit;
}

// Если не POST — на главную
header('Location: index.html');
exit;