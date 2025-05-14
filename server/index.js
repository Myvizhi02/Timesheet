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
      let redirectTo = '';

      if (user.admin_flag === 2) {
        redirectTo = '/dashboard';
      } else if (user.admin_flag === 1 || user.admin_flag === 0) {
        redirectTo = '/spenttime';
      }
      
      return res.json({
        message: 'Login successful',
        name: user.name,
        crm_log_id: user.crm_log_id,
        redirectTo,
        admin_flag: user.admin_flag, // send this to frontend
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

// app.post('/api/projects', checkDbConnection, async (req, res) => {
//   try {
//     const {
//       project_name,
//       lob,
//       start_date,
//       end_date,
//       expected_date,
//       budget,
//       created_by,
//       modified_by,
//       department,
//       allocated_executives,
//     } = req.body;

//     const [lastProject] = await db.execute('SELECT project_unique_id FROM main_project ORDER BY id DESC LIMIT 1');

//     const newProjectId = lastProject.length > 0
//       ? `P${(parseInt(lastProject[0].project_unique_id.replace('P', '')) + 1).toString().padStart(4, '0')}`
//       : 'P0001';

//     await db.execute(`INSERT INTO main_project (
//       project_unique_id, project_name, lob, start_date, end_date,
//       expected_date, budget, created_by, modified_by,
//       created_date, modified_date, is_active, department, allocated_executives
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1, ?, ?)`, [
//       newProjectId,
//       project_name,
//       lob,
//       start_date,
//       end_date,
//       expected_date,
//       budget,
//       created_by,
//       modified_by,
//       department,
//       JSON.stringify(allocated_executives),
//     ]);

//     res.status(201).json({ message: 'Project created successfully.', project_unique_id: newProjectId });
//   } catch (error) {
//     console.error('❌ Error creating project:', error.message);
//     res.status(500).json({ error: 'Internal server error.' });
//   }
// });

app.post('/api/projects', async (req, res) => {
  const {
    project_unique_id,
    project_name,
    lob,
    start_date,
    end_date,
    expected_date,
    budget,
    created_by,
    modified_by,
    created_date,
    modified_date,
    is_active,
    department,
    allocated_executives,
  } = req.body;

  // Format the date to remove the time part
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toISOString().split('T')[0]; // Extract date part (YYYY-MM-DD)
  };

  // Format the dates
  const formattedStartDate = formatDate(start_date);
  const formattedEndDate = formatDate(end_date);
  const formattedExpectedDate = formatDate(expected_date);
  const formattedCreatedDate = formatDate(created_date);
  const formattedModifiedDate = formatDate(modified_date);

  const query = `
    INSERT INTO main_project (
      project_unique_id,
      project_name,
      lob,
      start_date,
      end_date,
      expected_date,
      budget,
      created_by,
      modified_by,
      created_date,
      modified_date,
      is_active,
      department,
      allocated_executives
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    project_unique_id,
    project_name,
    lob,
    formattedStartDate, // Use formatted date
    formattedEndDate,   // Use formatted date
    formattedExpectedDate, // Use formatted date
    budget,
    created_by,
    modified_by,
    formattedCreatedDate, // Use formatted date
    formattedModifiedDate, // Use formatted date
    is_active,
    department,
    JSON.stringify(allocated_executives),
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting project:', err);
      return res.status(500).json({ message: 'Failed to add project' });
    }
    res.status(201).json({ message: 'Project added successfully', projectId: results.insertId });
  });
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
// 
app.get('/api/tasks', checkDbConnection, async (req, res) => {
  const { project_id, task_name } = req.query;

  try {
    if (project_id && task_name) {
      // Return subtasks for a specific project and task
      const [taskRows] = await db.execute(
        'SELECT id FROM main_task WHERE project_id = ? AND task_name = ?',
        [project_id, task_name]
      );

      if (taskRows.length === 0) {
        return res.status(404).json({ error: 'Task not found.' });
      }

      const task_id = taskRows[0].id;

      const [subtasks] = await db.execute(
        'SELECT * FROM main_sub_task WHERE task_id = ? AND project_id = ?',
        [task_id, project_id]
      );

      return res.json(subtasks);
    } else if (project_id) {
      // Return all tasks for a specific project
      const [tasks] = await db.execute(
        'SELECT * FROM main_task WHERE project_id = ?',
        [project_id]
      );
      return res.json(tasks);
    } else {
      // Return all tasks with project and subtask info
      const [tasks] = await db.execute(`
       SELECT st.task_id, st.id AS sub_task_id, t.project_id, p.project_name, t.task_name, st.subtask_name, t.description AS task_description, st.description AS subtask_description, t.status AS task_status, st.status AS subtask_status, p.start_date AS project_start_date, p.end_date AS project_end_date, mst.start_time, mst.end_time, p.allocated_executives AS people_worked, mst.comments FROM main_project p JOIN main_task t ON t.project_id = p.id LEFT JOIN main_sub_task st ON st.task_id = t.id LEFT JOIN main_spent_time mst ON mst.sub_task_id = st.id WHERE p.is_active = 1 AND t.is_active = 1 ORDER BY p.created_date ASC;

      `);
      return res.json(tasks);
    }
  } catch (error) {
    console.error('❌ Error fetching tasks:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


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
    // Validate status
    if (![0, 1].includes(status)) {
      return res.status(400).json({ error: 'Invalid task status.' });
    }

    // Fetch project ID based on the project name
    const [projectRow] = await db.execute(
      'SELECT id FROM main_project WHERE project_name = ? AND is_active = 1',
      [project_name]
    );

    if (projectRow.length === 0) {
      return res.status(400).json({ error: 'Invalid project name selected.' });
    }

    const { id: project_id } = projectRow[0];

    // Check if the task already exists in the project
    const [existingTaskRow] = await db.execute(
      'SELECT * FROM main_task WHERE project_id = ? AND task_name = ? AND is_active = 1',
      [project_id, task_name]
    );

    if (existingTaskRow.length > 0) {
      return res.status(400).json({ error: 'Task with this name already exists in the selected project.' });
    }

    // Insert the new task into the database
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

    // Fetch the ID of the newly inserted task
    const [newTaskRow] = await db.execute('SELECT LAST_INSERT_ID() as task_id');
    const task_id = newTaskRow[0].task_id;

    res.status(201).json({
      message: 'Task added successfully.',
      task_id,
      project_name,
      task_name,
      description,
      status
    });

  } catch (error) {
    console.error('❌ Error adding task:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// to fetch all subtasks
app.get('/api/subtasks', checkDbConnection, async (req, res) => {
  const { task_id, project_id } = req.query;

  // Validate input
  if (!task_id || !project_id) {
    return res.status(400).json({ error: 'Both Task ID and Project ID are required' });
  }

  try {
    // Fetch subtasks based on both task_id and project_id
    const [results] = await db.execute(
      'SELECT * FROM main_sub_task WHERE task_id = ? AND project_id = ?',
      [task_id, project_id]
    );

    // Return results
    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ message: 'No subtasks found for the provided task_id and project_id' });
    }
  } catch (error) {
    console.error('❌ Error fetching subtasks:', error.message);
    res.status(500).json({ error: 'Database error' });
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
// GET subtasks by project_id and task_name
app.get('/api/tasks/by-name', checkDbConnection, async (req, res) => {
  const { project_id, task_name } = req.query;

  if (!project_id || !task_name) {
    return res.status(400).json({ error: 'Both project_id and task_name are required.' });
  }

  try {
    const [tasks] = await db.execute(`
      SELECT id 
      FROM main_task 
      WHERE project_id = ? AND task_name = ?
    `, [project_id, task_name]);

    if (tasks.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const task_id = tasks[0].id;

    const [subtasks] = await db.execute(`
      SELECT subtask_name 
      FROM main_sub_task 
      WHERE task_id = ? AND project_id = ?
    `, [task_id, project_id]);

    if (subtasks.length === 0) {
      return res.status(404).json({ error: 'No subtasks found.' });
    }

    return res.json(subtasks);
  } catch (error) {
    console.error('❌ Error fetching subtasks:', error.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});


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
    if (!project_name || !task_name || !sub_task_name || !description || status === undefined) {
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

    // Insert the subtask, adjusting the status for active/inactive
    await db.execute(`INSERT INTO main_sub_task (
      project_id, task_id, subtask_name, description, status,
      created_by, modified_by, created_date, modified_date, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`, [
      project_id,
      task_id,
      sub_task_name,
      description,
      status,  // status should be 1 (Open) or 0 (Closed)
      created_by,
      modified_by,
      status === 0 ? 0 : 1,  // if status is 0, set is_active to 0 (inactive), otherwise 1 (active)
    ]);

    res.status(201).json({ message: 'Subtask added successfully.' });
  } catch (error) {
    console.error('❌ Error adding subtask:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});



app.put('/api/update-task/:id', (req, res) => {
  const { id } = req.params;
  const { task_name, task_description, task_status } = req.body;

  const sql = `
    UPDATE main_task 
    SET task_name = ?, task_description = ?, task_status = ? 
    WHERE task_id = ?
  `;

  db.query(sql, [task_name, task_description, task_status, id], (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      return res.status(500).json({ error: 'Failed to update task' });
    }
    res.json({ message: 'Task updated successfully' });
  });
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
app.put('/api/subtasks/:id', async (req, res) => {
  const { id } = req.params;
  const { subtask_name, description, status } = req.body;

  if (!subtask_name) {
    return res.status(400).json({ error: 'Subtask name is required' });
  }

  const query = `
    UPDATE main_sub_task
    SET subtask_name = ?, description = ?, status = ?
    WHERE id = ?
  `;

  try {
    await db.execute(query, [
      subtask_name ?? null,
      description ?? null,
      status ?? 'Open',
      id,
    ]);
    res.status(200).json({ message: 'Subtask updated successfully' });
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ----------------------------------------------
// SPENT TIME - Save Time Endpoint
// ----------------------------------------------
app.post('/api/spenttime', checkDbConnection, async (req, res) => {
  console.log('Received data:', req.body);
  const {
    project_id,
    task_id,
    sub_task_id,
    user_id,
    start_date,
    end_date,
    start_time,
    end_time,
    hours,
    created_by,
    modified_by,
    created_date,
    is_active,
    comments
  } = req.body;

  try {
    // Check if the sub_task_id exists in the main_sub_task table
    const [subTaskExists] = await db.execute(`
      SELECT COUNT(*) AS count FROM main_sub_task WHERE id = ?
    `, [sub_task_id]);  // Corrected: Use sub_task_id instead of id

    if (subTaskExists[0].count === 0) {
      return res.status(400).json({ error: 'Sub-task ID does not exist.' });
    }

    // Insert the spent time record into the database
    await db.execute(`
      INSERT INTO main_spent_time (
        project_id, task_id, sub_task_id, user_id,
        start_date, end_date, start_time, end_time,
        hours, created_by, modified_by, created_date,
        is_active, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      project_id, task_id, sub_task_id, user_id,
      start_date, end_date, start_time, end_time,
      hours, created_by, modified_by, created_date,
      is_active, comments
    ]);

    res.status(201).json({ message: 'Spent time saved successfully.' });
  } catch (error) {
    console.error('❌ Error inserting spent time:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
app.get('/api/spent-time-details', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        t.task_name, 
        st.subtask_name, 
        p.project_name, 
        mst.start_date,
        mst.hours,
        ca.name 
      FROM crm_admin ca
      LEFT JOIN main_spent_time mst ON ca.crm_log_id = mst.user_id
      LEFT JOIN main_task t ON t.id = mst.task_id
      LEFT JOIN main_sub_task st ON st.id = mst.sub_task_id
      LEFT JOIN main_project p ON p.id = mst.project_id
      ORDER BY mst.start_date ASC;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching spent time details:", err);  // << See this in your terminal
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.get('/api/spent-time', async (req, res) => {
  try {
    // Get crm_log_id from request header (or from query params)
    const crmLogId = req.headers['authorization']?.split(' ')[1] || req.query.crm_log_id;
    const selectedDate = req.query.date; // Get the selected date from the query parameter
    
    if (!crmLogId) {
      return res.status(401).json({ error: 'Unauthorized: crm_log_id missing' });
    }

    if (!selectedDate) {
      return res.status(400).json({ error: 'Date parameter missing' });
    }

    // Adjust the SQL query to filter by the selected date
    const [rows] = await db.execute(`
      SELECT 
          mst.start_time,
          mst.end_time,
          mst.hours,
          mst.comments,
          t.task_name,
          st.subtask_name,
          p.project_name
      FROM 
          main_spent_time mst
      JOIN 
          main_task t ON mst.task_id = t.id
      JOIN 
          main_sub_task st ON mst.sub_task_id = st.id
      JOIN 
          main_project p ON mst.project_id = p.id
      WHERE 
          mst.user_id = ? AND DATE(mst.start_date) = ?
    `, [crmLogId, selectedDate]); // Use DATE() to match only the date part of `start_time`

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No data found for this employee on the selected date' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching spent time:', err);
    res.status(500).send('Server Error');
  }
});



//   const { spentTimeId } = req.params;  // Extract spentTimeId from URL parameter

//   const query = `
//     SELECT 
//       a.name,
//       a.crm_log_id AS empId,
//       s.start_time,
//       p.start_date,
//       s.end_time,
//       p.end_date,
//       t.status,
//       p.allocated_executives AS peopleWorked,
//       s.comments
//     FROM main_spent_time s
//     JOIN crm_admin a ON s.user_id = a.crm_log_id
//     JOIN main_project p ON s.project_id = p.id
//     JOIN main_task t ON s.task_id = t.id
//     WHERE s.id = ?
//   `;

//   try {
//     const [rows] = await db.execute(query, [spentTimeId]);

//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Data not found' });
//     }

//     res.json(rows[0]);  // Send the first row of the result (because we are querying for a specific `spentTimeId`)
//   } catch (error) {
//     console.error('Error fetching spent time details:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});