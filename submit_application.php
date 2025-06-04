<?php
session_start();
require_once 'process_application.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo->beginTransaction();

        // 1. Создаём пользователя (если email ещё не существует)
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$_POST['email']]);
        $user = $stmt->fetch();

        if (!$user) {
            $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'user')");
            $temp_password = bin2hex(random_bytes(8));
            $password_hash = password_hash($temp_password, PASSWORD_DEFAULT);
            $stmt->execute([$_POST['email'], $password_hash]);
            $user_id = $pdo->lastInsertId();
            $_SESSION['generated_password'] = $temp_password;
        } else {
            $user_id = $user['id'];
        }

        // 2. Создаём заявку
        $stmt = $pdo->prepare("INSERT INTO applications (user_id, education_type, agreement_accepted) VALUES (?, ?, 1)");
        $stmt->execute([$user_id, $_POST['educationType']]);
        $application_id = $pdo->lastInsertId();

        // 3. Сохраняем личные данные
        $stmt = $pdo->prepare("INSERT INTO personal_data (application_id, last_name, first_name, middle_name, birth_date, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $application_id,
            $_POST['lastName'],
            $_POST['firstName'],
            $_POST['middleName'],
            $_POST['birthDate'],
            $_POST['email'],
            $_POST['phone']
        ]);

        // 4. Обработка загруженного файла
        if (isset($_FILES['documentFile']) && $_FILES['documentFile']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['documentFile'];
            $file_name = $file['name'];
            $file_type = $file['type'];
            $file_size = $file['size'];
            $file_extension = pathinfo($file_name, PATHINFO_EXTENSION);
            $new_file_name = uniqid() . '.' . $file_extension;
            $upload_dir = 'uploads/documents/';
            if (!file_exists($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }
            $file_path = $upload_dir . $new_file_name;
            if (move_uploaded_file($file['tmp_name'], $file_path)) {
                $stmt = $pdo->prepare("INSERT INTO documents (application_id, file_path, file_type, original_filename, file_size) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$application_id, $file_path, $file_type, $file_name, $file_size]);
            }
        }

        // 5. История статусов
        $stmt = $pdo->prepare("INSERT INTO application_status_history (application_id, status, changed_by) VALUES (?, 'new', ?)");
        $stmt->execute([$application_id, $user_id]);

        // 6. Уведомление
        $stmt = $pdo->prepare("INSERT INTO notifications (user_id, application_id, type, message) VALUES (?, ?, 'status_change', 'Ваша заявка успешно создана')");
        $stmt->execute([$user_id, $application_id]);

        $pdo->commit();

        // Авторизация пользователя
        $_SESSION['user_id'] = $user_id;

        echo json_encode([
            'success' => true,
            'message' => 'Заявка успешно создана',
            'application_id' => $application_id
        ]);
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Ошибка при создании заявки: ' . $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Метод не поддерживается'
    ]);
} 