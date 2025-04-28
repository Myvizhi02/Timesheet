import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloseIcon from '@mui/icons-material/Close';

const EditProject = ({ project, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    domain: '',
    lob: '',
    startDate: null,
    endDate: null,
    actualEndDate: null,
    budget: '',
    people: [],
    newPerson: ''
  });

  useEffect(() => {
    if (project) {
      setFormData({
        projectId: project.id || 'PJ1234567',
        projectName: project.name || '',
        domain: project.domain || '',
        lob: project.lob || '',
        startDate: new Date('2025-03-19'),
        endDate: new Date('2025-04-01'),
        actualEndDate: new Date('2025-04-08'),
        budget: '$400',
        people: ['Employee 1', 'Employee 2'],
        newPerson: ''
      });
    }
  }, [project]);

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,  // This will update the correct field in formData
    });
  };
  
  const handleDateChange = (field) => (date) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleAddPerson = () => {
    const newPerson = formData.newPerson.trim();
    if (newPerson && !formData.people.includes(newPerson)) {
      setFormData((prev) => ({
        ...prev,
        people: [...prev.people, newPerson],
        newPerson: ''
      }));
    }
  };

  const handleDeletePerson = (name) => {
    setFormData((prev) => ({
      ...prev,
      people: prev.people.filter((p) => p !== name)
    }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        right: 20,
        transform: 'translateY(-50%)',
        width: { xs: '95%', sm: '600px' }, // wider popup
        bgcolor: 'white',
        boxShadow: '-4px 0 12px rgba(0,0,0,0.2)',
        borderRadius: 2,
        overflow: 'hidden',
        zIndex: 1500,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: '#84E7F9',
          p: 2,
          position: 'relative'
        }}
      >
        <Typography variant="h6" color="black">
          Edit Project
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Form Content */}
      <Box sx={{ p: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>

          <Grid item xs={6}>
  <TextField
    label="Project ID"
    value={formData.projectId}
    onChange={handleChange('projectId')}  // Ensure this handles the update
    fullWidth
    size="small"
  />
</Grid>

            <Grid item xs={6}>
              <TextField
                label="Project Name"
                value={formData.projectName}
                onChange={handleChange('projectName')}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Second Row */}
            <Grid item xs={6}>
              <TextField
                label="Domain"
                value={formData.domain}
                onChange={handleChange('domain')}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="LOB"
                value={formData.lob}
                onChange={handleChange('lob')}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Third Row */}
            <Grid item xs={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={handleDateChange('startDate')}
                slotProps={{
                  textField: { fullWidth: true, size: 'small' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={handleDateChange('endDate')}
                slotProps={{
                  textField: { fullWidth: true, size: 'small' }
                }}
              />
            </Grid>

            {/* Fourth Row */}
            <Grid item xs={6}>
              <DatePicker
                label="Actual End Date"
                value={formData.actualEndDate}
                onChange={handleDateChange('actualEndDate')}
                slotProps={{
                  textField: { fullWidth: true, size: 'small' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Budget"
                value={formData.budget}
                onChange={handleChange('budget')}
                fullWidth
                size="small"
              />
            </Grid>

            {/* Add People (full width) */}
            <Grid item xs={12}>
              <TextField
                label="Add People"
                value={formData.newPerson}
                onChange={handleChange('newPerson')}
                fullWidth
                size="small"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPerson();
                  }
                }}
              />
            </Grid>

            {/* People Chips */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.people.map((person, index) => (
                  <Chip
                    key={index}
                    label={person}
                    onDelete={() => handleDeletePerson(person)}
                    size="small"
                    sx={{ bgcolor: '#84E7F9', color: 'black' }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Update Button */}
            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#0052cc',
                  textTransform: 'none',
                  mt: 2,
                  px: 8
                }}
              >
                Update
              </Button>
            </Grid>

          </Grid>
        </LocalizationProvider>
      </Box>
    </Box>
  );
};

export default EditProject;
