import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const ActionView = ({ task = {}, onClose,onUpdateDone  }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    project: task.project_name || '',
    task_name: task.task_name || '',
    task_description: task.task_description || '',
    subtask_name: task.subtask_name || '',
    subtask_description: task.subtask_description || '',
    task_status: task.task_status === 1 || task.task_status === '1' ? 1 : 2,
    subtask_status: task.subtask_status === 1 || task.subtask_status === '1' ? 1 : 2,
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskStatusToggle = async () => {
    const newStatus = formData.task_status === 1 ? 2 : 1;

    setFormData(prev => ({
      ...prev,
      task_status: newStatus,
    }));
  };

  const handleSubtaskStatusToggle = async () => {
    const newStatus = formData.subtask_status === 1 ? 2 : 1;

    setFormData(prev => ({
      ...prev,
      subtask_status: newStatus,
    }));

    if (!task?.sub_task_id) {
      setSnackbar({ open: true, message: 'Subtask ID missing for update', severity: 'error' });
      return;
    }
  };

  const handleUpdate = async () => {
    if (!task?.task_id) return;

    const payload = {
      task_name: formData.task_name,
      task_description: formData.task_description,
      task_status: formData.task_status, // send 1 or 2
    };

    try {
      await axios.put(`http://localhost:3030/api/update-task/${task.task_id}`, payload);
      setSnackbar({ open: true, message: 'Task updated successfully', severity: 'success' });
        onUpdateDone();
    } catch (error) {
      console.log("lllll", error)
      setSnackbar({ open: true, message: 'Task update failed', severity: 'error' });
    }
  };

  const handleSubtaskUpdate = async () => {
    // if (!task?.sub_task_id) {
    //   //setSnackbar({ open: true, message: 'Subtask ID missing for update', severity: 'error' });
    //   return;
    // }

    const payload = {
      subtask_name: formData.subtask_name,
      description: formData.subtask_description,
      status: formData.subtask_status, // send 1 or 2
    };

    try {
      await axios.put(`http://localhost:3030/api/subtasks/${task.sub_task_id}`, payload);
      setSnackbar({ open: true, message: 'Subtask status updated successfully', severity: 'success' });
       onUpdateDone();
    } catch (error) {
      setSnackbar({ open: true, message: 'Subtask update failed', severity: 'error' });
    }
  };

 const handleSubtaskSubmit = async () => {
  const { subtask_name, subtask_description, project, task_name, subtask_status } = formData;

  if (!subtask_name || !subtask_description) {
    setSnackbar({ open: true, message: '⚠ Please fill all the required fields.', severity: 'warning' });
    return;
  }

  const crm_log_id = localStorage.getItem('crm_log_id');

  const subTaskData = {
    project_name: project,
    task_name: task_name,
    sub_task_name: subtask_name,
    description: subtask_description,
    status: subtask_status,
    created_by: crm_log_id,
    modified_by: crm_log_id,
  };

  try {
    const res = await fetch('http://localhost:3030/api/subtasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subTaskData),
    });

    const result = await res.json();

    if (res.ok) {
      setSnackbar({ open: true, message: '✅ SubTask added successfully!', severity: 'success' });
      setTimeout(() => {
        onUpdateDone();  // Call parent update function
      }, 1500);
    } else {
      setSnackbar({ open: true, message: `❌ Failed to add subtask: ${result.error || 'Unknown error'}`, severity: 'error' });
    }
  } catch (error) {
    console.error(error);
    setSnackbar({ open: true, message: '❌ Failed to add subtask: Network error or server is down', severity: 'error' });
  }
};


  const renderStatusToggle = (status, onClick) => (
    <Box
      onClick={onClick}
      sx={{
        width: '40px',
        height: '20px',
        backgroundColor: status === 1 ? '#3DC1F2' : '#ccc',
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
          left: status === 1 ? '20px' : '3px',
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
      <Box sx={{ backgroundColor: '#9DECF9', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography fontWeight={600}>Actions</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>

      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{ borderBottom: 1, borderColor: 'white', '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 } }}
      >
        <Tab label="Edit Task" />
        <Tab label="Sub-Task" />
        <Tab label="Task Details" />
      </Tabs>

      <Box sx={{ p: 2, flex: 1, overflowY: 'auto', ml: 2.5 }}>
        {tabIndex === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField label="Project" name="project" value={formData.project} size="small" InputProps={{ readOnly: true }} sx={{ width: '252px', backgroundColor: '#FBECEC' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Task Name" name="task_name" value={formData.task_name} onChange={handleChange} size="small" sx={{ width: '252px' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Task Description" name="task_description" value={formData.task_description} onChange={handleChange} size="small" multiline rows={1} sx={{ width: '525px' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Task Status"
                value={formData.task_status === 1 ? 'Open' : 'Closed'}
                InputProps={{
                  readOnly: true,
                  endAdornment: <InputAdornment position="end">{renderStatusToggle(formData.task_status, handleTaskStatusToggle)}</InputAdornment>,
                }}
                sx={{ width: '252px', '& .MuiOutlinedInput-root': { height: '40px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{ px: 6, py: 1.5, backgroundColor: '#1A237E', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#0D1640' } }}
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
              <TextField label="Project" name="project" value={formData.project} size="small" InputProps={{ readOnly: true }} sx={{ width: '252px', backgroundColor: '#FBECEC' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="SubTask Name" name="subtask_name" value={formData.subtask_name} onChange={handleChange} size="small" sx={{ width: '252px' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="SubTask Description" name="subtask_description" value={formData.subtask_description} onChange={handleChange} size="small" multiline rows={1} sx={{ width: '525px' }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="SubTask Status"
                value={formData.subtask_status === 1 ? 'Open' : 'Closed'}
                InputProps={{
                  readOnly: true,
                  endAdornment: <InputAdornment position="end">{renderStatusToggle(formData.subtask_status, handleSubtaskStatusToggle)}</InputAdornment>,
                }}
                sx={{ width: '252px', '& .MuiOutlinedInput-root': { height: '40px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
  type="button"
  variant="contained"
  onClick={task?.sub_task_id ? handleSubtaskUpdate : handleSubtaskSubmit}
  sx={{ px: 6, py: 1.5, backgroundColor: '#1A237E', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#0D1640' } }}
>
  {task?.sub_task_id ? 'Update' : 'Submit'}
</Button>

              </Box>
            </Grid>
          </Grid>
        )}

        {tabIndex === 2 && (
          <Grid container spacing={3}>
            {[
              ['Project', 'project'],
              ['Task Name', 'task_name'],
              ['Task Description', 'task_description'],
              ['Sub Task Name', 'subtask_name'],
              ['Sub Task Description', 'subtask_description'],
              ['Task Status', 'task_status'],
              ['Sub Task Status', 'subtask_status'],
            ].map(([label, key]) => (
              <Grid item xs={12} key={key}>
                <TextField
                  fullWidth
                  label={label}
                  name={key}
                  variant="standard"
                  value={
                    (key === 'task_status' || key === 'subtask_status')
                      ? (formData[key] === 1 ? 'Open' : 'Closed')
                      : formData[key]
                  }
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Paper>
  );
};

export default ActionView;