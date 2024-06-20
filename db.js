const mysql = require('mysql2/promise');

// Buat koneksi ke Cloud SQL
const pool = mysql.createPool({
    host: '34.128.106.109',
    user: 'root',
    password: 'userss',
    database: 'test_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fungsi untuk mendapatkan jumlah scan
const getScanQty = async (user_id) => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM total_scan WHERE user_id = ?', [user_id]);
    return rows[0].count;
};

// Fungsi untuk memperbarui data scan
const updateScanQty = async (user_id, waste) => {
    const [result] = await pool.query('INSERT INTO total_scan (user_id, waste) VALUES (?, ?)', [user_id, waste]);
    return { success: result.affectedRows > 0 };
};

module.exports = { getScanQty, updateScanQty };