// Backend API - 22CT4_2251220188 - Nguyễn Lê Như Ngọc
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// API 1: Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API 2: Thông tin cá nhân
app.get('/about', (req, res) => {
  res.json({
    name: 'Nguyễn Lê Như Ngọc',    
    studentId: '2251220188',  
    class: '22CT4'            
  });
});

// API 3: Lấy danh sách items (GET)
app.get('/items', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// API 4: Thêm item (POST)
app.post('/items', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO items (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});