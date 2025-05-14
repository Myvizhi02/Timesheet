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

const ActionView = ({ task = {}, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    project: task.project_name || '',
    task_name: task.task_name || '',
    task_description: task.task_description || '',
    subtask_name: task.subtask_name || '',
    subtask_description: task.subtask_description || '',
    task_status: task.task_status === "1" || task.task_status === 'Open' || task.task_status === true,
    subtask_status: task.subtask_status === "1" || task.subtask_status === 'Open' || task.subtask_status === true,
  });
  console.log(task)

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTaskStatusToggle = async () => {
    const newStatus = !formData.task_status;
    const updatedData = {
      ...formData,
      task_status: newStatus,
      ...(newStatus ? {} : { task_name: '', task_description: '' }),
    };
    setFormData(updatedData);

    const payload = {
      task_name: updatedData.task_name,
      task_description: updatedData.task_description,
      task_status: newStatus ? 'Open' : 'Closed',
    };

    try {
      await axios.put(`http://localhost:3030/api/update-task/${task.task_id}`, payload);
      setSnackbar({ open: true, message: 'Task updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Task update failed', severity: 'error' });
    }
  };

  const handleSubtaskStatusToggle = async () => {
    const newStatus = !formData.subtask_status;
    const updatedData = {
      ...formData,
      subtask_status: newStatus,
      ...(newStatus ? {} : { subtask_name: '', subtask_description: '' }),
    };
    setFormData(updatedData);

    if (!task?.subtask_id) {
      setSnackbar({ open: true, message: 'Subtask ID missing for update', severity: 'error' });
      return;
    }

    const payload = {
      subtask_name: updatedData.subtask_name,
      description: updatedData.subtask_description,
      status: newStatus ? 'Open' : 'Closed',
    };

    try {
      await axios.put(`http://localhost:3030/api/subtasks/${task.subtask_id}`, payload);
      setSnackbar({ open: true, message: 'Subtask status updated successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Subtask update failed', severity: 'error' });
    }
  };

  const handleUpdate = async () => {
    if (!task?.task_id) return;

    const payload = {
      task_name: formData.task_name,
      task_description: formData.task_description,
      task_status: formData.task_status ? 'Open' : 'Closed',
    };

    try {
      await axios.put(`http://localhost:3030/api/update-task/${task.task_id}`, payload);
      setSnackbar({ open: true, message: 'Task updated successfully', severity: 'success' });
      if (onClose) onClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Task update failed', severity: 'error' });
    }
  };

  const handleSubtaskSubmit = async () => {
    if (!task?.subtask_id) {
      setSnackbar({ open: true, message: 'Subtask ID missing for update', severity: 'error' });
      return;
    }

    const payload = {
      subtask_name: formData.subtask_name,
      description: formData.subtask_description,
      status: formData.subtask_status ? 'Open' : 'Closed',
    };

    try {
      await axios.put(`http://localhost:3030/api/subtasks/${task.subtask_id}`, payload);
      setSnackbar({ open: true, message: 'Subtask updated successfully', severity: 'success' });
      if (onClose) onClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Subtask update failed', severity: 'error' });
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
    <Paper elevation={4} sx={{ width: '95%', maxWidth: 600, height: '700px', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff', zIndex: 10000, position: 'fixed', top: '0.5%', right: '0.5%', display: 'flex', flexDirection: 'column' }}>
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
                value={formData.task_status ? 'Open' : 'Closed'}
                InputProps={{
                  readOnly: true,
                  endAdornment: <InputAdornment position="end">{renderStatusToggle(formData.task_status, handleTaskStatusToggle)}</InputAdornment>,
                }}
                sx={{ width: '252px', '& .MuiOutlinedInput-root': { height: '40px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={4}>
                <Button variant="contained" onClick={handleUpdate} sx={{ px: 6, py: 1.5, backgroundColor: '#1A237E', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#0D1640' } }}>
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
                value={formData.subtask_status ? 'Open' : 'Closed'}
                InputProps={{
                  readOnly: true,
                  endAdornment: <InputAdornment position="end">{renderStatusToggle(formData.subtask_status, handleSubtaskStatusToggle)}</InputAdornment>,
                }}
                sx={{ width: '252px', '& .MuiOutlinedInput-root': { height: '40px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={4}>
                <Button variant="contained" onClick={handleSubtaskSubmit} sx={{ px: 6, py: 1.5, backgroundColor: '#1A237E', borderRadius: 2, textTransform: 'none', fontWeight: 600, '&:hover': { backgroundColor: '#0D1640' } }}>
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
                    typeof formData[key] === 'boolean'
                      ? formData[key] ? 'Open' : 'Closed'
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
