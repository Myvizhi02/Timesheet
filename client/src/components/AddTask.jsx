import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AddSubTask from './AddSubTask';

const AddTask = ({ onClose, onSubmit }) => {
  const [project, setProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true); // True for Open, False for Closed
  const [showSubTaskModal, setShowSubTaskModal] = useState(false);
  const [projectsList, setProjectsList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3030/api/projects')
      .then(res => res.json())
      .then(data => setProjectsList(data))
      
  }, []);

  const taskPayload = () => ({
    project_name: project,
    task_name: taskName,
    description,
    status: status ? 1 : 0,  // Store 1 for Open (status is true) and 0 for Closed (status is false)
    created_by: localStorage.getItem('crm_log_id'),
    modified_by: localStorage.getItem('crm_log_id'),
  });
  
  const handleSubmit = async () => {
    if (!project || !taskName || !description) {
      alert('⚠️ Please fill in all the required fields.');
      return;
    }
  
    try {
      const res = await fetch('http://localhost:3030/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload())
      });
  console.log("tryyy")
      const result = await res.json();
  
      if (res.ok) {
        alert('✅ Task added successfully!');
        onSubmit(taskPayload());
        onClose();
      } else {
        alert(`❌ Failed to add task: ${result.error || 'Unknown error'}`);
      }
    } catch {
      alert('❌ Something went wrong while submitting the task.');
    }
  };
  

  const handleAddSubTask = async () => {
    if (!project || !taskName || !description) {
      alert('⚠️ Please fill in all main task fields before adding a subtask.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3030/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload())
      });

      const result = await res.json();

      if (res.ok) {
        setShowSubTaskModal(true);
      } else {
        alert(`❌ Failed to add task: ${result.error || 'Unknown error'}`);
      }
    } catch {
      alert('❌ Could not store task before opening subtask popup.');
    }
  };

  useEffect(() => {
    fetch('http://localhost:3030/api/tasks')
      .then(res => res.json())
      .then(data => {
        // Filter out tasks with status 0 (Closed tasks)
        const activeTasks = data.filter(task => task.status !== 0);
        setTasks(activeTasks);
      })
      .catch(() => alert('❌ Failed to fetch tasks.'));
  }, []);
  
  return (
    <>
      <Dialog open onClose={onClose} PaperProps={{
        sx: {
          width: { xs: '90%', sm: '500px', md: '602px' },
          height: { xs: 'auto', sm: 'auto', md: '597px' },
          maxWidth: '95vw',
          maxHeight: '95vh',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }
      }}>
        <DialogTitle sx={{
          backgroundColor: '#A3EAFD',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1px 20px',
        }}>
          <Typography fontSize="18px" fontWeight="bold">Add Task</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: { xs: 2, sm: 3, md: 4 },
          overflow: 'auto',
        }}>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} pt={3}>
            <TextField
              select
              label="Select Project"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
            >
              <option value="" disabled></option>
              {projectsList.map((proj) => (
                <option key={proj.project_unique_id} value={proj.project_name}>
                  {proj.project_name}
                </option>
              ))}
            </TextField>

            <TextField
              label="Enter Task Name"
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

          <Box mt={1}>
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
                )
              }}
              sx={{ width: { xs: '100%', sm: '250px' }, '& .MuiOutlinedInput-root': { height: '40px' } }}
            />
          </Box>

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" gap={3} mt="auto">
            <Button
              variant="contained"
              onClick={handleAddSubTask}
              sx={{
                backgroundColor: "#3758f9",
                paddingX: 4,
                paddingY: 1,
                width: { xs: '100%', sm: 'auto' },
                textTransform: 'none',
                '&:hover': { backgroundColor: "#2c47c5" }
              }}
            >
              Add Sub Task
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#3758f9",
                paddingX: 4,
                paddingY: 1,
                width: { xs: '100%', sm: 'auto' },
                textTransform: 'none',
                '&:hover': { backgroundColor: "#2c47c5" }
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {showSubTaskModal && (
        <AddSubTask
          onClose={() => setShowSubTaskModal(false)}
          onSubmit={() => setShowSubTaskModal(false)}
          project={project}
          taskName={taskName}
        />
      )}
    </>
  );
};

export default AddTask;
