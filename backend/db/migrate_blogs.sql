-- Run these in your MySQL console (database: sys3)

-- Fix: drop the foreign key on created_by if it exists (it should store a username, not a user id)
ALTER TABLE blog_posts DROP FOREIGN KEY IF EXISTS blog_posts_ibfk_1;

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  pdf_url VARCHAR(500) DEFAULT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- If the table already exists, run these to add missing columns:
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(500) DEFAULT NULL;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS created_by VARCHAR(255) NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS blog_comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  blog_id INT NOT NULL,
  user_id INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  reply TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (blog_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);
