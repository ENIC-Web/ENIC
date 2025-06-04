<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit;
}
require_once '../process_application.php';
$user_id = $_SESSION['user_id'];

// Получаем личные данные пользователя (по последней заявке)
$stmt = $pdo->prepare("SELECT pd.* FROM personal_data pd JOIN applications a ON pd.application_id = a.id WHERE a.user_id = ? ORDER BY a.created_at DESC LIMIT 1");
$stmt->execute([$user_id]);
$personal = $stmt->fetch();

// Получаем все заявки пользователя
$stmt = $pdo->prepare("SELECT a.*, pd.last_name, pd.first_name, pd.middle_name, pd.birth_date, pd.email, pd.phone FROM applications a LEFT JOIN personal_data pd ON a.id = pd.application_id WHERE a.user_id = ? ORDER BY a.created_at DESC");
$stmt->execute([$user_id]);
$applications = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang='ru'>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate>Онлайн-заявка - ENIC</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/form-styles.css">
    <link rel="stylesheet" href="../css/animations.css">
    <link rel="stylesheet" href="../css/mobile.css">
    <link rel="stylesheet" href="../css/header.css">
    <script src="js/breadcrumbs.js" defer></script>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap" rel="stylesheet">
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
     <!-- Подключаем шапку -->
     <div id="header"></div>
    <title>Личный кабинет - ENIC</title>

    <style>
        body {
            padding-top: 120px;
        }
        @media (max-width: 992px) {
            body {
                padding-top: 70px;
            }
        }
        .cabinet-container { max-width: 900px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(26,59,110,0.07); padding: 40px; }
        .cabinet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .cabinet-title { color: var(--color-primary); font-size: 24px; margin: 0; }
        .logout-btn { color: #dc3545; text-decoration: none; font-weight: 500; }
        .logout-btn:hover { text-decoration: underline; }
        .personal-block { margin-bottom: 32px; }
        .personal-block h2 { font-size: 20px; margin-bottom: 12px; color: var(--color-secondary); }
        .personal-list { list-style: none; padding: 0; margin: 0; }
        .personal-list li { margin-bottom: 8px; color: #444; }
        .applications-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(26,59,110,0.07); }
        .applications-table th, .applications-table td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .applications-table th { background: #f8fafc; font-weight: 500; color: var(--color-text); }
        .applications-table tr:hover { background: #f8fafc; }
        .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
        .status-new { background: #e3f2fd; color: #1976d2; }
        .status-in_progress { background: #fff3e0; color: #f57c00; }
        .status-approved { background: #e8f5e9; color: #388e3c; }
        .status-rejected { background: #ffebee; color: #d32f2f; }
        .action-link { color: var(--color-primary); text-decoration: none; font-weight: 500; }
        .action-link:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class='cabinet-container'>
        <div class='cabinet-header'>
            <h1 class='cabinet-title'>Личный кабинет</h1>
            <a href='logout.php' class='logout-btn'>Выйти</a>
        </div>
        <div class='personal-block'>
            <h2>Личные данные</h2>
            <?php if ($personal): ?>
            <ul class='personal-list'>
                <li><b>ФИО:</b> <?php echo htmlspecialchars($personal['last_name'] . ' ' . $personal['first_name'] . ' ' . $personal['middle_name']); ?></li>
                <li><b>Дата рождения:</b> <?php echo htmlspecialchars($personal['birth_date']); ?></li>
                <li><b>Email:</b> <?php echo htmlspecialchars($personal['email']); ?></li>
                <li><b>Телефон:</b> <?php echo htmlspecialchars($personal['phone']); ?></li>
                <?php if (isset($_SESSION['generated_password'])): ?>
                    <li><b>Ваш пароль:</b> <span style="font-family:monospace; color:#1976d2; background:#f3f6fa; padding:2px 8px; border-radius:4px; letter-spacing:1px;"> <?php echo htmlspecialchars($_SESSION['generated_password']); ?></span> <span style="color: #1976d2; font-size: 0.95em;">(пароль сгенерирован)</span></li>
                <?php endif; ?>
            </ul>
            <?php else: ?>
            <div>Нет данных</div>
            <?php endif; ?>
        </div>
        <?php if (isset($_SESSION['password_success'])): ?>
            <div style="color:green; margin-bottom:16px;"> <?php echo $_SESSION['password_success']; unset($_SESSION['password_success']); ?> </div>
        <?php endif; ?>
        <?php if (isset($_SESSION['password_error'])): ?>
            <div style="color:red; margin-bottom:16px;"> <?php echo $_SESSION['password_error']; unset($_SESSION['password_error']); ?> </div>
        <?php endif; ?>
        <div class="personal-block">
            <h2>Сменить пароль для дальнейшего входа</h2>
            <form method="post" action="change_password.php" style="max-width:350px;">
                <div class="form-group">
                    <label>Новый пароль (запомните его):
                        <input type="password" name="new_password" required minlength="6">
                    </label>
                </div>
                <button type="submit" class="btn btn-primary">Сменить пароль</button>
            </form>
        </div>
        <h2>Мои заявки</h2>
        <table class='applications-table'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Тип образования</th>
                    <th>Статус</th>
                    <th>Дата создания</th>
                    <th>Действия</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($applications as $app): ?>
                <tr>
                    <td><?php echo htmlspecialchars($app['id']); ?></td>
                    <td><?php echo htmlspecialchars($app['education_type']); ?></td>
                    <td><span class='status-badge status-<?php echo htmlspecialchars($app['status']); ?>'><?php echo htmlspecialchars($app['status']); ?></span></td>
                    <td><?php echo date('d.m.Y H:i', strtotime($app['created_at'])); ?></td>
                    <td><a href='view.php?id=<?php echo $app['id']; ?>' class='action-link'>Подробнее</a></td>
                    <td>
                    <?php if ($app['status'] === 'new'): ?>
                        <button class="btn btn-outline delete-app-btn" data-id="<?php echo $app['id']; ?>" style="color:#d32f2f; border-color:#d32f2f;">Удалить</button>
                    <?php endif; ?>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <script src="../js/header-footer-upload.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.delete-app-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (!confirm('Вы действительно хотите удалить эту заявку?')) return;
                const appId = this.dataset.id;
                fetch('delete_application.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'id=' + encodeURIComponent(appId)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        // Удаляем строку из таблицы
                        this.closest('tr').remove();
                    } else {
                        alert('Ошибка: ' + data.message);
                    }
                })
                .catch(() => alert('Ошибка при удалении заявки.'));
            });
        });
    });
    </script>
     <!-- Подключаем подвал -->
     <footer class="footer" id="footer"></footer>

<script src="js/translations.js"></script>
<script src="js/mobile-nav.js"></script>
<script src="js/header.js"></script>
<script src="js/header-footer-upload.js"></script>
</body>
</html> 