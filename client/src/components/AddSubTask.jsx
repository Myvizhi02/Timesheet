import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const AddSubTask = ({ onClose, onSubmit }) => {
  const [project, setProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [subtask, setSubtask] = useState('');

  const handleSubmit = () => {
    const taskData = {
      project,
      taskName,
      subtask,
      description,
      status: status ? 'Open' : 'Closed',
    };
    onSubmit(taskData);
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '90%', sm: '500px', md: '602px' },
          height: { xs: 'auto', sm: 'auto', md: '597px' },
          maxWidth: '95vw',
          maxHeight: '95vh',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#A3EAFD',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1px 20px',
        }}
      >
        <Typography fontSize="18px" fontWeight="bold">Add Sub Task</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: { xs: 2, sm: 3, md: 4 },
          overflow: 'auto',
        }}
      >
        {/* Project and Task Name */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} pt={4}>
          <TextField
            label="Project"
            fullWidth
            value={project}
            onChange={(e) => setProject(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Winfast</InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
              },
            }}
          />
          <TextField
            label="Task Name"
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Creating Ticket</InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
              },
            }}
          />
        </Box>

        {/* Subtask and Status */}
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
          <TextField
            label="Enter SubTask"
            fullWidth
            value={subtask}
            onChange={(e) => setSubtask(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
              },
            }}
          />

          <TextField
            label="Status"
            variant="outlined"
            value={status ? 'Open' : 'Closed'}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Box
                    onClick={() => setStatus(!status)}
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
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: '247px' },
              '& .MuiOutlinedInput-root': {
                height: '40px',
              },
            }}
          />
        </Box>

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Submit Button */}
        <Box display="flex" justifyContent="center" mt="auto">
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#3758f9",
              paddingX: 5,
              paddingY: 1,
              width: { xs: '100%', sm: 'auto' },
              '&:hover': {
                backgroundColor: "#2c47c5",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubTask;
