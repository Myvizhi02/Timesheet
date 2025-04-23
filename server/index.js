const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3030;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'timesheet',
});

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

    if (user.password === password) {
      console.log(`✅ Employee ${agent_id} logged in successfully.`);
      return res.json({
        message: 'Login successful',
        name: user.name,
        redirectTo: '/dashboard',
      });
    } else {
      return res.status(401).send('Incorrect password.');
    }
  });
});

// FETCH agent's name by agent_id
app.get('/api/agents/:agentId', (req, res) => {
  const { agentId } = req.params;

  const sql = 'SELECT name FROM crm_admin WHERE agent_id = ?';
  db.query(sql, [agentId], (err, results) => {
    if (err) {
      console.error('Error fetching agent:', err);
      return res.status(500).send('Server error.');
    }

    if (results.length === 0) {
      return res.status(404).send('Agent not found.');
    }

    const agent = results[0];
    res.json({ name: agent.name });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
