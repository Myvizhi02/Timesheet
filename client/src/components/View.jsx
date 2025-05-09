import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import { Grid } from '@mui/system';
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const View = ({ show, onClose, data }) => {
  if (!show) return null;
  const [tasks, setTasks] = useState([]); // State to store task data
  const [formData, setFormData] = useState({
    task_status: data?.task_status === 'Open' || data?.task_status === true,
    start_date: data?.start_date || '',
    end_date: data?.end_date || '',
    start_time: data?.start_time || '',
    end_time: data?.end_time || '',
    allocated_executives: data?.allocated_executives || '',
    comments: data?.comments || '',
  });
  
  
    // Fetch tasks from backend API
    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await axios.get('http://localhost:3030/api/tasks'); // Make sure the URL matches your backend
          console.log('Tasks==>'); // Log the response for debugging
          console.log(response.data); // Log the response for debugging
          if (Array.isArray(response.data)) {
            setTasks(response.data); // Set tasks data if it's an array
          } else {
            console.error('Expected an array of tasks, but got:', response.data);
          }
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };
    
      fetchTasks();
    }, []);
    

  return (
    <Grid container>
      {/* Light gray background manually */}
      {show && (
        <Backdrop
          open={true}
          sx={{
            backgroundColor: 'rgba(220, 220, 220, 0.5)', // light gray
            zIndex: (theme) => theme.zIndex.modal - 1,
          }}
        />
      )}

      <Dialog
        open={show}
        onClose={onClose}
        hideBackdrop
        PaperProps={{
          sx: {
            position: 'fixed',
            top: 0,
            right: 0,
            m: 2,
            width: { xs: '90%', sm: '90%', md: '602px' }, // Responsive width
            height: { xs: 'auto', sm: 'auto', md: '641px' }, // Responsive height
            maxWidth: '602px',
            maxHeight: '90vh', // restrict in small screens
            borderRadius: '0.5rem',
            overflowY: 'auto',
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.25)',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            zIndex: (theme) => theme.zIndex.modal,
          }
        }}
      >
        {/* Dialog Header */}
        <DialogTitle
          sx={{
            backgroundColor: '#A3EAFD',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
          }}
        >
          <Typography variant="h6" fontSize="1.125rem">
            {data?.name || 'Employee 1'} ({data?.empId || 'K025689'})
          </Typography>
          <Button
            onClick={onClose}
            sx={{
              minWidth: 'auto',
              p: 0,
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'black',
              cursor: 'pointer',
              '&:hover': {
                color: 'red',
                backgroundColor: 'transparent'
              }
            }}
          >
            ✕
          </Button>
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent sx={{ p: 3, mt: 5 }}>
  <Typography variant="body1" fontSize="1rem" fontWeight="bold" mb={2}>
    Task Details
  </Typography>

  <Box display="flex" justifyContent="space-between" mb={2}>
    <Typography fontSize="0.9rem">
      Start Time: <strong>{formData.start_time || 'N/A'}</strong>
    </Typography>
    <Typography fontSize="0.9rem">
      Start Date: <strong>{formData.start_date || 'N/A'}</strong>
    </Typography>
  </Box>

  <Box display="flex" justifyContent="space-between" mb={2}>
    <Typography fontSize="0.9rem">
      End Time: <strong>{formData.end_time || 'N/A'}</strong>
    </Typography>
    <Typography fontSize="0.9rem">
      End Date: <strong>{formData.end_date || 'N/A'}</strong>
    </Typography>
  </Box>

  <Typography fontSize="0.9rem" mb={2}>
    Task Status: <strong>{formData.task_status ? 'Open' : 'Closed'}</strong>
  </Typography>

  <Typography fontSize="0.9rem" mb={2}>
    People Worked: <strong>{formData.allocated_executives || 'N/A'}</strong>
  </Typography>

  <Box>
    <Typography fontSize="0.9rem" mb={1}>
      Comments:
    </Typography>
    <TextField
      id="comments"
      multiline
      rows={5}
      fullWidth
      variant="outlined"
      value={formData.comments}
      InputProps={{
        readOnly: true,
      }}
      sx={{ backgroundColor: '#ffffff' }}
    />
  </Box>
</DialogContent>

      </Dialog>
    </Grid>
  );
};

export default View;