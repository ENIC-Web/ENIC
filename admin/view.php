<?php
session_start();

// Проверка авторизации
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

require_once '../process_application.php';

$id = $_GET['id'] ?? 0;

try {
    // Получение данных заявки
    $stmt = $pdo->prepare("
        SELECT 
            a.*,
            pd.*,
            u.email as user_email
        FROM applications a
        LEFT JOIN personal_data pd ON a.id = pd.application_id
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.id = ?
    ");
    $stmt->execute([$id]);
    $application = $stmt->fetch();

    if (!$application) {
        header('Location: index.php');
        exit;
    }

    // Получение документов
    $stmt = $pdo->prepare("SELECT * FROM documents WHERE application_id = ?");
    $stmt->execute([$id]);
    $documents = $stmt->fetchAll();

    // Получение истории статусов
    $stmt = $pdo->prepare("
        SELECT 
            ash.*,
            u.email as changed_by_email
        FROM application_status_history ash
        LEFT JOIN users u ON ash.changed_by = u.id
        WHERE ash.application_id = ?
        ORDER BY ash.created_at DESC
    ");
    $stmt->execute([$id]);
    $status_history = $stmt->fetchAll();

} catch (PDOException $e) {
    $error = 'Ошибка при получении данных';
}

// Обработка изменения статуса
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['status'])) {
    try {
        $pdo->beginTransaction();

        // Обновляем статус заявки
        $stmt = $pdo->prepare("UPDATE applications SET status = ? WHERE id = ?");
        $stmt->execute([$_POST['status'], $id]);

        // Добавляем запись в историю
        $stmt = $pdo->prepare("INSERT INTO application_status_history (application_id, status, comment, changed_by) VALUES (?, ?, ?, ?)");
        $stmt->execute([$id, $_POST['status'], $_POST['comment'] ?? null, $_SESSION['admin_id']]);

        // Создаем уведомление
        $stmt = $pdo->prepare("INSERT INTO notifications (user_id, application_id, type, message) VALUES (?, ?, 'status_change', ?)");
        $message = "Статус вашей заявки изменен на: " . $_POST['status'];
        $stmt->execute([$application['user_id'], $id, $message]);

        $pdo->commit();
        header("Location: view.php?id=$id");
        exit;
    } catch (Exception $e) {
        $pdo->rollBack();
        $error = 'Ошибка при обновлении статуса';
    }
}
?>
<!DOCTYPE html>
<html lang="kk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Просмотр заявки - ENIC</title>
    <link rel="stylesheet" href="../css/style.css">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet">
    <style>
        .admin-container {
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .admin-title {
            color: var(--color-primary);
            font-size: 24px;
            margin: 0;
        }

        .admin-actions {
            display: flex;
            gap: 10px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: var(--color-secondary);
            color: #fff;
            border: none;
        }

        .btn-outline {
            background: transparent;
            color: var(--color-primary);
            border: 1px solid var(--color-primary);
        }

        .application-details {
            background: #fff;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            box-shadow: 0 2px 8px rgba(26,59,110,0.07);
        }

        .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }

        .detail-item {
            margin-bottom: 16px;
        }

        .detail-label {
            font-weight: 500;
            color: var(--color-text);
            margin-bottom: 4px;
        }

        .detail-value {
            color: #4a5568;
        }

        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            display: inline-block;
        }

        .status-new { background: #e3f2fd; color: #1976d2; }
        .status-in_progress { background: #fff3e0; color: #f57c00; }
        .status-approved { background: #e8f5e9; color: #388e3c; }
        .status-rejected { background: #ffebee; color: #d32f2f; }

        .documents-list {
            margin-top: 24px;
        }

        .document-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            margin-bottom: 8px;
        }

        .document-icon {
            width: 32px;
            height: 32px;
            background: #f8fafc;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-primary);
        }

        .document-info {
            flex: 1;
        }

        .document-name {
            font-weight: 500;
            margin-bottom: 4px;
        }

        .document-meta {
            font-size: 12px;
            color: #718096;
        }

        .status-history {
            margin-top: 24px;
        }

        .history-item {
            padding: 12px;
            border-left: 3px solid var(--color-primary);
            margin-bottom: 12px;
            background: #f8fafc;
        }

        .history-date {
            font-size: 12px;
            color: #718096;
            margin-bottom: 4px;
        }

        .history-status {
            font-weight: 500;
            margin-bottom: 4px;
        }

        .history-comment {
            color: #4a5568;
        }

        .status-form {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            font-size: 14px;
        }

        .form-group textarea {
            height: 100px;
            resize: vertical;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <h1 class="admin-title">Просмотр заявки #<?php echo htmlspecialchars($id); ?></h1>
            <div class="admin-actions">
                <a href="index.php" class="btn btn-outline">← Назад к списку</a>
            </div>
        </div>

        <?php if (isset($error)): ?>
            <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <div class="application-details">
            <div class="details-grid">
                <div class="detail-item">
                    <div class="detail-label">ФИО</div>
                    <div class="detail-value">
                        <?php echo htmlspecialchars($application['last_name'] . ' ' . $application['first_name'] . ' ' . $application['middle_name']); ?>
                    </div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value"><?php echo htmlspecialchars($application['email']); ?></div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Телефон</div>
                    <div class="detail-value"><?php echo htmlspecialchars($application['phone']); ?></div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Дата рождения</div>
                    <div class="detail-value"><?php echo date('d.m.Y', strtotime($application['birth_date'])); ?></div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Тип образования</div>
                    <div class="detail-value"><?php echo htmlspecialchars($application['education_type']); ?></div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Статус</div>
                    <div class="detail-value">
                        <span class="status-badge status-<?php echo htmlspecialchars($application['status']); ?>">
                            <?php echo htmlspecialchars($application['status']); ?>
                        </span>
                    </div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Дата создания</div>
                    <div class="detail-value"><?php echo date('d.m.Y H:i', strtotime($application['created_at'])); ?></div>
                </div>

                <div class="detail-item">
                    <div class="detail-label">Последнее обновление</div>
                    <div class="detail-value"><?php echo date('d.m.Y H:i', strtotime($application['updated_at'])); ?></div>
                </div>
            </div>

            <?php if ($documents): ?>
                <div class="documents-list">
                    <h3>Документы</h3>
                    <?php foreach ($documents as $doc): ?>
                        <div class="document-item">
                            <div class="document-icon">📄</div>
                            <div class="document-info">
                                <div class="document-name"><?php echo htmlspecialchars($doc['original_filename']); ?></div>
                                <div class="document-meta">
                                    <?php echo htmlspecialchars($doc['file_type']); ?> • 
                                    <?php echo number_format($doc['file_size'] / 1024, 2); ?> KB
                                </div>
                            </div>
                            <a href="../<?php echo htmlspecialchars($doc['file_path']); ?>" class="btn btn-outline" target="_blank">
                                Скачать
                            </a>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <?php if ($status_history): ?>
                <div class="status-history">
                    <h3>История статусов</h3>
                    <?php foreach ($status_history as $history): ?>
                        <div class="history-item">
                            <div class="history-date">
                                <?php echo date('d.m.Y H:i', strtotime($history['created_at'])); ?> • 
                                Изменил: <?php echo htmlspecialchars($history['changed_by_email']); ?>
                            </div>
                            <div class="history-status">
                                Статус изменен на: 
                                <span class="status-badge status-<?php echo htmlspecialchars($history['status']); ?>">
                                    <?php echo htmlspecialchars($history['status']); ?>
                                </span>
                            </div>
                            <?php if ($history['comment']): ?>
                                <div class="history-comment">
                                    <?php echo htmlspecialchars($history['comment']); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>

            <form method="POST" class="status-form">
                <h3>Изменить статус</h3>
                <div class="form-group">
                    <label for="status">Новый статус</label>
                    <select name="status" id="status" required>
                        <option value="new">Новая</option>
                        <option value="in_progress">В обработке</option>
                        <option value="approved">Одобрена</option>
                        <option value="rejected">Отклонена</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="comment">Комментарий</label>
                    <textarea name="comment" id="comment" placeholder="Укажите причину изменения статуса"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Обновить статус</button>
            </form>
        </div>
    </div>
</body>
</html> 