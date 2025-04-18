import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddTask from './AddTask';
import addIcon from '../add.png'; // Check your image path!

const Task = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleCreateTask = (data) => {
    console.log('New Task:', data);
    setShowPopup(false);
  };

  const task = [
    {
      id: 1,
      project: "Bridge Application",
      taskname: "Merge Core and JD",
      subtask: "Sub Task",
      description: "Uniting the user of core and JD",
      status: "Open"
    },
    {
      id: 2,
      project: "Winfast CRM",
      taskname: "Setup Dashboard",
      subtask: "UI Build",
      description: "Designing dashboard UI",
      status: "Open"
    },
    {
      id: 3,
      project: "Tata CRM",
      taskname: "Setup Dashboard",
      subtask: "UI Build",
      description: "Creating initial dashboard",
      status: "Open"
    }
  ];

  return (
    <>
      {/* Page Container */}
      <Box sx={{ padding: { xs: 2, sm: 4 }, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

        {/* Header Button */}
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button
            variant="contained"
            startIcon={
              <img
                src={addIcon}
                alt="Add Icon"
                style={{ width: 20, height: 20 }}
              />
            }
            sx={{
              backgroundColor: '#3D6BFA',
              borderRadius: '12px',
              fontWeight: 600,
              width: { xs: '140px', sm: '160px' },
              height: '44px',
              fontSize: '14px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#3159d6'
              }
            }}
            onClick={() => setShowPopup(true)}
          >
            Add Task
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper} elevation={3}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#84E7F9' }}>
              <TableRow>
                <TableCell align="center"><strong>SL No</strong></TableCell>
                <TableCell align="center"><strong>Project</strong></TableCell>
                <TableCell align="center"><strong>Task Name</strong></TableCell>
                <TableCell align="center"><strong>Sub Task</strong></TableCell>
                <TableCell align="center"><strong>Description</strong></TableCell>
                <TableCell align="center"><strong>Status</strong></TableCell>
                <TableCell align="center"><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {task.map((proj, index) => (
                <TableRow key={proj.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{proj.project}</TableCell>
                  <TableCell align="center">{proj.taskname}</TableCell>
                  <TableCell align="center">{proj.subtask}</TableCell>
                  <TableCell align="center">{proj.description}</TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        color: proj.status === 'Open' ? 'green' : 'red',
                        fontWeight: 500
                      }}
                    >
                      {proj.status}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Popup for Adding Task */}
      <Dialog
        open={showPopup}
        onClose={() => setShowPopup(false)}
        fullWidth
        maxWidth="sm" // sm = 600px max width
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <AddTask onClose={() => setShowPopup(false)} onSubmit={handleCreateTask} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Task;
