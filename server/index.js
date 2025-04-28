const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3030;

// ----------------------------------------------
// CORS Middleware
// ----------------------------------------------
const corsOptions = {
  origin: 'http://localhost:5173',  // Allow requests from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------------
// MySQL Database Configuration
// ----------------------------------------------
const dbConfig = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '', // your MySQL password here
  database: 'timesheet',
};

let db;

// Connect to MySQL
(async () => {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL Database!');
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    process.exit(1);
  }
})();

// Middleware to ensure DB connection
const checkDbConnection = (req, res, next) => {
  if (!db) return res.status(500).json({ error: 'Database connection not established.' });
  next();
};

// ----------------------------------------------
// LOGIN API
// ----------------------------------------------
app.post('/login', checkDbConnection, async (req, res) => {
  const { agent_id, password } = req.body;

  if (!agent_id || !password) {
    return res.status(400).json({ error: 'Employee ID and Password are required.' });
  }

  try {
    const [results] = await db.execute('SELECT * FROM crm_admin WHERE agent_id = ?', [agent_id]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Employee ID not found.' });
    }

    const user = results[0];

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
  } catch (error) {
    console.error('❌ Error during login:', error.message);
    return res.status(500).json({ error: 'Server error.' });
  }
});

// ----------------------------------------------
// GET: Agent Name by Agent ID
// ----------------------------------------------
app.get('/api/agents/:agentId', checkDbConnection, async (req, res) => {
  const { agentId } = req.params;

  try {
    const [results] = await db.execute('SELECT name FROM crm_admin WHERE agent_id = ?', [agentId]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Agent not found.' });
    }

    res.json({ name: results[0].name });
  } catch (error) {
    console.error('❌ Error fetching agent name:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ----------------------------------------------
// GET: crm_log_id by Agent ID
// ----------------------------------------------
app.get('/getCrmLogId/:agent_id', checkDbConnection, async (req, res) => {
  const { agent_id } = req.params;

  try {
    const [rows] = await db.execute('SELECT crm_log_id FROM crm_login WHERE agent_id = ?', [agent_id]);

    if (rows.length > 0) {
      res.json({ crm_log_id: rows[0].crm_log_id });
    } else {
      res.status(404).json({ error: 'Agent ID not found.' });
    }
  } catch (error) {
    console.error('❌ Error fetching crm_log_id:', error.message);
    res.status(500).json({ error: 'Server error.' });
  }
});
// ----------------------------------------------
// GET: Validation
// ----------------------------------------------

app.get('/validate-session', (req, res) => {
  // Check session validity logic here
  // For example, check if user is authenticated or not
  if (req.session && req.session.user) {
      res.status(200).json({ message: 'Session valid' });
  } else {
      res.status(401).json({ message: 'Session invalid' });
  }
});

// ----------------------------------------------
// GET: Generate Next Available Project ID
// ----------------------------------------------
app.get('/api/projects/new-id', checkDbConnection, async (req, res) => {
  try {
    const nextProjectId = await getNextProjectId();
    res.json({ project_unique_id: nextProjectId });
  } catch (error) {
    console.error('❌ Error generating next project ID:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ----------------------------------------------
// Function to get Next Available Project ID
// ----------------------------------------------
const getNextProjectId = async () => {
  const [rows] = await db.execute(
    "SELECT project_unique_id FROM main_project ORDER BY id DESC LIMIT 1"
  );

  if (rows.length > 0) {
    const lastId = parseInt(rows[0].project_unique_id.replace("P", ""));
    return `P${String(lastId + 1).padStart(4, "0")}`;
  } else {
    return "P0001"; // If no projects exist yet, start from P0001
  }
};

// ----------------------------------------------
// POST: Add a New Project
// ----------------------------------------------
app.post('/api/projects', checkDbConnection, async (req, res) => {
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

    // Fetch the last project for unique ID generation
    const [lastProject] = await db.execute('SELECT project_unique_id FROM main_project ORDER BY id DESC LIMIT 1');

    const newProjectId = lastProject.length > 0
      ? `P${(parseInt(lastProject[0].project_unique_id.replace('P', '')) + 1).toString().padStart(4, '0')}`
      : 'P0001';

    const query = `
      INSERT INTO main_project (
        project_unique_id, project_name, lob, start_date, end_date,
        expected_date, budget, created_by, modified_by,
        created_date, modified_date, is_active, department, allocated_executives
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1, ?, ?)
    `;

    await db.execute(query, [
      newProjectId,
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

    res.status(201).json({ message: 'Project created successfully.', project_unique_id: newProjectId });
  } catch (error) {
    console.error('❌ Error creating project:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ----------------------------------------------
// GET: List All Admin Names
// ----------------------------------------------
app.get('/api/admins', checkDbConnection, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, crm_log_id FROM crm_admin');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching admins:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ----------------------------------------------
// GET: Fetch All Active Projects
// ----------------------------------------------
app.get('/api/projects', checkDbConnection, async (req, res) => {
  try {
    const [projects] = await db.execute('SELECT * FROM main_project WHERE is_active = 1 ORDER BY created_date ASC');
    res.json(projects);
  } catch (error) {
    console.error('❌ Error fetching projects:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ----------------------------------------------
// Global Error Handler
// ----------------------------------------------
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err.message);
  res.status(500).json({ error: 'Internal server error.' });
});

// ----------------------------------------------
// Start the Server
// ----------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
