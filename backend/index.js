// Backend API - 22CT4_2251220188 - Nguyễn Lê Như Ngọc
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Tạo bảng nếu chưa có
db.connect(() => {
  db.query(`CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    done BOOLEAN DEFAULT FALSE
  )`);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/about', (req, res) => res.json({
  name: 'Nguyễn Lê Như Ngọc',
  studentId: '2251220188',
  class: '22CT4'
}));

// Lấy danh sách
app.get('/items', (req, res) => {
  db.query('SELECT * FROM items ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Thêm item
app.post('/items', (req, res) => {
  const { name } = req.body;
  db.query('INSERT INTO items (name) VALUES (?)', [name], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, name, done: false });
  });
});

// Cập nhật trạng thái done
app.put('/items/:id', (req, res) => {
  const { done } = req.body;
  db.query('UPDATE items SET done=? WHERE id=?', [done, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Xóa item
app.delete('/items/:id', (req, res) => {
  db.query('DELETE FROM items WHERE id=?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});