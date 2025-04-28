const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3030;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Config
const dbConfig = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '', // your mysql root password
  database: 'timesheet',
};

// Initialize the database connection
let db;
(async () => {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL Database!');
  } catch (err) {
    console.error('❌ MySQL connection error:', err);
  }
})();


// ----------------------------------------------
// LOGIN API
// ----------------------------------------------
app.post('/login', async (req, res) => {
  const { agent_id, password } = req.body;

  if (!agent_id || !password) {
    return res.status(400).json({ error: 'Employee ID and Password are required.' });
  }

  try {
    if (!db) return res.status(500).json({ error: 'Database connection is not established.' });

    const [results] = await db.execute('SELECT * FROM crm_admin WHERE agent_id = ?', [agent_id]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Employee ID not found.' });
    }

    const user = results[0];

    if (!user.password) {
      return res.status(500).json({ error: 'Password not set for this user.' });
    }

    if (user.password === password) {
      console.log(`✅ Employee ${agent_id} logged in successfully.`);
      return res.json({
        message: 'Login successful',
        name: user.name,
        crm_log_id: user.crm_log_id,
        redirectTo: '/dashboard',
      });
    } else {
      return res.status(401).json({ error: 'Incorrect password.' });
    }
  } catch (err) {
    console.error('❌ Error during login:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});


// ----------------------------------------------
// GET agent name by agent ID
// ----------------------------------------------
app.get('/api/agents/:agentId', async (req, res) => {
  const { agentId } = req.params;

  try {
    const [results] = await db.execute('SELECT name FROM crm_admin WHERE agent_id = ?', [agentId]);

    if (results.length === 0) return res.status(404).json({ error: 'Agent not found.' });

    const agent = results[0];
    res.json({ name: agent.name });
  } catch (err) {
    console.error('❌ Error fetching agent:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});


// ----------------------------------------------
// GET crm_log_id by agent_id
// ----------------------------------------------
app.get('/getCrmLogId/:agent_id', async (req, res) => {
  const { agent_id } = req.params;

  try {
    const [rows] = await db.execute(
      'SELECT crm_log_id FROM crm_login WHERE agent_id = ?',
      [agent_id]
    );

    if (rows.length > 0) {
      res.json({ crm_log_id: rows[0].crm_log_id });
    } else {
      res.status(404).json({ error: 'Agent ID not found' });
    }
  } catch (error) {
    console.error('❌ Error fetching crm_log_id:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// ----------------------------------------------
// GET next available project ID
// ----------------------------------------------
const getNextProjectId = async () => {
  const [rows] = await db.execute(
    "SELECT project_unique_id FROM main_project ORDER BY id DESC LIMIT 1"
  );
  if (rows.length > 0) {
    const lastId = parseInt(rows[0].project_unique_id.replace("P", ""));
    return `P${String(lastId + 1).padStart(4, "0")}`;
  } else {
    return "P0001";
  }
};

app.get('/api/projects/new-id', async (req, res) => {
  try {
    const newProjectId = await getNextProjectId();
    res.json({ project_unique_id: newProjectId });
  } catch (err) {
    console.error('❌ Error generating new project ID:', err.message);
    res.status(500).json({ error: 'Failed to generate project ID' });
  }
});


// ----------------------------------------------
// POST: Add a new project
// ----------------------------------------------
app.post('/api/projects', async (req, res) => {
  try {
    const {
      project_name,
      lob,
      start_date,
      end_date,
      expected_date,
      budget,
      created_by,
      modified_by,
      department,
      allocated_executives,
    } = req.body;

    const project_unique_id = await getNextProjectId();

    const query = `
      INSERT INTO main_project (
        project_unique_id, project_name, lob, start_date, end_date,
        expected_date, budget, created_by, modified_by,
        created_date, modified_date, is_active, department, allocated_executives
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1, ?, ?)
    `;

    await db.execute(query, [
      project_unique_id,
      project_name,
      lob,
      start_date,
      end_date,
      expected_date,
      budget,
      created_by,
      modified_by,
      department,
      JSON.stringify(allocated_executives),
    ]);

    res.status(201).json({ message: 'Project created successfully', project_unique_id });
  } catch (error) {
    console.error('❌ Error creating project:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ----------------------------------------------
// GET: Admin names and crm_log_id
// ----------------------------------------------
app.get('/api/admins', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, crm_log_id FROM crm_admin');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching admin names:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ----------------------------------------------
// Start server
// ----------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
