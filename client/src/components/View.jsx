import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  TextField,
  Box
} from '@mui/material';
import { Grid } from '@mui/system';

const View = ({ show, onClose, data }) => {
  if (!show) return null;

  return (
    <Grid container>
      <Dialog
        open={show}
        onClose={onClose}
        PaperProps={{
          sx: {
            mt: -15,
            ml: '900px',
            width: '602px',
            height: '641px',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }
        }}
      >
        {/* Dialog Header */}
        <DialogTitle sx={{
          backgroundColor: '#A3EAFD',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          marginBottom: 4
        }}>
          <Typography variant="h6">
            {data?.name || 'Employee 1'} ({data?.empId || 'K025689'})
          </Typography>
          <Button
            onClick={onClose}
            sx={{
              minWidth: 'auto',
              padding: 0,
              background: 'none',
              border: 'none',
              fontSize: '24px',
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
        <DialogContent sx={{ padding: '30px', overflow: 'hidden' }}>
          <Typography variant="body1"><strong>Task Details</strong></Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Typography>Start Time: <strong>{data?.startTime || '9:50 am'}</strong></Typography>
            <Typography>Start Date: <strong>{data?.startDate || '12/2/2025'}</strong></Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Typography>End Time: <strong>{data?.endTime || '13:00 pm'}</strong></Typography>
            <Typography>End Date: <strong>{data?.endDate || '12/2/2025'}</strong></Typography>
          </Box>

          <Typography sx={{ mt: 4 }}>Task Status: <strong>{data?.status || 'Open'}</strong></Typography>

          <Typography sx={{ mt: 4 }}>People Worked: {data?.peopleWorked || 'Employee 1(K025689), Employee 3(K0123456)'}</Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" htmlFor="comments">Comments:</Typography>
            <TextField
              id="comments"
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              placeholder="Enter comments..."
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default View;
