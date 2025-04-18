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
import React from 'react';

const View = ({ show, onClose, data }) => {
  if (!show) return null;

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
        <DialogContent sx={{ p: 3, mt:5 }}>
          <Typography variant="body1" fontSize="1rem" fontWeight="bold" mb={2}>
            Task Details
          </Typography>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontSize="0.9rem">
              Start Time: <strong>{data?.startTime || '9:50 am'}</strong>
            </Typography>
            <Typography fontSize="0.9rem">
              Start Date: <strong>{data?.startDate || '12/2/2025'}</strong>
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontSize="0.9rem">
              End Time: <strong>{data?.endTime || '13:00 pm'}</strong>
            </Typography>
            <Typography fontSize="0.9rem">
              End Date: <strong>{data?.endDate || '12/2/2025'}</strong>
            </Typography>
          </Box>

          <Typography fontSize="0.9rem" mb={2}>
            Task Status: <strong>{data?.status || 'Open'}</strong>
          </Typography>

          <Typography fontSize="0.9rem" mb={2}>
            People Worked: {data?.peopleWorked || 'Employee 1(K025689), Employee 3(K0123456)'}
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
              placeholder="Enter comments..."
              sx={{ backgroundColor: '#ffffff' }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default View;
