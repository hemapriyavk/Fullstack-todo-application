import mysql from 'mysql2/promise.js'

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todo_app'
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