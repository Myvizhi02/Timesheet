import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateIcon from '../date.png';

const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <Box
    onClick={onClick}
    ref={ref}
    sx={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px 12px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#fff',
      width: '100%',
      height: '42px',
      cursor: 'pointer',
    }}
  >
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      readOnly
      style={{
        border: 'none',
        outline: 'none',
        width: '100%',
        backgroundColor: 'transparent',
        fontSize: '14px',
        color: value ? '#000' : '#888',
      }}
    />
    <img src={dateIcon} alt="Date Icon" style={{ width: '20px', marginLeft: '8px' }} />
  </Box>
));

const AddProject = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    domain: '',
    lob: '',
    budget: '',
    people: '',
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData, startDate, endDate };
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      {/* Header */}
      <Box sx={{ backgroundColor: '#A3EAFD', borderTopLeftRadius: 1, borderTopRightRadius: 1 }}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
          }}
        >
          <Typography variant="h6" fontWeight="600">
            Add Project
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Box>

      <DialogContent sx={{ padding: 3 }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                name="projectId"
                label="Project ID"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="projectName"
                label="Project Name"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="domain"
                label="Domain"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="lob"
                label="LOB"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                required
              />
            </Grid>
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
            <Grid item xs={6}>
              <TextField
                name="budget"
                label="Budget"
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="people"
                label="Add People"
                variant="outlined"
                fullWidth
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box textAlign="center" mt={6}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#3D6BFA',
                color: '#fff',
                padding: '10px 30px',
                borderRadius: '6px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#2C52C7',
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProject;
