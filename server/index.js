const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2 with promises
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
  password: '', // replace with your actual MySQL root password
  database: 'timesheet',
};

// Initialize the database connection
let db;
(async () => {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL Database!');
  } catch (err) {
    console.error('MySQL connection error:', err);
  }
})();

// LOGIN API
app.post('/login', async (req, res) => {
  const { agent_id, password } = req.body;

  try {
    // Ensure the database is connected
    if (!db) {
      return res.status(500).send('Database connection is not established.');
    }

    const [results] = await db.execute('SELECT * FROM crm_admin WHERE agent_id = ?', [agent_id]);

    if (results.length === 0) {
      return res.status(401).send('Employee ID not found.');
    }

    const user = results[0];

    // Check if the password matches
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
  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).send('Server error.');
  }
});

// FETCH agent's name by agent_id
app.get('/api/agents/:agentId', async (req, res) => {
  const { agentId } = req.params;

  try {
    const [results] = await db.execute('SELECT name FROM crm_admin WHERE agent_id = ?', [agentId]);

    if (results.length === 0) {
      return res.status(404).send('Agent not found.');
    }

    const agent = results[0];
    res.json({ name: agent.name });
  } catch (err) {
    console.error('Error fetching agent:', err);
    return res.status(500).send('Server error.');
  }
});

// 🆕 Get latest project_unique_id
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

// Backend route to get the next available project ID
app.get('/api/projects/new-id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT project_unique_id FROM main_project ORDER BY id DESC LIMIT 1"
    );

    let newProjectId;

    if (rows.length > 0 && rows[0].project_unique_id) {
      const lastId = parseInt(rows[0].project_unique_id.replace("P", ""));
      newProjectId = `P${String(lastId + 1).padStart(4, "0")}`;
    } else {
      newProjectId = "P0001";
    }

    res.json({ project_unique_id: newProjectId });
  } catch (err) {
    console.error('Error generating new project ID:', err);
    res.status(500).json({ error: 'Failed to generate project ID' });
  }
});


// 📥 POST: Add a new project
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
      allocated_executives, // should be array like ["crm001", "crm002"]
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
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 📥 GET: Fetch admin names and IDs from crm_admin
app.get('/api/admins', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM crm_admin');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching admin names:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// 🟢 Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
