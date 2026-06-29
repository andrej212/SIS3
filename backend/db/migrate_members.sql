-- Run in your MySQL console (database: sys3)

CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  surname VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  UNIQUE KEY unique_member (name, surname)
);

-- If the table already exists, run this to add the constraint:
-- ALTER TABLE members ADD UNIQUE KEY unique_member (name, surname);
