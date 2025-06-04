<?php
session_start();

// Если пользователь уже авторизован, перенаправляем в личный кабинет
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

require_once '../process_application.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';

    try {
        $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE email = ? AND role = 'user'");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            header('Location: index.php');
            exit;
        } else {
            $error = 'Неверный email или пароль';
        }
    } catch (PDOException $e) {
        $error = 'Ошибка при входе в систему';
    }
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход в личный кабинет</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        body { background: #f8fafc; min-height: 100vh; margin: 100px; padding: 1px; }
        .login-container { width: 100%; max-width: 400px; padding: 40px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(26,59,110,0.07); margin: 0 auto; margin-top: 120px; }
        .login-header { text-align: center; margin-bottom: 30px; }
        .login-header h1 { color: var(--color-primary); font-size: 24px; margin-bottom: 10px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; color: var(--color-text); font-weight: 500; }
        .form-group input { width: 100%; padding: 12px; border: 1.5px solid #b0b8c9; border-radius: 4px; font-size: 1rem; background: #f8fafc; transition: all 0.3s ease; }
        .form-group input:focus { border-color: var(--color-secondary); background: #fff; outline: none; box-shadow: 0 2px 8px rgba(255,107,53,0.08); }
        .error-message { color: #dc3545; font-size: 0.875rem; margin-top: 5px; }
        .btn-login { width: 100%; padding: 12px; background: var(--color-secondary); color: #fff; border: none; border-radius: 4px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
        .btn-login:hover { background: #E55A2A; transform: translateY(-1px); }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h1>Вход в личный кабинет</h1>
            <p>ENIC - Проверка статуса заявок</p>
        </div>
        <?php if (isset($error)): ?>
            <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        <form method="POST" action="">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="password">Пароль</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn-login">Войти</button>
        </form>
    </div>
</body>
</html> 