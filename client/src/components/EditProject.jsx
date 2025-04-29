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
    id: '',
    project_name: '',
    department: '',
    lob: '',
    start_date: '',
    end_date: '',
    actual_end_date: '',
    budget: '',
    employees: [],
  });

  const [adminOptions, setAdminOptions] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    if (project) {
      setFormData({
        id: project.id || '',
        project_name: project.project_name || '',
        department: project.department || '',
        lob: project.lob || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        actual_end_date: project.actual_end_date || '',
        budget: project.budget || '',
        employees: project.employees || [],
      });
    }
  }, [project]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch('http://localhost:3030/api/admins');
        const data = await res.json();
        setAdminOptions(data);
      } catch (err) {
        console.error('Failed to fetch admin names:', err);
      }
    };
    fetchAdmins();
  }, []);

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
      employees: e.target.value,
    }));
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };
  const handleChipDelete = (chipToDelete) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.filter((employee) => employee !== chipToDelete),
    }));
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
          mt:0,
          ml:-1

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
              name="id"
              value={formData.id}
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
              name="actual_end_date"
              type="date"
              value={formData.actual_end_date}
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
                value={formData.employees}
                onChange={handleEmployeeChange}
                sx={{
                  width: '270px',
                  height: '40px',
                }}
               
              >
                {adminOptions.map((admin) => (
                  <MenuItem
                    key={admin.name}
                    value={admin.name}
                    style={getStyles(admin.name, formData.employees, theme)}
                  >
                    {admin.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2, }}>
  {formData.employees.map((value) => (
    <Chip
      key={value}
      label={value}
      onDelete={() => handleChipDelete(value)} // Add delete function
      minRows={3}
      sx={{
        backgroundColor: '#A3EAFD',
        color: '#000',
      }}
    />
  ))}
</Box>

          </Grid>

          
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center',mt:20,mr:8 }}>
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
