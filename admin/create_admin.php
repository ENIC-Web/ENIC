<?php
require_once '../process_application.php';

try {
    // Хешируем пароль
    $password = 'admin';
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    // Проверяем, существует ли уже пользователь с таким email
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute(['admin@example.com']);
    $existing_user = $stmt->fetch();

    if ($existing_user) {
        echo "Пользователь с email admin@example.com уже существует.";
    } else {
        // Добавляем нового администратора
        $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'admin')");
        $stmt->execute(['admin@example.com', $password_hash]);
        echo "Администратор успешно создан!<br>";
        echo "Email: admin@example.com<br>";
        echo "Пароль: admin";
    }
} catch (PDOException $e) {
    echo "Ошибка: " . $e->getMessage();
}
?> 