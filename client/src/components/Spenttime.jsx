import React, { useState } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import addIcon from '../assets/add.png';
import { InputAdornment, TextField } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // or your own icon


const SpentTimeTable = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showSpentModal, setShowSpentModal] = useState(false);

  // Open the Add Spent Time modal
  const handleOpenSpentModal = () => {
    console.log("Opening Add Spent Time Modal");
    setShowSpentModal(true);  // Set showSpentModal to true
  };

  // Close the Add Spent Time modal
  const handleCloseSpentModal = () => {
    console.log("Closing Add Spent Time Modal");
    setShowSpentModal(false);  // Set showSpentModal to false
  };

  const rows = [
    {
      project: 'Time Sheet UI Design',
      task: 'Admin page design',
      subTask: 'Admin page design',
      startTime: '10.00AM',
      endTime: '01.00PM',
      comments: 'Worked on Buttons',
      workedHrs: 3
    },
    {
      project: 'Bridge',
      task: 'JD Buttons',
      subTask: 'Actions restrictions',
      startTime: '01.00PM',
      endTime: '06.00PM',
      comments: 'Code pushed to Git',
      workedHrs: 5
    },
    {
      project: 'Bridge',
      task: 'JD Buttons',
      subTask: 'Actions restrictions',
      startTime: '06.00AM',
      endTime: '06.30PM',
      comments: 'Pushed to Live',
      workedHrs: 0.5
    }
  ];

  const totalWorkedHours = rows.reduce((total, row) => total + row.workedHrs, 0);

  return (
    <Box p={4} sx={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <Stack direction="row" spacing={3} mt={5} display="flex" justifyContent="flex-end">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            format="DD-MM-YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: {
                  backgroundColor: '#FFFFFF', // Set background color to white
                  '& .MuiInputBase-root': {
                    backgroundColor: '#FFFFFF' // Ensure input field background is also white
                  }
                }
              }
            }}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          startIcon={<img src={addIcon} alt="Add" width="20" />}
          onClick={handleOpenSpentModal}
          sx={{ backgroundColor: '#3D6BFA', textTransform: 'none', borderRadius: 2 }}
        >
          Add Spent Time
        </Button>
      </Stack>
      <Stack direction="column" justifyContent="space-between" alignItems="flex-start" mt={3}>
        <Typography
          variant="h6"
          sx={{ backgroundColor: '#213E9AE5', color: 'white', px: 2, py: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        >
          Total Hours Worked: {totalWorkedHours} hrs
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#84E7F9' }}>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Task</TableCell>
                <TableCell>Sub-Task</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Worked Hrs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.project}</TableCell>
                  <TableCell>{row.task}</TableCell>
                  <TableCell>{row.subTask}</TableCell>
                  <TableCell>{row.startTime}</TableCell>
                  <TableCell>{row.endTime}</TableCell>
                  <TableCell>{row.comments}</TableCell>
                  <TableCell>{row.workedHrs}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {/* Modal for adding spent time */}
      {showSpentModal && <AddSpenttime onClose={handleCloseSpentModal} />}
    </Box>
  );
};

export default SpentTimeTable;
