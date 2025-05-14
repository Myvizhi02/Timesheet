import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const AddSubTask = ({ subtask, onClose }) => {
  if (!subtask) return null;

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Sub Task Details
      </Typography>

      <TextField
        label="Sub Task Name"
        value={subtask.subtaskName}
        fullWidth
        disabled
        margin="normal"
      />

      <TextField
        label="Description"
        value={subtask.description}
        fullWidth
        multiline
        rows={3}
        disabled
        margin="normal"
      />

      <TextField
        label="Status"
        value={subtask.status}
        fullWidth
        disabled
        margin="normal"
      />

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default AddSubTask;
