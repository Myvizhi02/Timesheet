import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateIcon from '../date.png';

const Spenttime = ({ onClose }) => {
  const [subTasks, setSubTasks] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <Button
      onClick={onClick}
      ref={ref}
      variant="outlined"
      sx={{
        width: '15.5rem',
        height: '2.5rem',
        justifyContent: 'space-between',
        paddingInline: '1rem',
        borderRadius: '0.5rem',
        textTransform: 'none',
      }}
    >
      <Typography sx={{ color: value ? 'text.primary' : 'text.secondary' }}>
        {value || placeholder}
      </Typography>
      <img src={dateIcon} alt="date-icon" style={{ width: '1.25rem' }} />
    </Button>
  ));

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
          width: '37.625rem',  // 602px
          height: '37.5rem',   // 600px
          m: 0,
          p: 0,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          backgroundColor: '#A3EAFD',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '3rem',
          px: 3,py:0
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Add Spent Time
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        dividers
        sx={{
          p: 2,
          pt: 3,
          height: 'calc(100% - 7rem)', // adjust based on title + footer height
          overflowY: 'auto',
        }}
      >
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

          {/* Select SubTask and Button in same row */}
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
                  width: '27rem', // 433px
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
                  width: '5rem', // 79px
                  height: '2.5rem',
                  textTransform: 'none',
                  minWidth: 0,
                }}
              >
                Add
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

          {/* Start Date & End Date */}
          <Grid item container spacing={2} justifyContent="center">
            <Grid item>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Select Start Date"
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput placeholder="Start Date" />}
              />
            </Grid>
            <Grid item>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Select End Date"
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput placeholder="End Date" />}
              />
            </Grid>
          </Grid>

          {/* Comments */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
              label="Enter Comments"
              multiline
              variant="outlined"
              sx={{
                width: '32.6rem', // 522px
                '& .MuiInputBase-root': {
                  minHeight: '6.25rem', // 100px
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer */}
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

export default Spenttime;
