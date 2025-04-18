import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

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
    <Dialog
        open
        onClose={onClose}
        PaperProps={{
          sx: {
            width: '602px',
            height: '597px',
            borderRadius: '12px',
            overflow: 'hidden', // Remove scrollbars
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
          <Typography fontSize='18px' fontWeight="bold">Add Sub Task</Typography>
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
        {/* Project and Task Name and Enter SubTask */}
        <Box display="flex" gap={5} pt={5}>
          <TextField
            label="Project"
            fullWidth
            value={project}
            onChange={(e) => setProject(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {width: '247px',
                height: '40px',
              }
            }}
            InputProps={{
              startAdornment: <InputAdornment position="start" > Winfast</InputAdornment>,
            }}
          />
          <TextField
            label="Task Name"
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                width: '247px',
                height: '40px',
              }
            }}
          
            InputProps={{
              startAdornment: <InputAdornment position="start">Creating Ticket</InputAdornment>,
            }}
          />
          
        </Box>
        <Box display="flex" gap={2}>
        <TextField
            label="Enter SubTask"
            fullWidth
            value={project}
            onChange={(e) => setProject(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {width: '247px',
                height: '40px',
              }
            }}
            
          />

        {/* Status Toggle */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: 'fit-content',
                    marginTop: '0px',
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
                        
                        '& .MuiOutlinedInput-root': {width: '247px',
                          height: '40px',
                        }
                      }}
                    />
                  </div></Box>

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
