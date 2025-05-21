import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import addIcon from '../assets/add.png';
import ActionView from './ActionView';
import AddTask from './AddTask';

const Task = () => {
   const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openActionView, setOpenActionView] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);  // <-- refresh trigger

  const fetchTasks = async () => {
    

    try {
      const response = await axios.get('http://localhost:3030/api/tasks');
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        console.error('Expected an array of tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };
  


  // Fetch tasks initially and on every refreshFlag change
  useEffect(() => {
    fetchTasks();
  }, [refreshFlag]);

  // Called after task is successfully created in AddTask
  const handleCreateTask = () => {
    setShowPopup(false);          // Close the AddTask popup
    setRefreshFlag(prev => !prev); // Toggle refresh flag to reload tasks
  };

  const handleOpenActionView = (task) => {
    setSelectedTask(task);
    setOpenActionView(true);
  };

  const handleCloseActionView = () => {
    setSelectedTask(null);
    setOpenActionView(false);
  };

const handleUpdateDone = () => {
  setOpenActionView(false);  // Close popup
  setRefreshFlag(prev => !prev); // Refresh tasks
};

  return (
    <>
      <Box sx={{ padding: { xs: 2, sm: 4 }, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button
            variant="contained"
            startIcon={<img src={addIcon} alt="Add Icon" style={{ width: 20, height: 20 }} />}
            sx={{
              backgroundColor: '#3D6BFA',
              borderRadius: '12px',
              fontWeight: 600,
              width: { xs: '140px', sm: '160px' },
              height: '44px',
              fontSize: '14px',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#3159d6' }
            }}
            onClick={() => setShowPopup(true)}
          >
            Add Task
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={3}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#84E7F9' }}>
              <TableRow>
                <TableCell align="center"><strong>SL No</strong></TableCell>
                <TableCell align="center"><strong>Project</strong></TableCell>
                <TableCell align="center"><strong>Task Name</strong></TableCell>
                <TableCell align="center"><strong>Sub Task</strong></TableCell>
                <TableCell align="center"><strong>Description</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((task, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{task.project_name}</TableCell>
                  <TableCell align="center">{task.task_name}</TableCell>
                  <TableCell align="center">{task.subtask_name}</TableCell>
                  <TableCell align="center">{task.task_description}</TableCell>
                  <TableCell align="center">
                    {/* <Typography sx={{ color: task.subtask_status === 'Open' ? 'green' : 'red', fontWeight: 500 }}>
                      {task.subtask_status}
                    </Typography> */}
                   <Typography
  sx={{
    color: task.subtask_status == 1 ? 'green' : 'red',
    fontWeight: 500,
  }}
>
  {task.subtask_status == 1 ? 'Open' : 'Closed'}
</Typography>


                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleOpenActionView(task)}>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>


      {openActionView && (
  <ActionView task={selectedTask} onClose={handleCloseActionView} onUpdateDone={handleUpdateDone} />
)}


      {showPopup && (
        <AddTask onClose={() => setShowPopup(false)} onSubmit={handleCreateTask} />
      )}
    </>
  );
};

export default Task;
