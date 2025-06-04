<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: ../application.html');
    exit;
}
require_once '../process_application.php';
$user_id = $_SESSION['user_id'];
$id = $_GET['id'] ?? 0;

// Получаем заявку только если она принадлежит пользователю
$stmt = $pdo->prepare("SELECT a.*, pd.last_name, pd.first_name, pd.middle_name, pd.birth_date, pd.email, pd.phone FROM applications a LEFT JOIN personal_data pd ON a.id = pd.application_id WHERE a.id = ? AND a.user_id = ?");
$stmt->execute([$id, $user_id]);
$application = $stmt->fetch();
if (!$application) {
    header('Location: index.php');
    exit;
}
// Документы
$stmt = $pdo->prepare("SELECT * FROM documents WHERE application_id = ?");
$stmt->execute([$id]);
$documents = $stmt->fetchAll();
// История статусов
$stmt = $pdo->prepare("SELECT * FROM application_status_history WHERE application_id = ? ORDER BY created_at DESC");
$stmt->execute([$id]);
$status_history = $stmt->fetchAll();
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
    <style>
        .cabinet-container { max-width: 900px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(26,59,110,0.07); padding: 40px; }
        .cabinet-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .cabinet-title { color: var(--color-primary); font-size: 24px; margin: 0; }
        .back-link { color: var(--color-primary); text-decoration: none; font-weight: 500; }
        .back-link:hover { text-decoration: underline; }
        .details-block { margin-bottom: 32px; }
        .details-block h2 { font-size: 20px; margin-bottom: 12px; color: var(--color-secondary); }
        .details-list { list-style: none; padding: 0; margin: 0; }
        .details-list li { margin-bottom: 8px; color: #444; }
        .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
        .status-new { background: #e3f2fd; color: #1976d2; }
        .status-in_progress { background: #fff3e0; color: #f57c00; }
        .status-approved { background: #e8f5e9; color: #388e3c; }
        .status-rejected { background: #ffebee; color: #d32f2f; }
        .documents-list { margin-bottom: 32px; }
        .document-item { margin-bottom: 8px; }
        .history-block { margin-top: 32px; }
        .history-item { background: #f8fafc; border-left: 3px solid var(--color-primary); padding: 12px; margin-bottom: 10px; }
        .history-date { font-size: 12px; color: #718096; margin-bottom: 4px; }
        .history-status { font-weight: 500; margin-bottom: 4px; }
        .history-comment { color: #4a5568; }
        body {
            padding-top: 120px;
        }
        @media (max-width: 992px) {
            body {
                padding-top: 70px;
            }
        }
    </style>
</head>
<body>
    <div class='cabinet-container'>
        <div class='cabinet-header'>
            <h1 class='cabinet-title'>Заявка #<?php echo htmlspecialchars($id); ?></h1>
            <a href='index.php' class='back-link'>← К списку заявок</a>
        </div>
        <div class='details-block'>
            <h2>Детали заявки</h2>
            <ul class='details-list'>
                <li><b>ФИО:</b> <?php echo htmlspecialchars($application['last_name'] . ' ' . $application['first_name'] . ' ' . $application['middle_name']); ?></li>
                <li><b>Дата рождения:</b> <?php echo htmlspecialchars($application['birth_date']); ?></li>
                <li><b>Email:</b> <?php echo htmlspecialchars($application['email']); ?></li>
                <li><b>Телефон:</b> <?php echo htmlspecialchars($application['phone']); ?></li>
                <li><b>Тип образования:</b> <?php echo htmlspecialchars($application['education_type']); ?></li>
                <li><b>Статус:</b> <span class='status-badge status-<?php echo htmlspecialchars($application['status']); ?>'><?php echo htmlspecialchars($application['status']); ?></span></li>
                <li><b>Дата создания:</b> <?php echo date('d.m.Y H:i', strtotime($application['created_at'])); ?></li>
                <li><b>Последнее обновление:</b> <?php echo date('d.m.Y H:i', strtotime($application['updated_at'])); ?></li>
            </ul>
        </div>
        <?php if ($documents): ?>
        <div class='documents-list'>
            <h2>Документы</h2>
            <?php foreach ($documents as $doc): ?>
            <div class='document-item'>
                <a href='../<?php echo htmlspecialchars($doc['file_path']); ?>' target='_blank'><?php echo htmlspecialchars($doc['original_filename']); ?></a>
                (<?php echo number_format($doc['file_size'] / 1024, 2); ?> KB)
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
        <?php if ($status_history): ?>
        <div class='history-block'>
            <h2>История статусов</h2>
            <?php foreach ($status_history as $history): ?>
            <div class='history-item'>
                <div class='history-date'><?php echo date('d.m.Y H:i', strtotime($history['created_at'])); ?></div>
                <div class='history-status'>Статус: <span class='status-badge status-<?php echo htmlspecialchars($history['status']); ?>'><?php echo htmlspecialchars($history['status']); ?></span></div>
                <?php if ($history['comment']): ?>
                <div class='history-comment'><?php echo htmlspecialchars($history['comment']); ?></div>
                <?php endif; ?>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
    <script src="../js/header-footer-upload.js"></script>

         <!-- Подключаем подвал -->
         <footer class="footer" id="footer"></footer>

<script src="js/translations.js"></script>
<script src="js/mobile-nav.js"></script>
<script src="js/header.js"></script>
<script src="js/header-footer-upload.js"></script>

</body>
</html> 