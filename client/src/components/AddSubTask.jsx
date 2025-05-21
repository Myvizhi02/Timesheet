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
  Snackbar,
  Alert
} from '@mui/material';
import React, { useState } from 'react';

const AddSubTask = ({ onClose, onSubmit, projectId, project, taskName, taskId }) => {
  console.log(projectId);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [subtask, setSubtask] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmit = async () => {
    if (!subtask || !description) {
      showSnackbar("⚠ Please fill all the required fields.", "warning");
      return;
    }

    const crm_log_id = localStorage.getItem('crm_log_id');
    const statusValue = status ? 1 : 2;

   const subTaskData = {
  project_id: projectId,
  task_id: taskId,
  sub_task_name: subtask,
  description,
  status: statusValue,
  created_by: crm_log_id,
  modified_by: crm_log_id,
};


    try {
      const res = await fetch('http://localhost:3030/api/subtasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subTaskData),
      });

      const result = await res.json();

     if (res.ok) {
  showSnackbar('✅ SubTask added successfully!', 'success');

  // Delay closing to show snackbar
  setTimeout(() => {
    if (onSubmit) onSubmit();
  }, 1500);
}
 else {
        showSnackbar(`❌ Failed to add subtask: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showSnackbar('❌ Failed to add subtask: Network error or server is down', 'error');
      console.error(error);
    }
  };

  return (
    <>
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
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
          },
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
          <Typography fontSize="18px" fontWeight="bold">
            Add Sub Task
          </Typography>
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
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} pt={4}>
            <TextField
              label="Project"
              fullWidth
              value={project}
              disabled
              InputProps={{ readOnly: true }}
              sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
            />
            <TextField
              label="Task Name"
              fullWidth
              value={taskName}
              disabled
              InputProps={{ readOnly: true }}
              sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
            />
          </Box>

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              label="Enter SubTask"
              value={subtask}
              onChange={(e) => setSubtask(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { height: '40px',  } }}
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
                        width: { xs: '40px', sm: '40px' },
                        height: '20px',
                        backgroundColor: status ? '#3DC1F2' : '#ccc',
                        borderRadius: '20px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        mr: { xs: 1, sm:4  },
                      }}
                    >
                      <Box
                        sx={{
                          height: '16px',
                          width: { xs: '17px', sm: '17px' },
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
                '& .MuiOutlinedInput-root': { height: '40px',  },
              }}
            />
          </Box>

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
                width: { xs: '80%', sm: '80%' },}}
          />

          <Box display="flex" justifyContent="center" mt="auto">
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#3758f9',
                paddingX: 5,
                paddingY: 1,
                textTransform: 'none',
                width: { xs: '90%', sm: 'auto' },
                '&:hover': { backgroundColor: '#2c47c5' },
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ✅ Snackbar moved outside Dialog */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddSubTask;
