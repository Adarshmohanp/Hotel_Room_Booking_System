const express = require('express');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'murikkoli@123', // Replace with your MySQL password
    database: 'hotel' // Replace with your database name
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Test database connection
app.get('/api/test-db', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT 1 as test');
        connection.release();
        res.json({ success: true, message: 'Database connected successfully' });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ success: false, message: 'Database connection failed' });
    }
});

// Login endpoint (using plain text comparison)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    console.log('Login attempt:', username, password);
    
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }
    
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM login WHERE username = ? AND password = ?', 
            [username, password]
        );
        connection.release();
        
        console.log('Query results:', rows);
        
        if (rows.length === 0) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: rows[0].id, username: rows[0].username }, 
            JWT_SECRET, 
            { expiresIn: '1h' }
        );
        
        res.json({ success: true, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Get booking by ID
app.get('/api/booking/:id', authenticateToken, async (req, res) => {
    const bookingId = req.params.id;
    
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM hotel WHERE BID = ?', 
            [bookingId]
        );
        connection.release();
        
        if (rows.length === 0) {
            res.json({ success: true, booking: null });
        } else {
            res.json({ success: true, booking: rows[0] });
        }
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});
// Get all bookings
app.get('/api/all-bookings', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM hotel ORDER BY BID DESC'
        );
        connection.release();
        
        res.json({ success: true, bookings: rows });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
});