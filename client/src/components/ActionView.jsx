import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ActionView = ({ task = {}, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    project: task.project_name || '',
    taskname: task.task_name || '',
    subtaskname: task.subtask_name || '',
    description: task.description || '',
    subtaskdescription: task.subtaskdescription || '',
    taskstatus: task.task_status === 'Open',
    subtaskstatus: task.subtask_status === 'Open',
  });

  useEffect(() => {
    const fetchMainTaskDescription = async () => {
      if (task.task_name) {
        console.log('Fetching task description for:', task.task_name);
        try {
          const res = await axios.get(`http://localhost:3030/api/main-task/${task.task_name}`);
          const task_description = res.data.task_description || res.data.description;
          const task_status = res.data.task_status;
  
          setFormData((prev) => ({
            ...prev,
            description: task_description || prev.description || '',
            taskstatus: task_status === 'Open',
          }));
        } catch (error) {
          console.error('Failed to fetch task description:', error);
        }
      }
    };
  
    const fetchSubtaskDescription = async () => {
      console.log('Fetching subtask description for:', task.subtask_name);
      if (task.subtask_name) {
        try {
          const res = await axios.get('http://localhost:3030/api/main-subtask', {
            params: {
              subtask_name: task.subtask_name,
            }
          });
    
          console.log('Subtask API response:', res.data);
    
          const subtask_description = res.data.description || '';
    
          setFormData((prev) => {
            console.log('Setting formData with subtask description:', subtask_description);
            return {
              ...prev,
              subtaskdescription: subtask_description || prev.subtaskdescription || '',
            };
          });
        } catch (error) {
          console.error('Failed to fetch subtask description:', error);
        }
      }
    };

    if (task?.task_name) {
      fetchMainTaskDescription();
    }
    if (task?.subtask_name) {
      fetchSubtaskDescription();
    }
  }, [task.task_name, task.subtask_name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskStatusToggle = () => {
    setFormData((prev) => ({ ...prev, taskstatus: !prev.taskstatus }));
  };

  const handleSubtaskStatusToggle = () => {
    setFormData((prev) => ({ ...prev, subtaskstatus: !prev.subtaskstatus }));
  };

  const handleUpdate = async () => {
    if (!task?.id) {
      console.error('❌ id is undefined. Cannot proceed with update.');
      return;
    }

    const updatedTask = {
      project_name: formData.project,
      task_name: formData.taskname,
      description: formData.description,
      task_status: formData.taskstatus ? 'Open' : 'Closed',
    };

    try {
      await axios.put(`http://localhost:3030/api/update-task/${task.id}`, updatedTask);
      console.log('✅ Task updated successfully');
      onClose?.();
    } catch (error) {
      console.error('❌ Error updating task:', error);
    }
  };

  const handleSubtaskSubmit = async () => {
    const newSubtask = {
      project_name: formData.project,
      subtask_name: formData.subtaskname,
      description: formData.subtaskdescription,
      subtask_status: formData.subtaskstatus ? 'Open' : 'Closed',
    };

    try {
      await axios.post('http://localhost:3030/api/create-subtask', newSubtask);
      console.log('✅ Subtask submitted successfully');
      onClose?.();
    } catch (error) {
      console.error('❌ Error submitting subtask:', error);
    }
  };

  const renderStatusToggle = (status, onClick) => (
    <Box
      onClick={onClick}
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
  );

  return (
    <Paper
      elevation={4}
      sx={{
        width: '95%',
        maxWidth: 600,
        height: '700px',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#fff',
        zIndex: 10000,
        position: 'fixed',
        top: '0.5%',
        right: '0.5%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          backgroundColor: '#9DECF9',
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography fontWeight={600}>Actions</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{
          borderBottom: 1,
          borderColor: 'white',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 500,
          },
        }}
      >
        <Tab label="Edit Task" />
        <Tab label="Sub-Task" />
        <Tab label="Task Details" />
      </Tabs>

      <Box sx={{ p: 2, flex: 1, overflowY: 'auto', ml: 2.5 }}>
        {tabIndex === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                size="small"
                sx={{ width: '252px' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Task Name"
                name="taskname"
                value={formData.taskname}
                onChange={handleChange}
                size="small"
                sx={{ width: '252px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="small"
                multiline
                rows={1}
                sx={{ width: '525px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Task Status"
                variant="outlined"
                value={formData.taskstatus ? 'Open' : 'Closed'}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      {renderStatusToggle(formData.taskstatus, handleTaskStatusToggle)}
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '252px', '& .MuiOutlinedInput-root': { height: '40px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{
                    px: 6,
                    py: 1.5,
                    backgroundColor: '#1A237E',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    ml: 28,
                    mt: 15,
                    '&:hover': {
                      backgroundColor: '#0D1640',
                    },
                  }}
                >
                  Update
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {tabIndex === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project"
                name="project"
                value={formData.project}
                InputProps={{ readOnly: true }}
                size="small"
                sx={{ width: '252px', backgroundColor: '#FBECEC' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SubTask Name"
                name="subtaskname"
                value={formData.subtaskname}
                onChange={handleChange}
                size="small"
                sx={{ width: '252px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SubTask Description"
                name="subtaskdescription"
                value={formData.subtaskdescription}
                onChange={handleChange}
                size="small"
                multiline
                rows={1}
                sx={{ width: '525px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="SubTask Status"
                variant="outlined"
                value={formData.subtaskstatus ? 'Open' : 'Closed'}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      {renderStatusToggle(formData.subtaskstatus, handleSubtaskStatusToggle)}
                    </InputAdornment>
                  ),
                }}
                sx={{ width: '252px', '& .MuiOutlinedInput-root': { height: '40px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={handleSubtaskSubmit}
                  sx={{
                    px: 6,
                    py: 1.5,
                    backgroundColor: '#1A237E',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    ml: 28,
                    mt: 15,
                    '&:hover': {
                      backgroundColor: '#0D1640',
                    },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}

        {tabIndex === 2 && (
          <Grid container spacing={3}>
            {[
              ['Project', 'project'],
              ['Task Name', 'taskname'],
              ['Task Description', 'description'],
              ['Sub Task Name', 'subtaskname'],
              ['Sub Task Description', 'subtaskdescription'],
              ['Task Status', 'taskstatus'],
              ['Sub Task Status', 'subtaskstatus'],
            ].map(([label, key]) => (
              <Grid item xs={12} key={key}>
                <TextField
                  fullWidth
                  label={label}
                  name={key}
                  variant="standard"
                  value={
                    typeof formData[key] === 'boolean'
                      ? formData[key]
                        ? 'Open'
                        : 'Closed'
                      : formData[key]
                  }
                  InputProps={{ readOnly: true }}
                  size="small"
                  multiline
                  rows={1}
                  sx={{ width: '252px' }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Paper>
  );
};

export default ActionView;
