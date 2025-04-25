import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {
  TextField,
  Grid,
  Button,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
    people: ['Employee 1', 'Employee 2'],
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

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleDateChange = (field) => (date) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleDeletePerson = (name) => {
    setFormData((prev) => ({
      ...prev,
      people: prev.people.filter((p) => p !== name)
    }));
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

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '0.5%',
        right: '0.5%',
        width: { xs: '90%', sm: '400px', md: '480px' },
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'white',
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 4,
        p: 3,
        zIndex: 1300
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <Typography
        variant="h6"
        sx={{
          mb: 2,
          backgroundColor: '#84E7F9',
          color: 'black',
          padding: 1,
          borderRadius: 1
        }}
      >
        Edit Project
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Project ID"
              fullWidth
              size="small"
              value={formData.projectId}
              onChange={handleChange('projectId')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Project Name"
              fullWidth
              size="small"
              value={formData.projectName}
              onChange={handleChange('projectName')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Domain"
              fullWidth
              size="small"
              value={formData.domain}
              onChange={handleChange('domain')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="LOB"
              fullWidth
              size="small"
              value={formData.lob}
              onChange={handleChange('lob')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Start Date"
              value={formData.startDate}
              onChange={handleDateChange('startDate')}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="End Date"
              value={formData.endDate}
              onChange={handleDateChange('endDate')}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Actual End Date"
              value={formData.actualEndDate}
              onChange={handleDateChange('actualEndDate')}
              renderInput={(params) => (
                <TextField {...params} fullWidth size="small" />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Budget"
              fullWidth
              size="small"
              value={formData.budget}
              onChange={handleChange('budget')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Add People"
              fullWidth
              size="small"
              value={formData.newPerson}
              onChange={handleChange('newPerson')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPerson();
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            {formData.people.map((person, index) => (
              <Chip
                key={index}
                label={person}
                onDelete={() => handleDeletePerson(person)}
                sx={{
                  mr: 1,
                  mb: 1,
                  backgroundColor: '#49E8EE80',
                  color: '#000'
                }}
                size="small"
              />
            ))}
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#0052cc',
                color: 'white',
                px: 4,
                py: 1
              }}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Box>
  );
};

export default EditProject;
