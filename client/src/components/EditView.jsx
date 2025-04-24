import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
<<<<<<< HEAD
  Box
=======
  Paper,
  IconButton,
  InputAdornment,
>>>>>>> 6a68d38e38fd6b3120d705fdc473a85aeea2b0f4
} from '@mui/material';

const EditTaskDialog = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
<<<<<<< HEAD
    project: 'Winfast',
    taskName: 'Merge JD and Core',
    description: 'Uniting Core and JD',
    status: true,
=======
    project: task.project || '',
    taskname: task.taskname || '',
    subtaskname: task.subtaskname || '',
    description: task.description || '',
    subtaskdescription: task.subtaskdescription || '',
    taskstatus: task.taskstatus === 'Open',
    subtaskstatus: task.subtaskstatus === 'Open',
>>>>>>> 6a68d38e38fd6b3120d705fdc473a85aeea2b0f4
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  const handleSwitchChange = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleUpdate = () => {
    console.log('Updated data:', formData);
    onClose();
=======
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
>>>>>>> 6a68d38e38fd6b3120d705fdc473a85aeea2b0f4
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
<<<<<<< HEAD
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: '#e0f7fa' }}>Actions</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Edit Task" />
          <Tab label="Sub-Task" />
          <Tab label="Task Details" />
        </Tabs>

        {tabIndex === 0 && (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Project"
                  name="project"
                  fullWidth
                  variant="outlined"
                  value={formData.project}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Task Name"
                  name="taskName"
                  fullWidth
                  variant="outlined"
                  value={formData.taskName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch checked={formData.status} onChange={handleSwitchChange} />}
                  label={formData.status ? 'Open' : 'Closed'}
                />
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{ backgroundColor: '#002884', px: 4 }}
=======
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
>>>>>>> 6a68d38e38fd6b3120d705fdc473a85aeea2b0f4
                >
                  Update
                </Button>
              </Grid>
            </Grid>
<<<<<<< HEAD
          </Box>
        )}

        {/* Add content for "Sub-Task" and "Task Details" tabs here */}
      </DialogContent>
    </Dialog>
=======
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
>>>>>>> 6a68d38e38fd6b3120d705fdc473a85aeea2b0f4
  );
};

export default EditTaskDialog;
