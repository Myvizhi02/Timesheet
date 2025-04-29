import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateIcon from '../assets/date.png';

const AddProject = ({ onClose, onSubmit }) => {
  const theme = useTheme();

  const [adminOptions, setAdminOptions] = useState([]);
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

  const [isSubmitting, setIsSubmitting] = useState(false); // NEW

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

    const fetchProjectId = async () => {
      try {
        const res = await fetch('http://localhost:3030/api/projects/new-id');
        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          projectId: data.project_unique_id,
        }));
      } catch (err) {
        console.error('Failed to fetch project ID', err);
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
    e.preventDefault();

    if (isSubmitting) return; // prevent double submission
    setIsSubmitting(true);

    const data = {
      project_name: formData.projectName,
      lob: formData.lob,
      start_date: startDate ? startDate.toISOString().split('T')[0] : null,
      end_date: endDate ? endDate.toISOString().split('T')[0] : null,
      expected_date: actualEndDate ? actualEndDate.toISOString().split('T')[0] : null,
      budget: formData.budget,
      created_by: localStorage.getItem('crm_log_id'),
      modified_by: localStorage.getItem('crm_log_id'),
      department: formData.domain,
      allocated_executives: formData.addPeople,
    };

    console.log('Submitting Data:', data);

    try {
      const response = await fetch('http://localhost:3030/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to add project');

      const result = await response.json();
      console.log(result.message);
      onSubmit(data);
      onClose();
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Failed to add project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, selected, theme) {
    return {
      fontWeight: selected.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  const CustomInput = React.forwardRef((props, ref) => {
    const { value, onClick, placeholder } = props;
    return (
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
          cursor: 'pointer',
          marginBottom: '0.5em',
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
            padding: '1em 0.4em',
          }}
        />
        <img src={dateIcon} alt="Date Icon" style={{ width: '1.25em', marginLeft: '0.5em' }} />
      </Box>
    );
  });

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ backgroundColor: '#A3EAFD', borderTopLeftRadius: '0.625em', borderTopRightRadius: '0.625em' }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0em 1em' }}>
          <Typography variant="h6" fontWeight="600">
            Add Project
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      </Box>

      <DialogContent sx={{ padding: '1.5em' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                name="domain"
                label="Domain"
                variant="outlined"
                fullWidth
                onChange={handleChange}
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
                sx={inputStyle}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="select-multiple-label">Add People</InputLabel>
                <Select
                  labelId="select-multiple-label"
                  multiple
                  value={formData.addPeople}
                  onChange={handlePeopleChange}
                  input={<OutlinedInput label="Add People" />}
                  MenuProps={MenuProps}
                  sx={{ width: '254px', height: '50px' }}
                >
                  {adminOptions.map((admin) => (
                    <MenuItem
                      key={admin.crm_log_id}
                      value={admin.crm_log_id}
                      style={getStyles(admin.crm_log_id, formData.addPeople, theme)}
                    >
                      {admin.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
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
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const inputStyle = {
  height: '60px',
  '& .MuiInputBase-root': {
    height: '80%',
  },
  '& input': {
    height: '100%',
    padding: '0 2.3em',
  },
};

export default AddProject;