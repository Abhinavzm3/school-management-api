// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import schoolRoutes from './routes/schoolRoutes.js';  // Ensure the file has the .js extension
import pool from './config/db.js'; // Your db pool config file, updated to ES module syntax

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Initialization
async function setupDatabase() {
  try {
    // Connect without specifying database so we can create it first.
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query('CREATE DATABASE IF NOT EXISTS bcdkugs1mdccygwpmwsb');
    await connection.query('USE bcdkugs1mdccygwpmwsb');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schools (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL
      )
    `);

    console.log('Database and table created successfully!');
    await connection.end();
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

// Call setupDatabase() and then start the server
app.get('/',(req,res)=>{
   res.send("School Management Backend Server is Running Here. Please use the API endpoints to access the data.")
})
setupDatabase().then(() => {
  // Routes
  app.use('/api', schoolRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
