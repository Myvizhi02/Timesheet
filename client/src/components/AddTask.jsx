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
      <Dialog
        open
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '602px',
            height: '597px',
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
            padding: '8px 20px',
          }}
        >
          <Typography fontSize='18px' fontWeight="bold">Add Task</Typography>
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
            padding: 4,
            overflow: 'auto',
          }}
        >
          {/* Project and Task Name */}
          <Box display="flex" gap={2} pt={5}>
            <TextField
              label="Select Project"
              fullWidth
              value={project}
              onChange={(e) => setProject(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                }
              }}
            />
            <TextField
              label="Enter Task Name"
              fullWidth
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                }
              }}
            />
          </Box>

          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
              }
            }}
          />

          {/* Status Toggle */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'fit-content',
            marginTop: '10px',
          }}>
            <TextField
              label="Status"
              variant="outlined"
              value={status ? 'Open' : 'Closed'}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <div
                      onClick={() => setStatus(!status)}
                      style={{
                        width: '40px',
                        height: '20px',
                        backgroundColor: status ? '#3DC1F2' : '#ccc',
                        borderRadius: '20px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        marginLeft: '8px'
                      }}
                    >
                      <div style={{
                        height: '16px',
                        width: '16px',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: status ? '20px' : '3px',
                        transition: 'left 0.3s'
                      }} />
                    </div>
                  </InputAdornment>
                )
              }}
              sx={{
                width: '250px',
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                }
              }}
            />
          </div>

          {/* Buttons */}
          <Box display="flex" justifyContent="center" gap={3} mt="auto">
            <Button
              variant="contained"
              onClick={() => setShowSubTaskModal(true)}
              sx={{
                backgroundColor: "#3758f9",
                paddingX: 4,
                paddingY: 1,
                '&:hover': {
                  backgroundColor: "#2c47c5",
                }
              }}
            >
              Add Sub Task
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#3758f9",
                paddingX: 4,
                paddingY: 1,
                '&:hover': {
                  backgroundColor: "#2c47c5",
                }
              }}
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
