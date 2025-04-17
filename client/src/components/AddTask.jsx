import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
  Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddSubTask from './AddSubTask';

const AddTask = ({ onClose, onSubmit }) => {
  const [project, setProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [showSubTaskModal, setShowSubTaskModal] = useState(false);

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
    <>
      {/* Main Task Dialog */}
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            backgroundColor: '#A3EAFD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography fontWeight="bold">Add Task</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 4 }}>
          {/* Project and Task Name */}
          <Box display="flex" gap={2}>
            <TextField
              label="Project"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
            />
            <TextField
              label="Task Name"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
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

          {/* Status Switch */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>Status:</Typography>
            <Switch checked={status} onChange={() => setStatus(!status)} />
            <Typography>{status ? 'Open' : 'Closed'}</Typography>
          </Box>

          {/* Buttons */}
          <Box display="flex" justifyContent="center" gap={3} mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowSubTaskModal(true)}
              sx={{ paddingX: 4, paddingY: 1 }}
            >
              Add Sub Task
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ paddingX: 4, paddingY: 1 }}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* SubTask Modal */}
      {showSubTaskModal && (
        <AddSubTask
          onClose={() => setShowSubTaskModal(false)}
          onSubmit={(data) => {
            console.log('Subtask data:', data);
            setShowSubTaskModal(false);
          }}
        />
      )}
    </>
  );
};

export default AddTask;
