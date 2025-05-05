import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

const EditProject = ({ project, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    project_unique_id: '',
    project_name: '',
    department: '',
    lob: '',
    start_date: '',
    end_date: '',
    expected_date: '',
    budget: '',
    allocated_executives: Array.isArray(project.allocated_executives)
    ? project.allocated_executives
    :  [],
  });

  const [adminOptions, setAdminOptions] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (project) {
      setFormData((prev) => ({
        ...prev,
        project_unique_id: project.project_unique_id || '',
        project_name: project.project_name || '',
        department: project.department || '',
        lob: project.lob || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        expected_date: project.expected_date || '',
        budget: project.budget || '',
        allocated_executives: [], // Will be filled after fetching admins
      }));
    }
  }, [project]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch('http://localhost:3030/api/admins');
        const data = await res.json();
        setAdminOptions(data);
    
        if (project?.allocated_executives?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            allocated_executives: Array.isArray(project.allocated_executives)
              ? project.allocated_executives
              : [], // Ensure it's always an array
          }));
        }
      } catch (err) {
        console.error('Failed to fetch admin names:', err);
      }
    };
  
    fetchAdmins();
  }, [project]);
  
  const allocated_ids = formData.allocated_executives.map(name => {
    const match = adminOptions.find(admin => admin.name === name);
    return match ? match.crm_log_id : null;
  }).filter(Boolean);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEmployeeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      allocated_executives: e.target.value, // Store the crm_log_ids
    }));
  };
  

  const handleChipDelete = (chipToDelete) => {
    setFormData((prev) => ({
      ...prev,
      allocated_executives: prev.allocated_executives.filter((name) => name !== chipToDelete),
    }));
  };

  const handleSubmit = async () => {
    const allocated_ids = formData.allocated_executives.map((id) => {
      const match = adminOptions.find((admin) => admin.crm_log_id === id);
      return match ? match.crm_log_id : null;
    }).filter(Boolean);
  
    const updatedData = {
      ...formData,
      allocated_executives: allocated_ids,
    };
  
    try {
      // Check if project_unique_id is available
      if (!formData.project_unique_id) {
        console.error("Project ID is missing");
        return;
      }
  
      const res = await fetch(`http://localhost:3030/api/projects/${formData.project_unique_id}`, {
        method: 'PUT', // Use PUT method for updating project data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const responseData = await res.json();
        console.log('Project updated successfully:', responseData);
        onUpdate(updatedData); // Notify the parent about the update
        onClose(); // Close the dialog
      } else {
        console.error('Failed to update project:', res.statusText);
      }
    } catch (err) {
      console.error('Error updating project:', err);
    }
  };
  
  

  const getStyles = (name, selectedValues, theme) => ({
    fontWeight: selectedValues.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  });

  const inputStyle = {
    width: '270px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          width: '650px',
          height: '793px',
          borderRadius: '10px'
        }
      }}
    >
      <Box
        sx={{
          backgroundColor: '#A3EAFD',
          borderTopLeftRadius: '0.625em',
          borderTopRightRadius: '0.625em',
          px: 1,
          py: 0,
          mt: 0,
          ml: -1
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0em 1em' }}
        >
          <Typography variant="h6" fontWeight="600">
            Edit Project
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Box>

      <DialogContent dividers sx={{ px: 3, py: 5 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Project ID"
              name="project_unique_id"
              value={formData.project_unique_id}
              onChange={handleChange}
              disabled
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Project Name"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Domain"
              name="department"
              value={formData.department}
              onChange={handleChange}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="LOB"
              name="lob"
              value={formData.lob}
              onChange={handleChange}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Date"
              name="end_date"
              type="date"
              value={formData.end_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Actual End Date"
              name="expected_date"
              type="date"
              value={formData.expected_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12}>
          <FormControl fullWidth>
  <InputLabel>Add People</InputLabel>
  <Select
    multiple
    value={formData.allocated_executives}
    onChange={handleEmployeeChange}
    sx={{
      width: '270px',
      height: '40px',
    }}
  >
    {adminOptions.map((admin) => (
      <MenuItem
        key={admin.crm_log_id}
        value={admin.crm_log_id}
        style={getStyles(admin.name, formData.allocated_executives, theme)}
      >
        {admin.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
  {formData.allocated_executives.map((id) => {
    const admin = adminOptions.find((admin) => admin.crm_log_id === id);
    return (
      admin && (
        <Chip
          key={id}
          label={admin.name}
          onDelete={() => handleChipDelete(id)}  // Pass crm_log_id for deletion
          sx={{
            backgroundColor: '#A3EAFD',
            color: '#000',
          }}
        />
      )
    );
  })}
</Box>

          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 20, mr: 8 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              width: '120px',
              backgroundColor: '#1E40AF',
              '&:hover': { backgroundColor: '#1A35A0' },
            }}
          >
            Update
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default EditProject;
