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
  origin: 'http://localhost:5173',
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
  user: 'root',
  password: '',
  database: 'timesheet',
  port: 3306,
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
// GET APIs
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
    res.status(500).json({ error: 'Server error.' });
  }
});

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
    res.status(500).json({ error: 'Server error.' });
  }
});

// ----------------------------------------------
// PROJECTS
// ----------------------------------------------
app.get('/api/projects', checkDbConnection, async (req, res) => {
  try {
    const [projects] = await db.execute('SELECT * FROM main_project WHERE is_active = 1 ORDER BY created_date ASC');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});
app.get('/api/projects/new-id', checkDbConnection, async (req, res) => {
  try {
    const nextProjectId = await getNextProjectId();
    res.json({ project_unique_id: nextProjectId });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});
const getNextProjectId = async () => {
  const [rows] = await db.execute("SELECT project_unique_id FROM main_project ORDER BY id DESC LIMIT 1");
  if (rows.length > 0) {
    const lastId = parseInt(rows[0].project_unique_id.replace("P", ""));
    return `P${String(lastId + 1).padStart(4, "0")}`;
  } else {
    return "P0001";
  }
};
app.put('/api/projects/:id', checkDbConnection, async (req, res) => {
  const projectId = req.params.id;
  const updatedData = req.body;

  try {
    const [result] = await db.execute(
      'UPDATE main_project SET project_name = ?, department = ?, lob = ?, start_date = ?, end_date = ?, expected_date = ?, budget = ?, allocated_executives = ? WHERE project_unique_id = ?',
      [
        updatedData.project_name,
        updatedData.department,
        updatedData.lob,
        updatedData.start_date,
        updatedData.end_date,
        updatedData.expected_date,
        updatedData.budget,
        JSON.stringify(updatedData.allocated_executives),
        projectId,
      ]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Project updated successfully' });
    } else {
      res.status(400).json({ message: 'Failed to update project' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

    const [lastProject] = await db.execute('SELECT project_unique_id FROM main_project ORDER BY id DESC LIMIT 1');

    const newProjectId = lastProject.length > 0
      ? `P${(parseInt(lastProject[0].project_unique_id.replace('P', '')) + 1).toString().padStart(4, '0')}`
      : 'P0001';

    await db.execute(`INSERT INTO main_project (
      project_unique_id, project_name, lob, start_date, end_date,
      expected_date, budget, created_by, modified_by,
      created_date, modified_date, is_active, department, allocated_executives
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1, ?, ?)`, [
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
app.get('/api/admins', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT crm_log_id, name FROM crm_admin');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ----------------------------------------------
// TASKS
// ----------------------------------------------
app.post('/api/tasks', checkDbConnection, async (req, res) => {
  const {
    project_name,
    task_name,
    description,
    status,
    created_by,
    modified_by
  } = req.body;

  try {
    const [projectRow] = await db.execute(
      'SELECT id FROM main_project WHERE project_name = ? AND is_active = 1',
      [project_name]
    );

    if (projectRow.length === 0) {
      return res.status(400).json({ error: 'Invalid project name selected.' });
    }

    const { id: project_id } = projectRow[0];

    await db.execute(`INSERT INTO main_task (
      project_id, task_name, description, status,
      created_by, modified_by, created_date, modified_date, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`, [
      project_id,
      task_name,
      description,
      status,
      created_by,
      modified_by
    ]);

    res.status(201).json({ message: 'Task added successfully.' });
  } catch (error) {
    console.error('❌ Error adding task:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.put('/api/update-task/:taskId', checkDbConnection, async (req, res) => {
  const { taskId } = req.params; // fetch taskId from the URL parameter

  const { task_name, task_description, task_status } = req.body; // other task details
 
  try {
    const [result] = await db.execute(`
      UPDATE main_task 
      SET task_name = ?, description = ?, status = ? 
      WHERE id = ? AND is_active = 1
    `, [task_name, task_description, task_status, taskId]);
  

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found or already inactive.' });
    }

    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('❌ Error updating task:', error.message);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

// ----------------------------------------------
// SUBTASKS
// ----------------------------------------------
app.post('/api/subtasks', checkDbConnection, async (req, res) => {
  const {
    project_name,
    task_name,
    sub_task_name,
    description,
    status,
    created_by,
    modified_by
  } = req.body;

  try {
    if (!project_name || !task_name || !sub_task_name || !description || !status) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const [projectRows] = await db.execute(
      'SELECT id FROM main_project WHERE project_name = ? AND is_active = 1',
      [project_name]
    );

    if (projectRows.length === 0) {
      return res.status(400).json({ error: 'Invalid project name.' });
    }

    const project_id = projectRows[0].id;

    const [taskRows] = await db.execute(
      'SELECT id FROM main_task WHERE task_name = ? AND project_id = ? AND is_active = 1',
      [task_name, project_id]
    );

    if (taskRows.length === 0) {
      return res.status(400).json({ error: 'Invalid task name for the given project.' });
    }

    const task_id = taskRows[0].id;

    await db.execute(`INSERT INTO main_sub_task (
      project_id, task_id, subtask_name, description, status,
      created_by, modified_by, created_date, modified_date, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)`, [
      project_id,
      task_id,
      sub_task_name,
      description,
      status,
      created_by,
      modified_by
    ]);

    res.status(201).json({ message: 'Subtask added successfully.' });
  } catch (error) {
    console.error('❌ Error adding subtask:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



app.get('/api/tasks', checkDbConnection, async (req, res) => {
  try {
    const [tasks] = await db.execute(`
      SELECT 
        st.task_id,
        st.id as sub_task_id,
        t.project_id,
        p.project_name, 
        t.task_name, 
        st.subtask_name, 
        t.description AS task_description,


        st.description AS subtask_description,
        t.status AS task_status,

        st.status AS subtask_status
      FROM main_project p
      JOIN main_task t ON t.project_id = p.id
      LEFT JOIN main_sub_task st ON st.task_id = t.id
      WHERE p.is_active = 1 AND t.is_active = 1
      ORDER BY p.created_date ASC
    `);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});
app.put('/api/subtasks/:task_id', async (req, res) => {
  const { task_id } = req.params;
  const { subtask_name, description, status } = req.body;

  if (!subtask_name) {
    return res.status(400).json({ error: 'Subtask name is required' });
  }

  const query = `
    UPDATE main_sub_task
    SET subtask_name = ?, description = ?, status = ?
    WHERE task_id = ?
  `;

  try {
    await db.execute(query, [
      subtask_name ?? null,
      description ?? null,
      status ?? 'Open',
      task_id,
    ]);
    res.status(200).json({ message: 'Subtask updated successfully' });
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/main-task/:id/:project_id', checkDbConnection, async (req, res) => {
  const { id, project_id } = req.params;

  try {
    const [task] = await db.execute(`
      SELECT t.id, t.task_name, t.description AS task_description, t.status, p.project_name
      FROM main_task t
      JOIN main_project p ON p.id = t.project_id
      WHERE t.id = ? AND t.project_id = ? AND t.is_active = 1
    `, [id, project_id]);

    if (task.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const [subtasks] = await db.execute(`
      SELECT subtask_name, description AS subtask_description, status
      FROM main_sub_task
      WHERE task_id = ? AND is_active = 1
    `, [id]);

    res.json({ task: task[0], subtasks });
  } catch (error) {
    res.status(500).json({ error: 'Server error.' });
  }
});

app.get('/api/admins', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT crm_log_id, name FROM crm_admin');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start server

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
