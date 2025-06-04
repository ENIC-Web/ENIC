<?php
session_start();
require_once '../process_application.php';
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    header('Location: ../login.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_password = $_POST['new_password'];
    if (strlen($new_password) < 6) {
        $_SESSION['password_error'] = 'Пароль должен быть не менее 6 символов';
        header('Location: index.php');
        exit;
    }
    $hash = password_hash($new_password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
    $stmt->execute([$hash, $user_id]);
    unset($_SESSION['generated_password']);
    $_SESSION['password_success'] = 'Пароль успешно изменён!';
    header('Location: index.php');
    exit;
}
header('Location: index.php'); 