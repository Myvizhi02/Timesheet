import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import React, { useState } from 'react';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dateIcon from '../date.png'; // ✅ Your custom icon

const AddSpenttime = ({ onClose }) => {
  const [subTasks, setSubTasks] = useState([]);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, '']);
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth={false}
      PaperProps={{
        sx: {
          width: '37.625rem',
          height: '37.5rem',
          m: 0,
          p: 0,
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#A3EAFD',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '3rem',
          px: 3,
          py: 0,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Add Spent Time
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 2,
          pt: 3,
          height: 'calc(100% - 7rem)',
          overflowY: 'auto',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} justifyContent="center">
            {/* Project */}
            <Grid item>
              <TextField
                label="Select Project"
                variant="outlined"
                size="small"
                sx={{ width: '15.5rem', height: '2.5rem' }}
              />
            </Grid>

            {/* Task */}
            <Grid item>
              <TextField
                label="Select Task"
                variant="outlined"
                size="small"
                sx={{ width: '15.5rem', height: '2.5rem' }}
              />
            </Grid>

            {/* Subtask input */}
            <Grid
              item
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{ flexWrap: 'nowrap' }}
            >
              <Grid item>
                <TextField
                  label="Select SubTask"
                  variant="outlined"
                  size="small"
                  sx={{
                    width: '27rem',
                    height: '2.5rem',
                    backgroundColor: subTasks.length > 0 ? '#f8d7da' : 'transparent',
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddSubTask}
                  sx={{
                    width: '5rem',
                    height: '2.5rem',
                    textTransform: 'none',
                    minWidth: 0,
                    fontSize: '0.5rem',
                  }}
                >
                  Add Subtask
                </Button>
              </Grid>
            </Grid>

            {/* Dynamic SubTasks */}
            {subTasks.map((_, index) => (
              <Grid item key={index}>
                <TextField
                  label={`Enter Sub Task ${index + 1}`}
                  variant="outlined"
                  size="small"
                  sx={{ width: '32rem', height: '2.5rem' }}
                />
              </Grid>
            ))}

            {/* Start & End TimePickers with custom icon */}
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Start Time"
                value={startDateTime}
                onChange={(newValue) => setStartDateTime(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <img
                            src={dateIcon}
                            alt="Date Icon"
                            style={{ width: '1.25rem', cursor: 'pointer' }}
                            onClick={() => {
                              params.inputProps?.onClick?.();
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TimePicker
                label="End Time"
                value={endDateTime}
                onChange={(newValue) => setEndDateTime(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <img
                            src={dateIcon}
                            alt="Date Icon"
                            style={{ width: '1.25rem', cursor: 'pointer' }}
                            onClick={() => {
                              params.inputProps?.onClick?.();
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Comments */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <TextField
                label="Enter Comments"
                multiline
                variant="outlined"
                sx={{
                  width: '32.6rem',
                  '& .MuiInputBase-root': {
                    minHeight: '6.25rem',
                  },
                }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            py: 1,
            px: 4,
            borderRadius: '0.5rem',
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSpenttime;
