import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditView = ({ task = {}, onClose }) => {
  const [tabIndex, setTabIndex] = useState(1); // Default to "Sub-Task"
  const [formData, setFormData] = useState({
    project: task.project || '',
    taskname: task.taskname || '',
    subtaskname: task.subtaskname || '',
    description: task.description || '',
    subtaskdescription: task.subtaskdescription || '',
    taskstatus: task.taskstatus === 'Open',
    subtaskstatus: task.subtaskstatus === 'Open',
  });

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

  const handleUpdate = () => {
    const updatedTask = {
      ...task,
      ...formData,
      taskstatus: formData.taskstatus ? 'Open' : 'Closed',
      subtaskstatus: formData.subtaskstatus ? 'Open' : 'Closed',
    };
    console.log('Updated Task:', updatedTask);
    onClose?.();
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
        zIndex: 1000,
        position: 'fixed',
        top: '0.5%',
        right: '0.5%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
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

      {/* Tabs */}
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

      {/* Content */}
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
                  onClick={handleUpdate}
                  sx={{
                    px: 6,
                    py: 1.5,
                    backgroundColor: '#1A237E',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    mt: 15,
                    ml: 28,
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

export default EditView;
