import React, { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, IconButton, Switch, TextField, Typography, InputAdornment } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AddSubTask = ({ onClose, onSubmit }) => {
  const [project, setProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);

  const handleSubmit = () => {
    const taskData = {
      project,
      taskName,
      description,
      status: status ? 'Open' : 'Closed',
    };
    onSubmit(taskData);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header */}
      <DialogTitle sx={{ backgroundColor: '#A3EAFD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight="bold">Add SubTask</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 4 }}>
        {/* Project and Task Name */}
        <Box display="flex" gap={2}>
          <TextField
            label="Project"
            fullWidth
            value={project}
            onChange={(e) => setProject(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">Winfast</InputAdornment>,
            }}
          />
          <TextField
            label="Task Name"
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">Creating Ticket</InputAdornment>,
            }}
          />
        </Box>

        {/* Status Switch */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography>Status:</Typography>
          <Switch checked={status} onChange={() => setStatus(!status)} />
          <Typography>{status ? 'Open' : 'Closed'}</Typography>
        </Box>

        {/* Description */}
        <TextField
          label="Description"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />

        {/* Submit Button */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ paddingX: 5, paddingY: 1 }}
          >
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubTask;
