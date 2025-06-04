<?php
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Нет доступа']);
    exit;
}
require_once '../process_application.php';
$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $app_id = (int)$_POST['id'];
    // Проверяем, что заявка принадлежит пользователю и статус 'new'
    $stmt = $pdo->prepare('SELECT * FROM applications WHERE id = ? AND user_id = ? AND status = "new"');
    $stmt->execute([$app_id, $user_id]);
    $app = $stmt->fetch();
    if (!$app) {
        echo json_encode(['success' => false, 'message' => 'Заявка не найдена или уже в работе']);
        exit;
    }
    // Удаляем связанные данные
    $pdo->beginTransaction();
    try {
        $pdo->prepare('DELETE FROM application_status_history WHERE application_id = ?')->execute([$app_id]);
        $pdo->prepare('DELETE FROM notifications WHERE application_id = ?')->execute([$app_id]);
        $pdo->prepare('DELETE FROM documents WHERE application_id = ?')->execute([$app_id]);
        $pdo->prepare('DELETE FROM personal_data WHERE application_id = ?')->execute([$app_id]);
        $pdo->prepare('DELETE FROM applications WHERE id = ?')->execute([$app_id]);
        $pdo->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => 'Ошибка при удалении: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Некорректный запрос']);
} 