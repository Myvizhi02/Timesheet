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
  const [status, setStatus] = useState(true);

  const handleStatusChange = () => {
    setStatus((prev) => !prev);
  };

  const handleSubmit = () => {
    console.log('Submit Sub-Task', {
      project: 'Winfast',
      taskName: 'Merge JD and Core',
      description: 'Uniting Core and JD',
      status: status ? 'Open' : 'Closed',
    });
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
            value="Winfast"
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Task Name"
            value="Merge JD and Core"
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value="Uniting Core and JD"
            fullWidth
            disabled
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
