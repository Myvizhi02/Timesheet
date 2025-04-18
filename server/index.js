const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); // Allow frontend to connect

const app = express();
const port = 3030; // Server runs on 3030

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306, // Default MySQL port
  user: 'root', // Your DB username
  password: '', // Your DB password
  database: 'timesheet', // Your DB name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('✅ Connected to MySQL Database!');
});

// LOGIN API
app.post('/login', (req, res) => {
  const { agent_id, password } = req.body;

  // Query to find user by agent_id
  const sql = 'SELECT * FROM crm_admin WHERE agent_id = ?';
  db.query(sql, [agent_id], (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      return res.status(500).send('Server error.');
    }

    if (results.length === 0) {
      return res.status(401).send('Employee ID not found.');
    }

    const user = results[0];

    // Compare the provided password with the stored password directly (no hashing)
    if (user.password === password) {
      console.log(`✅ Employee ${agent_id} logged in successfully.`);
      return res.json({ message: 'Login successful', redirectTo: '/dashboard' });
    } else {
      return res.status(401).send('Incorrect password.');
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
