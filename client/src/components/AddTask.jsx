import React, { useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  InputAdornment
} from '@mui/material';
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
      <Modal open onClose={onClose}>
        <Box
          sx={{
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            mx: 'auto',
            mt: '5%',
            position: 'relative',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: '#A3EAFD',
              px: 3,
              py: 2,
              borderRadius: '10px 10px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Add Task
            </Typography>
            <Button
              onClick={onClose}
              sx={{
                minWidth: 'auto',
                color: 'black',
                fontSize: '20px',
                lineHeight: 1,
              }}
            >
              ✕
            </Button>
          </Box>

          {/* Content */}
          <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Select Project"
                variant="outlined"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
              <TextField
                fullWidth
                label="Enter Task"
                variant="outlined"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              label="Enter Description"
              minRows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            {/* Status toggle */}
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
                        width: 40,
                        height: 20,
                        borderRadius: 10,
                        bgcolor: status ? '#3DC1F2' : '#ccc',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: '#fff',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: 2,
                          left: status ? 20 : 3,
                          transition: 'left 0.3s',
                        }}
                      />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{ width: 250 }}
            />
          </Box>

          {/* Buttons */}
          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Button
              variant="contained"
              sx={{ bgcolor: '#1034A6', minWidth: 140 }}
              onClick={() => setShowSubTaskModal(true)}
            >
              Add Sub Task
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: '#1034A6', minWidth: 140 }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* SubTask Modal */}
      {showSubTaskModal && (
        <AddSubTask
          project={project}
          taskName={taskName}
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
