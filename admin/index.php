<?php
session_start();

// Проверка авторизации
if (!isset($_SESSION['admin_id'])) {
    header('Location: login.php');
    exit;
}

require_once '../process_application.php';

// Получение списка заявок
try {
    $stmt = $pdo->query("
        SELECT 
            a.id,
            a.status,
            a.education_type,
            a.created_at,
            pd.last_name,
            pd.first_name,
            pd.email,
            pd.phone,
            (SELECT COUNT(*) FROM documents d WHERE d.application_id = a.id) as documents_count
        FROM applications a
        LEFT JOIN personal_data pd ON a.id = pd.application_id
        ORDER BY a.created_at DESC
    ");
    $applications = $stmt->fetchAll();
} catch (PDOException $e) {
    $error = 'Ошибка при получении данных: ' . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="kk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель - ENIC</title>
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

        .applications-table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(26,59,110,0.07);
        }

        .applications-table th,
        .applications-table td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        .applications-table th {
            background: #f8fafc;
            font-weight: 500;
            color: var(--color-text);
        }

        .applications-table tr:hover {
            background: #f8fafc;
        }

        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
        }

        .status-new { background: #e3f2fd; color: #1976d2; }
        .status-in_progress { background: #fff3e0; color: #f57c00; }
        .status-approved { background: #e8f5e9; color: #388e3c; }
        .status-rejected { background: #ffebee; color: #d32f2f; }

        .action-link {
            color: var(--color-primary);
            text-decoration: none;
            font-weight: 500;
        }

        .action-link:hover {
            text-decoration: underline;
        }

        .logout-btn {
            color: #dc3545;
            text-decoration: none;
            font-weight: 500;
        }

        .logout-btn:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <h1 class="admin-title">Админ-панель ENIC</h1>
            <div class="admin-actions">
                <a href="logout.php" class="logout-btn">Выйти</a>
            </div>
        </div>

        <?php if (isset($error)): ?>
            <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <table class="applications-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Тип образования</th>
                    <th>Статус</th>
                    <th>Документы</th>
                    <th>Дата создания</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <?php if (isset($applications) && is_array($applications)): ?>
                    <?php foreach ($applications as $app): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($app['id']); ?></td>
                            <td><?php echo htmlspecialchars($app['last_name'] . ' ' . $app['first_name']); ?></td>
                            <td><?php echo htmlspecialchars($app['email']); ?></td>
                            <td><?php echo htmlspecialchars($app['phone']); ?></td>
                            <td><?php echo htmlspecialchars($app['education_type']); ?></td>
                            <td>
                                <span class="status-badge status-<?php echo htmlspecialchars($app['status']); ?>">
                                    <?php echo htmlspecialchars($app['status']); ?>
                                </span>
                            </td>
                            <td><?php echo htmlspecialchars($app['documents_count']); ?></td>
                            <td><?php echo date('d.m.Y H:i', strtotime($app['created_at'])); ?></td>
                            <td>
                                <a href="view.php?id=<?php echo $app['id']; ?>" class="action-link">Просмотр</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</body>
</html> 