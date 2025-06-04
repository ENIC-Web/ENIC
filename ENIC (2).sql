-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 03 2025 г., 14:43
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `ENIC`
--

-- --------------------------------------------------------

--
-- Структура таблицы `applications`
--

CREATE TABLE `applications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` enum('new','in_progress','approved','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `education_type` enum('bachelor','master','phd') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `agreement_accepted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `applications`
--

INSERT INTO `applications` (`id`, `user_id`, `status`, `education_type`, `created_at`, `updated_at`, `comments`, `agreement_accepted`) VALUES
(1, 2, 'in_progress', 'bachelor', '2025-06-02 19:30:14', '2025-06-02 19:51:31', NULL, 1),
(2, 5, 'rejected', 'master', '2025-06-02 20:07:18', '2025-06-02 20:11:11', NULL, 1),
(4, 5, 'in_progress', 'bachelor', '2025-06-02 20:40:37', '2025-06-02 20:41:34', NULL, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `application_status_history`
--

CREATE TABLE `application_status_history` (
  `id` int NOT NULL,
  `application_id` int NOT NULL,
  `status` enum('new','in_progress','approved','rejected') COLLATE utf8mb4_unicode_ci NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `changed_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `application_status_history`
--

INSERT INTO `application_status_history` (`id`, `application_id`, `status`, `comment`, `changed_by`, `created_at`) VALUES
(1, 1, 'new', NULL, 2, '2025-06-02 19:30:14'),
(2, 1, 'in_progress', '', 4, '2025-06-02 19:51:31'),
(3, 2, 'new', NULL, 5, '2025-06-02 20:07:18'),
(5, 2, 'rejected', '', 4, '2025-06-02 20:11:11'),
(6, 4, 'new', NULL, 5, '2025-06-02 20:40:37'),
(8, 4, 'in_progress', 'енаев', 4, '2025-06-02 20:41:34');

-- --------------------------------------------------------

--
-- Структура таблицы `documents`
--

CREATE TABLE `documents` (
  `id` int NOT NULL,
  `application_id` int NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','verified','rejected') COLLATE utf8mb4_unicode_ci DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `documents`
--

INSERT INTO `documents` (`id`, `application_id`, `file_path`, `file_type`, `original_filename`, `file_size`, `uploaded_at`, `status`) VALUES
(1, 1, 'uploads/documents/683dfbc65c78a.png', 'image/png', 'Снимок экрана 2025-05-24 022920.png', 100265, '2025-06-02 19:30:14', 'pending'),
(2, 2, 'uploads/documents/683e0476c71b8.png', 'image/png', 'Снимок экрана 2024-04-11 170658.png', 3252, '2025-06-02 20:07:18', 'pending'),
(4, 4, 'uploads/documents/683e0c453099a.png', 'image/png', 'Снимок экрана 2024-04-11 170750.png', 3672, '2025-06-02 20:40:37', 'pending');

-- --------------------------------------------------------

--
-- Структура таблицы `notifications`
--

CREATE TABLE `notifications` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `application_id` int NOT NULL,
  `type` enum('status_change','document_verification','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `application_id`, `type`, `message`, `is_read`, `created_at`) VALUES
(1, 2, 1, 'status_change', 'Ваша заявка успешно создана', 0, '2025-06-02 19:30:14'),
(2, 2, 1, 'status_change', 'Статус вашей заявки изменен на: in_progress', 0, '2025-06-02 19:51:31'),
(3, 5, 2, 'status_change', 'Ваша заявка успешно создана', 0, '2025-06-02 20:07:18'),
(5, 5, 2, 'status_change', 'Статус вашей заявки изменен на: rejected', 0, '2025-06-02 20:11:11'),
(6, 5, 4, 'status_change', 'Ваша заявка успешно создана', 0, '2025-06-02 20:40:37'),
(8, 5, 4, 'status_change', 'Статус вашей заявки изменен на: in_progress', 0, '2025-06-02 20:41:34');

-- --------------------------------------------------------

--
-- Структура таблицы `personal_data`
--

CREATE TABLE `personal_data` (
  `id` int NOT NULL,
  `application_id` int NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `middle_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `personal_data`
--

INSERT INTO `personal_data` (`id`, `application_id`, `last_name`, `first_name`, `middle_name`, `birth_date`, `email`, `phone`, `created_at`, `updated_at`) VALUES
(1, 1, 'Пасецкий', 'Алексей', 'Александрович', '2025-06-26', 'spectralpa@gmail.com', '+7 (777) 777-77-77', '2025-06-02 19:30:14', '2025-06-02 19:30:14'),
(2, 2, 'ТЕСТ', 'ТЕСТ', 'ТЕСТ', '2025-06-04', 'spectral@gmail.com', '+7 (777) 777-77-77', '2025-06-02 20:07:18', '2025-06-02 20:07:18'),
(4, 4, 'ТЕСТ', 'ТЕСТ', 'ТЕСТ', '2025-06-04', 'spectral@gmail.com', '+7 (777) 777-77-77', '2025-06-02 20:40:37', '2025-06-02 20:40:37');

-- --------------------------------------------------------

--
-- Структура таблицы `settings`
--

CREATE TABLE `settings` (
  `id` int NOT NULL,
  `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin','moderator') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `created_at`, `updated_at`, `last_login_at`) VALUES
(2, 'spectralpa@gmail.com', '$2y$10$mlo/V8Q9mPOIdn.AtYsOJu2X7m/oikmtzNMhR9XVD1bv4dzzr4Dre', 'user', '2025-06-02 19:30:14', '2025-06-03 10:17:20', NULL),
(4, 'admin@example.com', '$2y$10$lNsO6MnENOEQdldwkc/3zePFb7qFgVYYmSb0DutipPahvPZ1EeFC.', 'admin', '2025-06-02 19:38:48', '2025-06-02 19:38:48', NULL),
(5, 'spectral@gmail.com', '$2y$10$YM5yP45opP0riGpvNwlHVutpXliY1QWJtYRCE8Cv44xuLXyENoThy', 'user', '2025-06-02 20:07:18', '2025-06-02 20:07:18', NULL),
(6, 'spectralassasin15@gmail.com', '$2y$10$vMvBVkTxUrnD6MaS1miS4u6qex5xFAkOEWye2dAtsWFdd4uzweIUG', 'user', '2025-06-03 09:12:20', '2025-06-03 09:12:20', NULL);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_education_type` (`education_type`);

--
-- Индексы таблицы `application_status_history`
--
ALTER TABLE `application_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `changed_by` (`changed_by`),
  ADD KEY `idx_application_status` (`application_id`,`status`);

--
-- Индексы таблицы `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `idx_status` (`status`);

--
-- Индексы таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `idx_user_read` (`user_id`,`is_read`);

--
-- Индексы таблицы `personal_data`
--
ALTER TABLE `personal_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `application_id` (`application_id`),
  ADD KEY `idx_names` (`last_name`,`first_name`);

--
-- Индексы таблицы `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`),
  ADD KEY `idx_key` (`key`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT для таблицы `application_status_history`
--
ALTER TABLE `application_status_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT для таблицы `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT для таблицы `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT для таблицы `personal_data`
--
ALTER TABLE `personal_data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT для таблицы `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `application_status_history`
--
ALTER TABLE `application_status_history`
  ADD CONSTRAINT `application_status_history_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `application_status_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Ограничения внешнего ключа таблицы `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `personal_data`
--
ALTER TABLE `personal_data`
  ADD CONSTRAINT `personal_data_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
