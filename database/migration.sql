-- ============================================================
-- MIGRATION - SIS3
-- Run this file to create all tables from scratch
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email    VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role     ENUM('admin', 'employee', 'user') NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS programs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    difficulty  VARCHAR(50) NOT NULL,
    created_by  VARCHAR(100),
    created_at  DATETIME
);

CREATE TABLE IF NOT EXISTS program_ratings (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    user_id    INT NOT NULL,
    rating     INT NOT NULL,
    UNIQUE KEY unique_rating (program_id, user_id)
);

CREATE TABLE IF NOT EXISTS members (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    surname    VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date   DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT NOT NULL,
    pdf_url    VARCHAR(500),
    created_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS blog_comments (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    blog_id    INT NOT NULL,
    user_id    INT NOT NULL,
    username   VARCHAR(100) NOT NULL,
    comment    TEXT NOT NULL,
    reply      TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_threads (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT NOT NULL,
    user_id    INT NOT NULL,
    username   VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS forum_posts (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    thread_id  INT NOT NULL,
    user_id    INT NOT NULL,
    username   VARCHAR(100) NOT NULL,
    content    TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    full_name  VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL
);
