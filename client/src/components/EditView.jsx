import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditView = ({ task = {}, onClose }) => {
  const [tabIndex, setTabIndex] = useState(1); // Default to "Sub-Task"
  const [formData, setFormData] = useState({
    project: task.project || '',
    taskname: task.taskname || '',
    description: task.description || '',
    status: task.status === 'Open',
    assignedTo: task.assignedTo || '',
    dueDate: task.dueDate || '',
    priority: task.priority || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusToggle = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleUpdate = () => {
    const updatedTask = {
      ...task,
      ...formData,
      status: formData.status ? 'Open' : 'Closed',
    };
    console.log('Updated Task:', updatedTask);
    onClose?.();
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: '602px',
        height:'892px',
        maxWidth: 600,
        mx: 'auto',  
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#fff',
        zIndex: 1000,
        position: 'fixed', // Make it fixed to place it anywhere
        top: 0.5,           // Distance from the top of the screen
        right: 1, 
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#9DECF9',
          px: 2,
          py: 0,
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

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
        variant="fullWidth"
        textColor="primary"
        indicatorColor="primary"
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
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

      {/* Edit Task Tab */}
      {tabIndex === 0 && (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Name"
                name="taskname"
                value={formData.taskname}
                onChange={handleChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Assigned To"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleStatusToggle}
                  />
                }
                label={`Status: ${formData.status ? 'Open' : 'Closed'}`}
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
        </Box>
      )}

      {/* Sub-Task Tab */}
      {tabIndex === 1 && (
        <Box sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project"
                name="project"
                value={formData.project}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Task Name"
                name="taskname"
                value={formData.taskname}
                InputProps={{ readOnly: true }}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                size="small"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleStatusToggle}
                  />
                }
                label={`Status: ${formData.status ? 'Open' : 'Closed'}`}
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
        </Box>
      )}

      {/* Task Details Tab */}
      {tabIndex === 2 && (
        <Box sx={{ p: 4 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Task Summary
          </Typography>
          <Typography variant="body2" mt={1}>
            <strong>Project:</strong> {formData.project}
          </Typography>
          <Typography variant="body2">
            <strong>Task Name:</strong> {formData.taskname}
          </Typography>
          <Typography variant="body2">
            <strong>Description:</strong> {formData.description}
          </Typography>
          <Typography variant="body2">
            <strong>Assigned To:</strong> {formData.assignedTo}
          </Typography>
          <Typography variant="body2">
            <strong>Due Date:</strong> {formData.dueDate}
          </Typography>
          <Typography variant="body2">
            <strong>Status:</strong> {formData.status ? 'Open' : 'Closed'}
          </Typography>
          <Typography variant="body2">
            <strong>Priority:</strong> {formData.priority}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default EditView;
