import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Portal,
  Select,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateIcon from '../assets/date.png';

const AddProject = ({ onClose, onSubmit }) => {
  const theme = useTheme();
  const [adminOptions, setAdminOptions] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    lob: '',
    budget: '',
    domain: '',
    addPeople: [],
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [actualEndDate, setActualEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = (message, severity = 'success') => {
    console.log('Showing snackbar:', message, severity);
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoadingAdmins(true);
      try {
        const res = await fetch('http://localhost:3030/api/admins');
        const data = await res.json();
        setAdminOptions(data);
      } catch (err) {
        showSnackbar('Failed to load admins', 'error');
      } finally {
        setLoadingAdmins(false);
      }
    };

    const fetchProjectId = async () => {
      try {
        const response = await fetch('http://localhost:3030/api/projects/new-id');
        if (!response.ok) throw new Error('Failed to fetch project ID');
        const data = await response.json();
        setFormData(prev => ({ ...prev, projectId: data.project_unique_id }));
      } catch (error) {
        console.error('Error fetching project ID:', error);
      }
    };

    fetchAdmins();
    fetchProjectId();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePeopleChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      addPeople: typeof value === 'string' ? value.split(',').map(item => item.trim()) : value,
    });
  };


  const handleSubmit = async (e) => {
    console.log("submitted")
    e.preventDefault();
    //setIsSubmitting(true);

    const nameToIdMap = {};
    adminOptions.forEach(admin => {
      nameToIdMap[admin.name] = admin.crm_log_id;
    });

    const crmIds = formData.addPeople.map(person =>
      nameToIdMap[person] ? nameToIdMap[person] : person
    );

    const projectData = {
      project_unique_id: formData.projectId,
      project_name: formData.projectName,
      lob: formData.lob,
      start_date: startDate,
      end_date: endDate,
      expected_date: actualEndDate,
      budget: formData.budget,
      created_by: crmIds[0],
      modified_by: crmIds[0],
      created_date: new Date().toISOString(),
      modified_date: new Date().toISOString(),
      is_active: 1,
      department: formData.domain,
      allocated_executives: crmIds,
    };
    console.log(projectData)

<<<<<<< HEAD
    fetch('http://localhost:3030/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    })
      .then(response => {
        console.log('1'); // This will now run
        return response.json().then(result => {
          if (response.ok) {
            console.log('IF');
            setSnackbar({
              open: true,
              message: '✅ Project added successfully!',
              severity: 'success',
            });
          } else {
            console.log('ELSE');
            setSnackbar({
              open: true,
              message: `❌ Failed to add project: ${result.error || 'Unknown error'}`,
              severity: 'error',
            });
          }
        });
      })
      .catch(error => {
        console.log('error');
=======
    try {
<<<<<<< HEAD
      console.log("Handle submit")
      const res = await fetch('http://localhost:3030/api/projects', {
=======
      const response = await fetch('http://localhost:3030/api/projects', {
>>>>>>> 44cde0cba9295cc83e824c2b3d5c52446092f120
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      console.log(res)
      if (res.ok) {
  showSnackbar('✅ Project added successfully!', 'success');
  setTimeout(() => {
    if (onSubmit) onSubmit(projectData);
  }, 1000);

<<<<<<< HEAD
  // Delay close until snackbar is dismissed (4s)
  setTimeout(() => {
    onClose();
  }, 3000); // match or exceed Snackbar's autoHideDuration
}
else {
        const result = await res.json();
        showSnackbar(`❌ Failed to add project: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showSnackbar('❌ Failed to add project: Network error or server is down', 'error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
=======
      const result = await response.json();

      if (response.ok) {
        setSnackbar({ open: true, message: '✅ Project added successfully!', severity: 'success' });
      } else {
>>>>>>> a5a2437c1611c44c14c1130edcda03ff489d65dd
        setSnackbar({
          open: true,
          message: '❌ Something went wrong while submitting the project.',
          severity: 'error',
        });
      })
      .finally(() => {
        console.log('finally');
        setIsSubmitting(false);
      });

  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });

    // Only refresh and close if it was a success
    if (snackbar.severity === 'success') {
      onSubmit();
      onClose();
>>>>>>> 44cde0cba9295cc83e824c2b3d5c52446092f120
    }
  };
//console.log(snackbar)

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      },
    },
  };

  const getStyles = (name, selected, theme) => ({
    fontWeight: selected.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  });

  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <Box
      onClick={onClick}
      ref={ref}
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        width: '250px',
        height: '40px',
        cursor: 'pointer',
        paddingLeft: '10px',
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
          color: value ? '#000' : '#888',
        }}
      />
      <img src={dateIcon} alt="Date Icon" style={{ width: '1.25em', marginLeft: '0.5em', padding: 8 }} />
    </Box>
  ));

  return (
    <>
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> a5a2437c1611c44c14c1130edcda03ff489d65dd
      <Dialog
        open
        onClose={onClose}
        fullWidth={false}
        PaperProps={{
          sx: {
            width: '37.625rem',
            height: '37.5rem',
            position: 'absolute',
            top: 'calc(50% + 35px)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1300,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#A3EAFD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '3rem',
            px: 3,
            py: 0,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Add Project
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ padding: '1.5em', mt: 4 }}>
<<<<<<< HEAD
  <form>
    <Grid container spacing={3.5}>
      {/* Project ID */}
      <Grid item xs={12} sm={8}>
        <TextField
          name="projectId"
          label="Project ID"
          variant="outlined"
          fullWidth
          value={formData.projectId || ''}
          disabled // corrected "disable" to "disabled"
          sx={{
            ...inputStyle,
            '& .MuiInputLabel-root': {
              fontSize: '1.2rem',
            },
            '& .MuiInputBase-root': {
              fontSize: '1.rem',
              paddingTop: '1.rem', // adjust padding for label space
            },
          }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>

      {/* Project Name */}
      <Grid item xs={12} sm={6}>
        <TextField
  label="Project Name"
  name="projectName"
  variant="outlined"
  fullWidth
  required
  value={formData.projectName}
  onChange={handleChange}
  InputLabelProps={{ shrink: true }}
  sx={{
            ...inputStyle,
            '& .MuiInputLabel-root': {
              fontSize: '1.2rem',
            },
            '& .MuiInputBase-root': {
              fontSize: '1.rem',
            
             
            },
          }}
  
/>
</Grid>
    
  


=======
          <form>
            <Grid container spacing={3.5}>
              <Grid item xs={12} sm={8}>
                <TextField
                  name="projectId"
                  label="Project ID"
                  variant="outlined"
                  fullWidth
                  value={formData.projectId || ''}
                  disabled
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="projectName"
                  label="Project Name"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  value={formData.projectName}
                  required
                  sx={inputStyle}
                />
              </Grid>
>>>>>>> a5a2437c1611c44c14c1130edcda03ff489d65dd
              <Grid item xs={12} sm={6}>
                <TextField
                  name="domain"
                  label="Domain"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  value={formData.domain}
                  required
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="lob"
                  label="LOB"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  value={formData.lob}
                  required
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomInput placeholder="Select Start Date" />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="End Date"
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomInput placeholder="Select End Date" />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  selected={actualEndDate}
                  onChange={(date) => setActualEndDate(date)}
                  placeholderText="Actual End Date"
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomInput placeholder="Select Actual End Date" />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="budget"
                  label="Budget"
                  variant="outlined"
                  fullWidth
                  onChange={handleChange}
                  value={formData.budget}
                  sx={inputStyle}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={selectStyle}>
                  <InputLabel id="select-multiple-label">Add People</InputLabel>
                  <Select
                    labelId="select-multiple-label"
                    multiple
                    value={formData.addPeople}
                    onChange={handlePeopleChange}
                    input={<OutlinedInput label="Add People" />}
                    MenuProps={MenuProps}
                  >
                    {loadingAdmins ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} />
                        &nbsp;Loading...
                      </MenuItem>
                    ) : (
                      adminOptions.map((admin) => (
                        <MenuItem
                          key={admin.crm_log_id}
                          value={admin.name}
                          style={getStyles(admin.name, formData.addPeople, theme)}
                        >
                          {admin.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box textAlign="center" mt={4}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#213E9A',
                  color: 'white',
                  width: '20%',
                  height: '42px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#213E9A',
                  },
                }}
              >Submit
                {/* {isSubmitting ? 'Submitting...' : 'Submit'} */}
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
<<<<<<< HEAD

=======
<Portal>
=======
      {/* Dialog + Form JSX */}
      {/* Your full JSX remains unchanged */}
      {/* ... */}
      {/* Snackbar */}
>>>>>>> 44cde0cba9295cc83e824c2b3d5c52446092f120
>>>>>>> a5a2437c1611c44c14c1130edcda03ff489d65dd
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
</Portal>
    </>
  );
};

const inputStyle = {
  width: '260px',
  '& .MuiInputBase-root': {
    height: '40px',
  },
  '& input': {
    height: '40px',
    padding: '0 1em',
  },
};

const selectStyle = {
  width: '260px',
  '& .MuiInputBase-root': {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
  },
};

export default AddProject;