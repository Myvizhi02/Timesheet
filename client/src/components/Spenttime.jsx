import {
  Box, Button, Paper, Stack,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import addIcon from '../assets/add.png';
import AddSpenttime from './AddSpenttime'; // Ensure path is correct

const SpentTimeTable = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());  // Store selected date
  const [showSpentModal, setShowSpentModal] = useState(false);
  const [spentTimeData, setSpentTimeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);  // Store filtered data
  const [error, setError] = useState('');
  const [selectedDate2, setSelectedDate2] = useState(null);  // Ensure this is declared before use.

  // Fetch data based on selectedDate2
  useEffect(() => {
    if (selectedDate2) {
      axios.get('/api/spent-time', {
        params: { date: selectedDate2 }
      })
        .then(response => {
          setSpentTimeData(response.data);
        })
        .catch(err => {
          console.error("Error fetching data", err);
        });
    }
  }, [selectedDate2]);  // Dependency on selectedDate2

  // Fetch spent time data based on selectedDate
  useEffect(() => {
    const crmLogId = localStorage.getItem('crm_log_id');
    const formattedDate = selectedDate.format('YYYY-MM-DD');
  
    if (crmLogId) {
      axios.get('http://localhost:3030/api/spent-time', {
        headers: {
          'Authorization': `Bearer ${crmLogId}`,
        },
        params: { date: formattedDate },
      })
        .then(response => {
          console.log("API Response Data:", response.data);  // Add this line
          setSpentTimeData(response.data);
          filterDataByDate(response.data, formattedDate);
        })
        .catch(err => {
          setError('Error fetching employee data');
          console.error(err);
        });
    } else {
      setError('No crm_log_id found in local storage');
    }
  }, [selectedDate]);
  

  // Function to filter the data by selected date
  const filterDataByDate = (data, date) => {
    const filtered = data.filter((row) => {
      const rowDate = dayjs(row.start_time); // Parse the start_time
      console.log("Row Date:", rowDate.format('YYYY-MM-DD'), "Selected Date:", date);  // Add this line to debug
      return rowDate.isSame(date, 'day'); // Compare only the date (ignore time)
    });
    setFilteredData(filtered);
  };
  

  const handleOpenSpentModal = () => {
    setShowSpentModal(true);
  };

  const handleCloseSpentModal = () => {
    setShowSpentModal(false);
  };

  // Handle date change in DatePicker
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedDate2(newDate.format('YYYY-MM-DD')); // Ensure this is the correct format
    filterDataByDate(spentTimeData, newDate);  // Filter data based on selected date
  };
  

  // Calculate total worked hours
  const totalWorkedHours = spentTimeData.reduce((total, row) => total + parseFloat(row.hours || 0), 0);

  return (
    <Box p={4} sx={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <Stack direction="row" spacing={3} mt={10} justifyContent="flex-end">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}  // Trigger date change handler
            format="DD-MM-YYYY"
            slotProps={{
              textField: {
                size: 'small',
                sx: {
                  backgroundColor: '#FFFFFF',
                  '& .MuiInputBase-root': {
                    backgroundColor: '#FFFFFF'
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
  {spentTimeData.map((row, index) => (
    <TableRow key={index}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{row.project_name}</TableCell>
      <TableCell>{row.task_name}</TableCell>
      <TableCell>{row.subtask_name}</TableCell>
      <TableCell>{row.start_time}</TableCell>
      <TableCell>{row.end_time}</TableCell>
      <TableCell>{row.comments}</TableCell>
      <TableCell>{row.hours}</TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
      </Stack>

      {/* Spent Time Modal */}
      <AddSpenttime open={showSpentModal} onClose={handleCloseSpentModal} />
    </Box>
  );
};

export default SpentTimeTable;
