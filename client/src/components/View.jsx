import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Backdrop,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Grid
} from '@mui/material';

const View = ({ show, onClose, projectId, taskId, employee }) => {
  const [formData, setFormData] = useState({
    task_status: false,
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    people_worked: '',
    comments: '',
  });

  useEffect(() => {
    if (!show || !projectId || !taskId) {
      setFormData({
        task_status: false,
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        people_worked: '',
        comments: '',
      });
      return;
    }

    const fetchSpentTimeDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3030/api/spenttime/details', {
          params: { project_id: projectId, task_id: taskId },
        });

        if (Array.isArray(response.data) && response.data.length > 0) {
          const details = response.data[0];
          setFormData({
            task_status: details.status === 1,
            start_date: details.start_date || '',
            end_date: details.end_date || '',
            start_time: details.start_time || '',
            end_time: details.end_time || '',
            people_worked: details.people_worked || 'N/A',
            comments: details.comments || '',
          });
        } else {
          setFormData({
            task_status: false,
            start_date: '',
            end_date: '',
            start_time: '',
            end_time: '',
            people_worked: 'N/A',
            comments: '',
          });
        }
      } catch (error) {
        console.error('Error fetching spent time details:', error);
        setFormData({
          task_status: false,
          start_date: '',
          end_date: '',
          start_time: '',
          end_time: '',
          people_worked: 'N/A',
          comments: '',
        });
      }
    };

    fetchSpentTimeDetails();
  }, [show, projectId, taskId]);

const responsiveRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  mb: 2,
  flexDirection: {
    xs: 'column', // On mobile: stack vertically
    sm: 'row',    // On tablet+ desktop: row side by side
  },
  gap: {
    xs: 1, // gap between items vertically on mobile
    sm: 0, // no gap needed horizontally on desktop because justifyContent space-between
  },
};

  return (
    <Grid container>
      {show && (
        <Backdrop
          open={true}
          sx={{
            backgroundColor: 'rgba(220, 220, 220, 0.5)',
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
            width: { xs: '90%', sm: '90%', md: '602px' },
            height: { xs: 'auto', sm: 'auto', md: '641px' },
            maxWidth: '500px',
            maxHeight: '90vh',
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
        <DialogTitle
          sx={{
            backgroundColor: '#A3EAFD',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 1.5,
            py:0
          }}
        >
          <Typography variant="h6" fontSize="1.125rem">
            {employee?.name || 'Employee'} ({employee?.empId || ' '})
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
            aria-label="Close"
          >
            ✕
          </Button>
        </DialogTitle>
<DialogContent sx={{ p: 4, mt: 2 }}>
  <Typography variant="body1" fontWeight="bold" mb={2} fontSize="1rem">
    Task Details
  </Typography>

    <Box display="flex" justifyContent="space-between" mb={2}sx={responsiveRowStyle}>
            <Typography fontSize="0.9rem" mb={1}>
              Start Time: <strong>{formData.start_time || 'N/A'}</strong>
            </Typography>
            <Typography fontSize="0.9rem">
              Start Date: <strong>{formData.start_date || 'N/A'}</strong>
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2} sx={responsiveRowStyle}>
            <Typography fontSize="0.9rem" mb={1}>
              End Time: <strong>{formData.end_time || 'N/A'}</strong>
            </Typography>
            <Typography fontSize="0.9rem">
              End Date: <strong>{formData.end_date || 'N/A'}</strong>
            </Typography>
          </Box>

          <Typography fontSize="0.9rem" mb={2} >
            Task Status: <strong>{formData.task_status ? 'Open' : 'Closed'}</strong>
          </Typography>

          <Typography fontSize="0.9rem" mb={2} >
            People Worked: <strong>{formData.people_worked}</strong>
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
              sx={{  width: {
    xs: '80%',   
    sm: '200px',   
  },backgroundColor: '#ffffff' }}
            />
          </Box>

</DialogContent>


      </Dialog>
    </Grid>
  );
};

export default View;
