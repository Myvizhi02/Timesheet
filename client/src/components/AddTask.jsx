import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
  Switch,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AddSubTask from './AddSubTask';

const AddTask = ({ onClose, onSubmit, onAddTaskWithoutClose }) => {

  const [project, setProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
const [taskCounter, setTaskCounter] = useState(2); // starts at 2
const [createdTask, setCreatedTask] = useState(null);

  const [showSubTaskModal, setShowSubTaskModal] = useState({
    open: false,
    taskId: null,
    projectId: null,
    taskName,
  newList: [],
  });

  const [projectsList, setProjectsList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [selectedProject, setSelectedProject] = useState(null);
  const crmLogId = localStorage.getItem('crm_log_id');
  const [executiveProjects, setExecutiveProjects] = useState([]);
const [lastCreatedTaskName, setLastCreatedTaskName] = useState('');
const [taskList, setTaskList] = useState([]);
useEffect(() => {
  if (!project) {
    setTaskList([]);
    return;
  }
  
  fetch(`http://localhost:3030/api/tasks/by-project/${project}`)
    .then(res => res.json())
    .then(data => setTaskList(data))
    .catch(() => setTaskList([]));
}, [project]);


  useEffect(() => {
    if (!crmLogId) return;

    axios
      .get(`http://localhost:3030/api/projects/by-executive/${crmLogId}`)
      .then((response) => {
        setExecutiveProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching projects for executive:', error);
      });
  }, [crmLogId]);

  useEffect(() => {
    fetch('http://localhost:3030/api/projects')
      .then((res) => res.json())
      .then((data) => setProjectsList(data))
      .catch(() => showSnackbar('❌ Failed to load projects', 'error'));
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const taskPayload = () => {
    const selectedProject = projectsList.find(
      (proj) => proj.id === project
    );

    return {
      project_name: selectedProject?.project_name || '',
      task_name: taskName,
      description,
      status: status ? 1 : 2,
      created_by: crmLogId,
      modified_by: crmLogId,
    };
  };

  const handleSubmit = async () => {
    if (!project || !taskName || !description) {
      showSnackbar('⚠️ Please fill in all the required fields.', 'warning');
      return;
    }

    try {
      const res = await fetch('http://localhost:3030/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload()),
      });

      const result = await res.json();

      if (res.ok) {
        showSnackbar('✅ Task added successfully!', 'success');
        setShowSubTaskModal({
          open: true,
          taskId: result.task_id,
          projectId: project,
        });

        setTimeout(() => {
          if (onSubmit) onSubmit();
        }, 500);
      } else {
        showSnackbar(`❌ Failed to add task: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showSnackbar('❌ Failed to add task: Network error or server is down', 'error');
      console.error(error);
    }
  };

const handleAddTask = async () => {
  if (!project || !taskName || !description) {
    showSnackbar('⚠️ Please fill in all the required fields.', 'warning');
    return;
  }

  try {
    const res = await fetch('http://localhost:3030/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskPayload()),
    });

    const result = await res.json();

    if (res.ok) {
      showSnackbar('✅ Task added successfully!', 'success');

      const newTask = {
        task_id: result.task_id,
        task_name: taskName,
        description,
        status: status ? 1 : 2,
      };

      setCreatedTask(newTask); // ✅ Save task info
      setTaskList((prev) => [...prev, newTask]);

      // Reset fields
      setTaskName('');
      setDescription('');
      setTaskCounter((prev) => prev + 1);
      if (onAddTaskWithoutClose) onAddTaskWithoutClose();
    } else {
      showSnackbar(`❌ Failed to add task: ${result.error || 'Unknown error'}`, 'error');
    }
  } catch (error) {
    showSnackbar('❌ Failed to add task: Network error or server is down', 'error');
    console.error(error);
  }
};

  const handleAddSubTask = async () => {
     // If the task is already created, just open the subtask modal
  if (createdTask && createdTask.task_id) {
    setShowSubTaskModal({
      open: true,
      taskId: createdTask.task_id,
      projectId: project,
      taskName: createdTask.task_name,
    });
    return;
  }

  // If task fields are not filled
  if (!project || !taskName || !description) {
    showSnackbar('⚠️ Please fill in all main task fields before adding a subtask.', 'warning');
    return;
  }

    if (!project || !taskName || !description) {
      showSnackbar('⚠️ Please fill in all main task fields before adding a subtask.', 'warning');
      return;
    }

    try {
      const res = await fetch('http://localhost:3030/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload()),
      });

      const result = await res.json();

      if (res.ok) {
        showSnackbar('✅ Task added successfully!', 'success');
        setShowSubTaskModal({
          open: true,
          taskId: result.task_id,
          projectId: project,
           taskName: lastCreatedTaskName || taskName,
        });
        if (onSubmit) onSubmit();
      } else {
        showSnackbar(`❌ Failed to add task: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showSnackbar('❌ Could not store task before opening subtask popup.', 'error');
      console.error('Task creation error:', error);
    }
  };

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: '500px', md: '602px' },
            height: { xs: 'auto', sm: 'auto', md: '597px' },
            maxWidth: '95vw',
            maxHeight: '95vh',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#A3EAFD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1px 20px',
          }}
        >
          <Typography fontSize="18px" fontWeight="bold">
            Add Task
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: { xs: 2, sm: 3, md: 4 },
            overflow: 'auto',
          }}
        >
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} pt={3}>
            <TextField
              select
              label="Select Project"
              fullWidth
              value={project}
              onChange={(e) => {
                const selected = projectsList.find(
                  (proj) => proj.id === e.target.value
                );
                setProject(e.target.value);
                setSelectedProject(selected);
              }}
              sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
            >
              <MenuItem value="" disabled>
                Select a project
              </MenuItem>
              {executiveProjects.length === 0 ? (
                <MenuItem disabled>No projects assigned</MenuItem>
              ) : (
                executiveProjects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.project_name}
                  </MenuItem>
                ))
              )}
            </TextField>

            <TextField
              label={`Enter Task ${taskCounter - 1}`} 
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
            />
          </Box>

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box mt={1} >
            <TextField
              label="Status"
              variant="outlined"
              value={status ? 'Open' : 'Closed'}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      onClick={() => setStatus(!status)}
                      sx={{
                        width: '40px',
                        height: '20px',
                        backgroundColor: status ? '#3DC1F2' : '#ccc',
                        borderRadius: '20px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        ml: 1,
                      }}
                    >
                      <Box
                        sx={{
                          height: '16px',
                          width: '16px',
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: '2px',
                          left: status ? '20px' : '3px',
                          transition: 'left 0.3s',
                        }}
                      />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: '250px' }, '& .MuiOutlinedInput-root': { height: '40px' } }}
            />

            

            <Button
               variant="contained"
 onClick={handleAddTask} 
              sx={{
                backgroundColor: '#3758f9',
                padding: 4,
                paddingY: 1,
                ml:5,
                width: { xs: '100%', sm: 'auto' },
                textTransform: 'none',
                mb:10,
                '&:hover': { backgroundColor: '#2c47c5' },
              }}
            >
              Add Task
            </Button>

          </Box>
          
          

          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="center"
            alignItems="center"
            gap={3}
            mt="auto"
          >
            

           


            <Button
              variant="contained"
              onClick={handleAddSubTask}
              sx={{
                backgroundColor: '#3758f9',
                paddingX: 4,
                paddingY: 1,
                width: { xs: '100%', sm: 'auto' },
                textTransform: 'none',
                '&:hover': { backgroundColor: '#2c47c5' },
              }}
            >
              Add Sub Task
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#3758f9',
                paddingX: 4,
                paddingY: 1,
                width: { xs: '100%', sm: 'auto' },
                textTransform: 'none',
                '&:hover': { backgroundColor: '#2c47c5' },
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      

      {showSubTaskModal.open && (
        <AddSubTask
          onClose={() => setShowSubTaskModal({ open: false, taskId: null, projectId: null })}
          onSubmit={onSubmit}
            projectId={showSubTaskModal.projectId}
  project={selectedProject?.project_name || ''}
  taskId={showSubTaskModal.taskId}
  taskName={showSubTaskModal.taskName}
  taskList={taskList}
/>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      
    </>
  );
};

export default AddTask;
