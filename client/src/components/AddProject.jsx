import CloseIcon from '@mui/icons-material/Close';
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
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateIcon from '../date.png';

// Custom Date Input
const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <Box
    onClick={onClick}
    ref={ref}
    sx={{
      display: 'flex',
      alignItems: 'center',
      padding: '0.1em 0.3em',
      border: '1px solid #ccc',
      borderRadius: '0.5em',
      backgroundColor: '#fff',
      width: '100%',
      height: '2.625em',
      cursor: 'pointer',marginBottom: '1em',
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
        fontSize: '1rem',
        color: value ? '#000' : '#888',padding: '1em 0.4em'
      }}
    />
    <img src={dateIcon} alt="Date Icon" style={{ width: '1.25em', marginLeft: '0.5em' }} />
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
      <Box sx={{ backgroundColor: '#A3EAFD', borderTopLeftRadius: '0.625em', borderTopRightRadius: '0.625em' }}>
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0em 1em',
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

      <DialogContent sx={{ padding: '1.5em' }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Row 1: Project ID & Project Name */}
            <Grid item xs={12} sm={6} mb={0}>
              <TextField
                name="projectId"
                label="Project ID"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                required
                sx={{
                  height: '60px', // height of the container
                  '& .MuiInputBase-root': {
                    height: '80%', // make the input take full height
                  },
                  '& input': {
                    height: '100%',
                    padding: '0 2.3em', // optional: adjust padding
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} mb={0}>
              <TextField
                name="projectName"
                label="Project Name"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                required
                sx={{
                  height: '60px', // height of the container
                  '& .MuiInputBase-root': {
                    height: '80%', // make the input take full height
                  },
                  '& input': {
                    height: '100%',
                    padding: '0 2.3em', // optional: adjust padding
                  },
                }}
              />
            </Grid>

            {/* Row 2: Domain & LOB */}
            <Grid item xs={12} sm={6} mb={0}>
              <TextField
                name="domain"
                label="Domain"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                required 
                sx={{
                  height: '60px', // height of the container
                  '& .MuiInputBase-root': {
                    height: '80%', // make the input take full height
                  },
                  '& input': {
                    height: '100%',
                    padding: '0 2.3em', // optional: adjust padding
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} mb={0}>
              <TextField
                name="lob"
                label="LOB"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                required
                sx={{
                  height: '60px', // height of the container
                  '& .MuiInputBase-root': {
                    height: '80%', // make the input take full height
                  },
                  '& input': {
                    height: '100%',
                    padding: '0 2.3em', // optional: adjust padding
                  },
                }}
              />
            </Grid>

            {/* Row 3: Start Date & End Date */}
            <Grid item xs={12} sm={6} mb={0} >
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput placeholder="Select Start Date" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} mb={0}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Actual End Date"
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput placeholder="Select End Date" />}
              />
            </Grid>

            {/* Row 4: End Date & Budget */}
            <Grid item xs={12} sm={6} mb={0}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput placeholder="Select End Date" />}
              />
            </Grid>
            <Grid item xs={12} sm={6} mb={0}>
              <TextField
                name="budget"
                label="Budget"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                sx={{
                  height: '60px', // height of the container
                  '& .MuiInputBase-root': {
                    height: '80%', // make the input take full height
                  },
                  '& input': {
                    height: '100%',
                    padding: '0 2.3em', // optional: adjust padding
                  },
                }}
              />
            </Grid>

            {/* Row 5: Add People */}
            <Grid item xs={12} sm={6} mb={0}>
              <TextField
                name="people"
                label="Add People"
                variant="outlined"
                fullWidth
                onChange={handleChange}
                sx={{
                  height: '60px', // height of the container
                  '& .MuiInputBase-root': {
                    height: '80%', // make the input take full height
                  },
                  '& input': {
                    height: '100%',
                    padding: '0 2.3em', // optional: adjust padding
                  },
                }}
              />
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#3D6BFA',
                color: '#fff',
                padding: '0.625em 1.875em',
                borderRadius: '0.375em',
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
