<?php
session_start();
require_once 'process_application.php';
if (isset($_SESSION['user_id'])) {
    header('Location: user/index.php');
    exit;
}
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        header('Location: user/index.php');
        exit;
    } else {
        $error = 'Неверный email или пароль';
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Вход в личный кабинет</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div id="header"></div>
    <main>
        <form method="post" class="form" style="max-width:400px;margin:40px auto;">
            <h2>Вход в личный кабинет</h2>
            <?php if ($error): ?>
                <div class="error-message" style="color:red; margin-bottom:12px;"> <?= htmlspecialchars($error) ?> </div>
            <?php endif; ?>
            <div class="form-group">
                <label>Email: <input type="email" name="email" required></label>
            </div>
            <div class="form-group">
                <label>Пароль: <input type="password" name="password" required></label>
            </div>
            <button type="submit" class="btn btn-primary">Войти</button>
        </form>
    </main>
    <footer class="footer" id="footer"></footer>
    <script src="js/header-footer-upload.js"></script>
</body>
</html> 