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
  Typography,Portal
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';



const EditProject = ({ project, onClose, onUpdate }) => {
  const showSnackbar = (message, severity = 'success') => {
    console.log('Showing snackbar:', message, severity);
    setSnackbar({ open: true, message, severity });
  };
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
  const theme = useTheme();

  useEffect(() => {
    if (project) {
      console.log("allocated_executives:", project.allocated_executives);

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
        allocated_executives: JSON.parse(project.allocated_executives) || [],
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
          const ids = project.allocated_executives.map(name => {
            const admin = data.find(a => a.name === name);
            return admin?.crm_log_id;
          }).filter(Boolean);
          setFormData((prev) => ({
            ...prev,
            allocated_executives: ids
          }));
        }
      } catch (err) {
        console.error('Failed to fetch admin names:', err);
      }
    };

    fetchAdmins();
  }, [project]);

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
      allocated_executives: e.target.value,
    }));
  };

  const handleChipDelete = (chipId) => {
    setFormData((prev) => ({
      ...prev,
      allocated_executives: prev.allocated_executives.filter((id) => id !== chipId),
    }));
  };

  const handleEditSubmit = async () => {
      console.log("ala,ls,als,ls")
 setIsSubmitting(true); 
    const updatedData = {
      ...formData,
      allocated_executives: formData.allocated_executives.filter(Boolean),
    };

    if (!formData.project_unique_id) return;

    try {
      console.log("WWWWWW")
      const res = await fetch(`http://localhost:3030/api/projects/${formData.project_unique_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      console.log(res)
   if (res.ok) {
  showSnackbar('✅ Project updated successfully!', 'success');

  setTimeout(() => {
    if (onUpdate) onUpdate();  // ✅ just trigger fetchProjects
    onClose();                 // ✅ close dialog
  }, 1000);
}


      else {
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
    width: '270px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
  };
  console.log('adaksmkamsk');
  console.log(formData);
  console.log(adminOptions);
  return (<>
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          width: '650px',
          height: '793px',
          borderRadius: '10px',
        },
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
          ml: -1,
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
                sx={{ width: '270px', height: '40px' }}
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
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 20, mr: 8 }}>
          <Button
            variant="contained"
            onClick={handleEditSubmit}
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
    </Dialog><Portal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            zIndex: 2500, // Ensure it's well above Dialog
          },
        }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Portal></>
  );
};

export default EditProject;
