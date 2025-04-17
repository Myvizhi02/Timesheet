import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateIcon from "../date.png";

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
        width: '100%',
        height: '42px',
        justifyContent: 'space-between',
        padding: '0 12px',
        borderRadius: '8px',
        textTransform: 'none'
      }}
    >
      <Typography sx={{ color: value ? 'text.primary' : 'text.secondary' }}>
        {value || placeholder}
      </Typography>
      <img src={dateIcon} alt="date-icon" style={{ width: '20px' }} />
    </Button>
  ));

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, ""]);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header */}
      <DialogTitle sx={{ backgroundColor: '#A3EAFD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          Add Spent Time
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers sx={{ padding: 3 }}>
        <Grid container spacing={2}>
          {/* Project and Task */}
          <Grid item xs={6}>
            <TextField fullWidth label="Select Project" variant="outlined" size="small" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Select Task" variant="outlined" size="small" />
          </Grid>

          {/* Subtask and Button */}
          <Grid item xs={8}>
            <TextField
              fullWidth
              label="Select SubTask"
              variant="outlined"
              size="small"
              sx={{ backgroundColor: subTasks.length > 0 ? '#f8d7da' : 'transparent' }}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddSubTask}
              sx={{ height: '42px' }}
            >
              Add Sub Task
            </Button>
          </Grid>

          {/* Dynamic Subtasks */}
          {subTasks.map((_, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                fullWidth
                label={`Enter Sub Task ${index + 1}`}
                variant="outlined"
                size="small"
              />
            </Grid>
          ))}

          {/* Start and End Dates */}
          <Grid item xs={6}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select Start Date"
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput placeholder="Select Start Date" />}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select End Date"
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput placeholder="Select End Date" />}
            />
          </Grid>

          {/* Comments */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter Comments"
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ padding: '10px 40px', borderRadius: '8px', fontWeight: 600 }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Spenttime;