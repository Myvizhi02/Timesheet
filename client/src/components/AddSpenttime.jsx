import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dateIcon from '../assets/date.png';

const AddSpenttime = ({ open, onClose }) => {
  const [subTasks, setSubTasks] = useState([]);
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');

  useEffect(() => {
    const fetchAgentName = async () => {
      try {
        const agentId = localStorage.getItem('agentId');
        if (agentId) {
          const response = await axios.get(`http://localhost:3030/api/agents/${agentId}`);
          setAgentName(response.data.name);
          localStorage.setItem('name', response.data.name);
        }
      } catch (error) {
        console.error('Error fetching agent name:', error);
      }
    };

    fetchAgentName();
  }, []);

  useEffect(() => {
    if (open) {
      // Reset fields when modal opens
      setSubTasks([]);
      setStartDateTime(null);
      setEndDateTime(null);
    }
  }, [open]);
  

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, '']);
  };

  return (
    <>
      {/* Header Section
      <Box
        sx={{
          backgroundColor: 'white',
          width: '100%',
          height: '70px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          boxSizing: 'border-box',
          position: 'sticky', // Keep the header fixed on top
          top: 0,
          zIndex: 10, // Ensures the header stays on top of other content
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton>
            <NavIcon sx={{ width: 26 }} />
          </IconButton>
          <IconButton>
            <HomeIcon sx={{ width: 24 }} />
          </IconButton>
          <IconButton>
            <ArrowIcon sx={{ width: 26 }} />
          </IconButton>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>Spent Time</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>{agentName}</Typography>
          <img
            src={DimgIcon}
            alt="User Icon"
            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
          />
        </Box>
      </Box> */}

      {/* Modal (Popup) */}
      <Dialog
        open={open} // controlled by parent
        onClose={onClose}
        fullWidth={false}
        PaperProps={{
          sx: {
            width: '37.625rem',
            height: '37.5rem',
            m: 0,
            p: 0,
            position: 'absolute', // Position the modal correctly
            top: '50%', // Center the modal vertically
            left: '50%', // Center the modal horizontally
            transform: 'translate(-50%, -50%)', // Adjust for exact centering
            zIndex: 11, // Ensure modal is above other content
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
              <Grid item>
                <TextField
                  label="Select Project"
                  variant="outlined"
                  size="small"
                  sx={{ width: '16rem', height: '2.5rem' }}
                />
              </Grid>

              <Grid item>
                <TextField
                  label="Select Task"
                  variant="outlined"
                  size="small"
                  sx={{ width: '16rem', height: '2.5rem' }}
                />
              </Grid>

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
                      width: '27.5rem',
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

              <Grid item xs={12} sm={6}>
              <TimePicker
  label="Start Time"
  value={startDateTime}
  onChange={(newValue) => setStartDateTime(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      sx={{
        width: '247px', // Set the width to 247px
        height: '40px', // Set the height to 40px
      }}
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
  label="Start Time"
  value={startDateTime}
  onChange={(newValue) => setStartDateTime(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      sx={{
        width: '257px',
        height: '40px',}}
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

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                <TextField
                  label="Enter Comments"
                  multiline
                  variant="outlined"
                  sx={{
                    width: '33rem',
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
    </>
  );
};

// Parent Component
const ParentComponent = () => {
  const [open, setOpen] = useState(true); // open immediately when loaded

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AddSpenttime open={open} onClose={handleDialogClose} />
    </div>
  );
};

export default AddSpenttime;

