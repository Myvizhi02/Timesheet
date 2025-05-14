import CloseIcon from '@mui/icons-material/Close';
import {
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
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
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

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoadingAdmins(true);
      try {
        const res = await fetch('http://localhost:3030/api/admins');
        const data = await res.json();
        setAdminOptions(data);
      } catch (err) {
        setSnackbar({ open: true, message: 'Failed to load admins', severity: 'error' });
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
      const response = await fetch('http://localhost:3030/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (response.ok) {
        setSnackbar({ open: true, message: '✅ Project added successfully!', severity: 'success' });
      } else {
        setSnackbar({
          open: true,
          message: `❌ Failed to add project: ${result.error || 'Unknown error'}`,
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: '❌ Something went wrong while submitting the project.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
    if (snackbar.severity === 'success') {
      onSubmit();
      onClose();
    }
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
      {/* Dialog + Form JSX */}
      {/* Your full JSX remains unchanged */}
      {/* ... */}
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        sx={{ zIndex: 2000 }}
      >
        <MuiAlert elevation={6} variant="filled" severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

// Styles
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
