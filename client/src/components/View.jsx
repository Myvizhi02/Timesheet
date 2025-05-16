import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  Box,
  TextField,
  Backdrop,
  Button,
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

<<<<<<< HEAD
const ViewTaskDetails = ({ show, onClose, projectId, taskId, employee }) => {
=======
const View = ({ show, onClose, projectId, taskId, employee }) => {
  // const empId =  localStorage.getItem('agentId');
  
  console.log( projectId, taskId, employee)
  // State to hold the fetched task details
>>>>>>> ca016fb2ab0e5ddde5af8f8c31e5602124a87d1e
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
          params: {
            project_id: projectId,
            task_id: taskId,
          },
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
        }
      } catch (error) {
        console.error('Error fetching spent time details:', error);
      }
    };

    fetchSpentTimeDetails();
  }, [show, projectId, taskId]);

  return (
    <>
      {show && (
        <Backdrop
          open
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
            maxWidth: '602px',
            maxHeight: '90vh',
            borderRadius: '0.5rem',
            overflowY: 'auto',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.25)',
            zIndex: (theme) => theme.zIndex.modal,
          },
        }}
      >
        {/* Header */}
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
                backgroundColor: 'transparent',
              },
            }}
            aria-label="Close"
          >
            ✕
          </Button>
        </DialogTitle>

        {/* Content */}
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">
                Start Time
              </Typography>
              <Typography variant="body2">{formData.start_time}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">
                End Time
              </Typography>
              <Typography variant="body2">{formData.end_time}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">
                Start Date
              </Typography>
              <Typography variant="body2">{formData.start_date}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">
                End Date
              </Typography>
              <Typography variant="body2">{formData.end_date}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold">
                Task Status
              </Typography>
              <Box display="flex" alignItems="center">
                <FiberManualRecordIcon
                  sx={{
                    fontSize: 12,
                    color: formData.task_status ? 'green' : 'red',
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  {formData.task_status ? 'Open' : 'Closed'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold">
                People Worked
              </Typography>
              <Typography variant="body2">{formData.people_worked}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Comments:
              </Typography>
              <TextField
                multiline
                fullWidth
                minRows={3}
                value={formData.comments}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewTaskDetails;
