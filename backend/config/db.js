import mysql from 'mysql2';
import 'dotenv/config';

const db = mysql.createConnection({

  /* XAMPP */
    // host: "localhost",
    // user: "root", // Default MySQL username in XAMPP
    // password: "", // Default is empty in XAMPP
    // database: "employees",

    host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
  });
  
 db.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err);
    } else {
      console.log("Connected to MySQL Database ✅");
    }
  });

  export default db;

/*
//db structure

CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text VARCHAR(255),
  completed BOOLEAN DEFAULT false,
  completedAt DATETIME,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
*/