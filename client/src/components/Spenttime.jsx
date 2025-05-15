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
import AddSpenttime from './AddSpenttime';

const SpentTimeTable = () => {
  // Set default date to today's date
  const [selectedDate, setSelectedDate] = useState(dayjs()); // Default to current date
  const [showSpentModal, setShowSpentModal] = useState(false);
  const [spentTimeData, setSpentTimeData] = useState([]);
  const [error, setError] = useState('');

  // Fetch spent time data for the current date or selected date
  const fetchSpentTimeData = (dateString) => {
    const crmLogId = localStorage.getItem('crm_log_id');
    if (!crmLogId) {
      setError('No crm_log_id found in local storage');
      setSpentTimeData([]);
      return;
    }

    axios.get('http://localhost:3030/api/spent-time', {
      headers: {
        'Authorization': `Bearer ${crmLogId}`,
      },
      params: { date: dateString },
    })
      .then(response => {
        setSpentTimeData(response.data || []);
        setError('');
      })
      .catch(() => {
        setError('Error fetching employee data');
        setSpentTimeData([]);
      });
  };

  // Trigger fetching of spent time data for the current date initially
  useEffect(() => {
    fetchSpentTimeData(selectedDate.format('YYYY-MM-DD')); // Fetch data for current date when component mounts
  }, []);

  const handleOpenSpentModal = () => {
    setShowSpentModal(true);
  };

  const handleCloseSpentModal = () => {
    setShowSpentModal(false);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    if (newDate) {
      fetchSpentTimeData(newDate.format('YYYY-MM-DD')); // Fetch data for selected date
    }
  };

  // Calculate total worked hours
  const totalWorkedHours = spentTimeData.reduce((total, row) => total + parseFloat(row.hours || 0), 0);

  // Check if the selected date is today
  const isToday = selectedDate.isSame(dayjs(), 'day');

  return (
    <Box p={4} sx={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <Stack direction="row" spacing={3} mt={10} justifyContent="flex-end">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
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

        {/* Conditionally render the Add Spent Time button based on whether the selected date is today */}
        {isToday && (
          <Button
            variant="contained"
            startIcon={<img src={addIcon} alt="Add" width="20" />}
            onClick={handleOpenSpentModal}
            sx={{ backgroundColor: '#3D6BFA', textTransform: 'none', borderRadius: 2 }}
          >
            Add Spent Time
          </Button>
        )}
      </Stack>

      <Stack direction="column" justifyContent="space-between" alignItems="flex-start" mt={3}>
        <Typography
          variant="h6"
          sx={{
            backgroundColor: '#213E9AE5',
            color: 'white',
            px: 2,
            py: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}
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
              {spentTimeData.length > 0 ? (
                spentTimeData.map((row, index) => (
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    {selectedDate ? 'No data found for this date.' : 'Please select a date to view data.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <AddSpenttime open={showSpentModal} onClose={handleCloseSpentModal} />
    </Box>
  );
};

export default SpentTimeTable;
