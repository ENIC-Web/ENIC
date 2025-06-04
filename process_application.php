<?php
// Подключение к базе данных
$db_host = 'localhost';
$db_name = 'ENIC';
$db_user = 'root';
$db_pass = '';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}

// В этом файле больше не должно быть никакой логики обработки POST/GET и вывода JSON!
?> 