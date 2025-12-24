// Student Name: Özge Boztaş
// Student Number: XXXXXXX

import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'ecommerce_db',
});

