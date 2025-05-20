import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import dateIcon from '../assets/date.png';
import { spacing } from '@mui/system';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      width: 250,
    },
  },
};

const getStyles = (name, personName, theme) => ({
  fontWeight:
    personName.indexOf(name) === -1
      ? theme.typography.fontWeightRegular
      : theme.typography.fontWeightMedium,
});

const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <TextField
      variant="outlined"
      onClick={onClick}
      ref={ref}
      value={value}
      placeholder={placeholder}
      InputProps={{
        readOnly: true,
        endAdornment: (
          <img
            src={dateIcon}
            alt="Date Icon"
            style={{
              width: '1.25em',
              marginLeft: '0.5em',
              padding: 10,
              cursor: 'pointer',
            }}
            onClick={onClick}
          />
        ),
      }}
      sx={{
        width: '255px',
        '& .MuiInputBase-root': {
          height: '40px',
          paddingRight: 0,
          cursor: 'pointer',
        },
        '& input': {
          cursor: 'pointer',
        },
      }}
    />
  );
});

const AddProject = ({ onClose, onSubmit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [adminOptions, setAdminOptions] = useState([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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

  const showSnackbar = (message, severity = 'success') => {
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
        const data = await response.json();
        setFormData(prev => ({ ...prev, projectId: data.project_unique_id }));
      } catch (error) {
        showSnackbar('Error fetching project ID', 'error');
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
      addPeople: typeof value === 'string' ? value.split(',') : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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

    try {
      const res = await fetch('http://localhost:3030/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      const result = await res.json();

      if (res.ok) {
        showSnackbar('✅ Project added successfully!', 'success');
        setTimeout(() => {
          if (onSubmit) onSubmit(projectData);
        }, 1000);
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        showSnackbar(`❌ Failed to add project: ${result.error || 'Unknown error'}, 'error'`);
      }
    } catch (error) {
      showSnackbar('❌ Failed to add project: Network error or server is down', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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
  const commonFieldStyle = {
    width: '255px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& input': {
      padding: '0 1em',
    },
  };

  const commonSelectStyle = {
    width: '255px',
    '& .MuiInputBase-root': {
      height: '40px',
    },
    '& input': {
      padding: '0 1em',

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
        <DialogTitle
          sx={{
            backgroundColor: '#A3EAFD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
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

        <DialogContent
          sx={{
            p: 4,
            pt: 4,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container rowSpacing={3.5} columnSpacing={3.5} columnGap={2} pt={5}>
              <Grid item xs={12} sm={6} >
                <TextField
                  name="projectId"
                  label="Project ID"
                  variant="outlined"
                  disabled
                  fullWidth
                  value={formData.projectId}
                  sx={commonFieldStyle}
                />
              </Grid>
              <Grid item xs={12} sm={6}  >
                <TextField
                  name="projectName"
                  label="Project Name"
                  variant="outlined"
                  required
                  fullWidth
                  value={formData.projectName}
                  onChange={handleChange}
                  sx={commonFieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="domain"
                  label="Domain"
                  variant="outlined"
                  required
                  fullWidth
                  value={formData.domain}
                  onChange={handleChange}
                  sx={commonFieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="lob"
                  label="LOB"
                  variant="outlined"
                  required
                  fullWidth
                  value={formData.lob}
                  onChange={handleChange}
                  sx={commonFieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Select Start Date"
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomInput placeholder="Select Start Date" />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="Select End Date"
                  dateFormat="dd/MM/yyyy"
                  customInput={<CustomInput placeholder="Select End Date" />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  selected={actualEndDate}
                  onChange={(date) => setActualEndDate(date)}
                  placeholderText="Select Actual End Date"
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
                  value={formData.budget}
                  onChange={handleChange}
                  sx={commonFieldStyle}
                />
              </Grid>

              <Grid item xs={12} pr={25}>
                <FormControl fullWidth sx={commonSelectStyle}>



                  <TextField
                    select
                    label="Add People"
                    variant="outlined"
                    fullWidth
                    value={formData.addPeople}
                    onChange={handlePeopleChange}
                    SelectProps={{
                      multiple: true,
                      MenuProps: MenuProps,
                    }}
                    sx={commonFieldStyle}
                  >
                    {loadingAdmins ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} /> &nbsp;Loading...
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
                  </TextField>

                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      backgroundColor: '#213E9A',
                      color: 'white',
                      width: isMobile ? '100%' : '100%',
                      ml: isMobile ? 9 : 18,
                      height: '42px',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: '8px',
                      '&:hover': {
                        backgroundColor: '#213E9A',
                      },
                    }}
                  >
                    {isSubmitting ? 'Submit' : 'Submit'}
                  </Button>
                </Box>

              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Dialog>

         <Portal>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ '& .MuiSnackbarContent-root': { zIndex: 2500 } }}
        >
          <Alert
            onClose={handleSnackbarClose}
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

export default AddProject;
