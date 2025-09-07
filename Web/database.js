const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'murikkoli@123', // Replace with your MySQL password
    database: 'hotel' // Replace with your database name
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Function to get a connection from the pool
async function getConnection() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Error getting database connection:', error);
        throw error;
    }
}

// Test the connection
async function testConnection() {
    try {
        const connection = await getConnection();
        console.log('Connected to MySQL database');
        connection.release();
    } catch (error) {
        console.error('Failed to connect to database:', error);
    }
}

// Initialize the database connection
testConnection();

module.exports = {
    getConnection,
    pool
};