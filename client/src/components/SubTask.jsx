import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
} from '@mui/material';

const SubTaskTab = () => {
  const [project, setProject] = useState('Winfast');
  const [taskName, setTaskName] = useState('Merge JD and Core');
  const [description, setDescription] = useState('Uniting Core and JD');
  const [status, setStatus] = useState(true);

  const handleStatusChange = () => {
    setStatus((prev) => !prev);
  };

  const handleSubmit = () => {
    const subtaskData = {
      project,
      taskName,
      description,
      status: status ? 'Open' : 'Closed',
    };

    // You can send this to the API here
    // axios.post('/api/subtasks', subtaskData)

    alert('Sub-Task submitted successfully');
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>
        Sub-Task
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Project"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={status} onChange={handleStatusChange} />}
            label={status ? 'Open' : 'Closed'}
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#002884',
              px: 4,
              '&:hover': { backgroundColor: '#001e6c' },
            }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubTaskTab;
