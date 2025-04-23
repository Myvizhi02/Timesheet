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
  Divider,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditView = ({ task = {}, onClose }) => {
  const [tabIndex, setTabIndex] = useState(1);
  const [formData, setFormData] = useState({
    project: task.project || '',
    taskname: task.taskname || '',
    description: task.description || '',
    status: task.status === 'Open',
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
      elevation={3}
      sx={{
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#9DECF9',
          px: 3,
          py: 2,
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

      {/* Content */}
      {tabIndex === 1 && (
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                size="small"
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
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status}
                    onChange={handleStatusToggle}
                    color="primary"
                  />
                }
                label={formData.status ? 'Open' : 'Closed'}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button
                variant="contained"
                onClick={handleUpdate}
                sx={{
                  px: 6,
                  py: 1.2,
                  backgroundColor: '#1A237E',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#0D1640',
                  },
                }}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Placeholder tabs */}
      {tabIndex !== 1 && (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Section coming soon...</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default EditView;
