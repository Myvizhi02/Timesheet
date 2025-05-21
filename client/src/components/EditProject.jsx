import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
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
  Snackbar,
  TextField,
  Typography,
  Portal,
} from '@mui/material';
// import { useTheme } from '@mui/material/styles';
import { useTheme, useMediaQuery } from '@mui/material';

import { useEffect, useState } from 'react';

const EditProject = ({ project, onClose, onUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    project_unique_id: '',
    project_name: '',
    department: '',
    lob: '',
    start_date: '',
    end_date: '',
    expected_date: '',
    budget: '',
    allocated_executives: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminOptions, setAdminOptions] = useState([]);


  useEffect(() => {
    if (project) {
      setFormData({
        project_unique_id: project.project_unique_id || '',
        project_name: project.project_name || '',
        department: project.department || '',
        lob: project.lob || '',
        start_date: project.start_date || '',
        end_date: project.end_date || '',
        expected_date: project.expected_date || '',
        budget: project.budget || '',
        allocated_executives: JSON.parse(project.allocated_executives) || [],
      });
    }
  }, [project]);


useEffect(() => {
  const fetchAdmins = async () => {
    try {
      const res = await fetch('http://localhost:3030/api/admins');
      const data = await res.json();
      

      setAdminOptions(data);

      // Ensure allocated_executives is parsed as an array
      let parsedExecutives = [];
      try {
        parsedExecutives = Array.isArray(project.allocated_executives)
          ? project.allocated_executives
          : JSON.parse(project.allocated_executives || '[]');
        
      } catch (e) {
        console.error("Error parsing allocated_executives:", e);
      }

      if (parsedExecutives.length > 0) {
        setFormData((prev) => ({
          ...prev,
          allocated_executives: parsedExecutives, // Already CRM IDs
        }));
      }
    } catch (err) {
      console.error('Failed to fetch admin names:', err);
    }
  };

  if (project) {
    fetchAdmins();
  }
}, [project]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (e) => {
    setFormData((prev) => ({ ...prev, allocated_executives: e.target.value }));
  };

  const handleChipDelete = (chipId) => {
    setFormData((prev) => ({
      ...prev,
      allocated_executives: prev.allocated_executives.filter((id) => id !== chipId),
    }));
  };

  const handleEditSubmit = async () => {
    if (!formData.project_unique_id) return;
    setIsSubmitting(true);

    const updatedData = {
      ...formData,
      allocated_executives: formData.allocated_executives.filter(Boolean),
    };

    try {
      const res = await fetch(`http://localhost:3030/api/projects/${formData.project_unique_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        showSnackbar('✅ Project updated successfully!', 'success');
        setTimeout(() => {
          if (onUpdate) onUpdate();
          onClose();
        }, 1000);
      } else {
        const result = await res.json();
        showSnackbar(`❌ Failed to update project: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showSnackbar('❌ Failed to update project: Network error or server is down', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStyles = (name, selectedValues, theme) => ({
    fontWeight: selectedValues.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  });

  const inputStyle = {
    width: '260px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& input': {
      padding: '0 1em',
    },
  };

  const selectStyle = {
    width: '260px',
    '& .MuiInputBase-root': {
      height: '32px', // reduced height
      minHeight: '32px',
      padding: '0',
    },
    '& .MuiSelect-select': {
      padding: '8px 14px', // control vertical padding inside select
      display: 'flex',
      alignItems: 'center',
    },
  };


  return (
    <>
      <Dialog
        open
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '10px',
            maxHeight: '90vh',
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: '#A3EAFD',
            borderTopLeftRadius: '0.625em',
            borderTopRightRadius: '0.625em',
            px: 2,
            py: 1,
          }}
        >
          <DialogTitle
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0 }}
          >
            <Typography variant="h6" fontWeight="600">
              Edit Project
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
        </Box>

        <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 5 } }}>
          <Grid container spacing={3.5}>
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Name"
                name="project_name"
                value={formData.project_name}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Domain"
                name="department"
                value={formData.department}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="LOB"
                name="lob"
                value={formData.lob}
                onChange={handleChange}
                sx={inputStyle}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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
                  sx={selectStyle}
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

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {formData.allocated_executives.map((id) => {
                  const admin = adminOptions.find((admin) => admin.crm_log_id === id);
                  return (
                    admin && (
                      <Chip
                        key={id}
                        label={admin.name}
                        onDelete={() => handleChipDelete(id)}
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

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="contained"
                onClick={handleEditSubmit}
                disabled={isSubmitting}

                sx={{
                  backgroundColor: '#213E9A',
                  color: 'white',
                  width: isMobile ? '100%' : '100%',
                  ml: isMobile ? 12 : 30,
                  height: '42px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#213E9A',
                  },
                }}

              >
                {isSubmitting ? 'Update' : 'Update'}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Portal>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{
            '& .MuiSnackbarContent-root': {
              zIndex: 2500, // Ensure it's above Dialog
            },
          }}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
};

export default EditProject;
