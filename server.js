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
app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>School Management API</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            background-color: #f4f4f4;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            text-align: center;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            margin: 10px 0;
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .note {
            font-style: italic;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>School Management API</h1>
          <p>
            The School Management Backend Server is running. Use the following API endpoints:
          </p>
          <ul>
            <li>
              <strong>Add School (POST):</strong>
              <br/>
              <a href="https://school-management-api-71ll.onrender.com/api/addSchool" target="_blank">
                https://school-management-api-71ll.onrender.com/api/addSchool
              </a>
               <br>
              input Example --
             <pre>{
  "name": "Southside Academy",
  "address": "202 South St",
  "latitude": 33.7490,
  "longitude": -84.3880
    } </pre>


            </li>
            <li>
              <strong>List Schools (GET):</strong>
              <br/>
              <a href="https://school-management-api-71ll.onrender.com/api/listSchools?latitude=23&longitude=-45" target="_blank">
                https://school-management-api-71ll.onrender.com/api/listSchools?latitude=23&longitude=-45
              </a>

              <br> here you can change the lan and log to get lists of schools
            </li>
          </ul>
          <p class="note">
            Tip: Use a REST client like Postman or cURL to test these endpoints with the required parameters and payloads.
          </p>
        </div>
      </body>
      </html>
    `);
  });
  
setupDatabase().then(() => {
  // Routes
  app.use('/api', schoolRoutes);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
