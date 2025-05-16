import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  Box,
  Divider,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const TaskDetailsDialog = ({ open, onClose, task }) => {
  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          {task.employeeName} ({task.employeeId})
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent>
        <Grid container spacing={2}>
          {/* Start Time & End Time */}
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold">Start Time</Typography>
            <Typography variant="body2">{task.startTime}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold">End Time</Typography>
            <Typography variant="body2">{task.endTime}</Typography>
          </Grid>

          {/* Start Date & End Date */}
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold">Start Date</Typography>
            <Typography variant="body2">{task.startDate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" fontWeight="bold">End Date</Typography>
            <Typography variant="body2">{task.endDate}</Typography>
          </Grid>

          {/* Task Status */}
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight="bold">Task Status</Typography>
            <Box display="flex" alignItems="center">
              <FiberManualRecordIcon
                sx={{
                  fontSize: 12,
                  color: task.status === 'Open' ? 'green' : 'red',
                  mr: 1,
                }}
              />
              <Typography variant="body2">{task.status}</Typography>
            </Box>
          </Grid>

          {/* People Worked */}
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight="bold">People Worked</Typography>
            <Typography variant="body2">{task.peopleWorked}</Typography>
          </Grid>

          {/* Comments */}
          <Grid item xs={12}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>Comments:</Typography>
            <TextField
              multiline
              fullWidth
              minRows={3}
              value={task.comments}
              InputProps={{ readOnly: true }}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
