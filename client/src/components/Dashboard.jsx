import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import addIcon from '../assets/add.png';
import dateIcon from '../assets/date.png';
import foldereyeIcon from '../assets/foldereye.png';
import selectionIcon from '../assets/selection.png';
import shareIcon from '../assets/share.png';
import visibilityIcon from '../assets/visibility.png';
import visibility2Icon from '../assets/visibility2.png';
import AddSpenttime from './AddSpenttime';
import Project from './Project';
import View from './View';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showSpentModal, setShowSpentModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]); // State to hold the range [startDate, endDate]
  const [project, setProject] = useState(''); // Project selection state
  const [employees, setEmployees] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [admins, setAdmins] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const agentName = localStorage.getItem('name') || 'Agent';
  const [projects, setProjects] = useState([]);
  const [spentTimeDetails, setSpentTimeDetails] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3030/api/admins')
      .then((response) => setAdmins(response.data))
      .catch((error) => console.error('Error fetching admins:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3030/api/tasks')
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error('Error fetching task data:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3030/api/projects')
      .then((response) => setProjects(response.data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  const fetchSpentTimeDetails = () => {
    axios.get('http://localhost:3030/api/spent-time-details')
      .then((response) => setSpentTimeDetails(response.data))
      .catch((error) => {
        console.error('Error fetching spent-time-details:', error);
        alert(`Error: ${error.response?.data?.details || 'An unknown error occurred'}`);
      });
  };

  useEffect(() => {
    fetchSpentTimeDetails();
  }, []);

  useEffect(() => {
    // Only fetch if both start and end dates are selected
    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toISOString().split('T')[0]; // Format to yyyy-mm-dd
      const endDate = dateRange[1].toISOString().split('T')[0]; // Format to yyyy-mm-dd

      axios
        .get('http://localhost:3030/api/spent-time-details', {
          params: { startDate, endDate },
        })
        .then((response) => setSpentTimeDetails(response.data))
        .catch((error) => {
          console.error('Error fetching spent-time-details:', error);
          alert(`Error: ${error.response?.data?.details || 'An unknown error occurred'}`);
        });
    }
  }, [dateRange]); // Trigger data fetch when the date range changes

  const handleViewClick = (task) => {
    setSelectedTask(task);
    setShowSpentModal(true); // You can show the details in a modal or however you'd like
  };

  const handleOpenSpentModal = () => setShowSpentModal(true);
  const handleCloseSpentModal = () => {
    setShowSpentModal(false);
    fetchSpentTimeDetails();
  };

  const handleViewProjectPage = () => navigate('/project');
  const handleViewTaskPage = () => navigate('/task');

  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <Box
      onClick={onClick}
      ref={ref}
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '1px 12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        width: '191px',
        height: '42px',
        cursor: 'pointer',
      }}
    >
      <img src={dateIcon} alt="Date Icon" style={{ width: 20, marginRight: 8 }} />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        disabled
        style={{
          border: 'none',
          outline: 'none',
          width: '100%',
          backgroundColor: 'transparent',
          fontSize: 14,
          color: value ? '#000' : '#888',
        }}
      />
    </Box>
  ));

  return (
    <>
      <Box sx={{ margin: 4, backgroundColor: 'white', padding: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ pl: 2, pb: 4 }}>
          Welcome to {agentName}.
        </Typography>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <DatePicker
                selectsRange
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={(update) => setDateRange(update)}
                placeholderText="dd/mm/yyyy"
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput placeholder="Select Date Range" />}
                isClearable={true}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                displayEmpty
                fullWidth
                sx={{ height: 42, width: '240px'}}
              >
                <MenuItem value="">
                  <em>Select Project</em>
                </MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.project_name}>
                    {project.project_name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-end' }, ml: { xs: 0, md: '90px' } }}>
              <Button variant="contained" color="success" sx={{ minWidth: 150, height: 42, textTransform: 'none' }} startIcon={<img src={shareIcon} alt="Share" width="20" />}>
                Export to Excel
              </Button>
              <Button variant="contained" sx={{ bgcolor: '#213E9A', minWidth: 150, height: 42, textTransform: 'none' }} startIcon={<img src={visibilityIcon} alt="View" width="20" />} onClick={handleViewTaskPage}>
                View Task
              </Button>
              <Button variant="contained" sx={{ bgcolor: '#213E9A', minWidth: 150, height: 42, textTransform: 'none' }} startIcon={<img src={foldereyeIcon} alt="Project" width="20" />} onClick={handleViewProjectPage}>
                View Project
              </Button>
              <Button
                variant="contained"
                startIcon={<img src={addIcon} alt="Add" width="20" />}
                onClick={handleOpenSpentModal}
                sx={{ bgcolor: '#213E9A', minWidth: 150, height: 42, textTransform: 'none' }}
              >
                Add Spent Time
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mt: 8, mx: { xs: 2, md: 6 } }}>
        <Box sx={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, display: 'flex', width: { xs: '100%', md: '99%' }, p: 1 }}>
          <Button onClick={() => setActiveTab('all')} sx={{ flex: 1, bgcolor: activeTab === 'all' ? '#ffffff' : '#CDCDCD80', borderRadius: 2, p: 1 }}>
            All Executive
          </Button>
          {admins.map((admin, idx) => (
            <Button key={admin.admin_id || idx} onClick={() => setActiveTab(admin.name)} sx={{ flex: 1, bgcolor: activeTab === admin.name ? '#ffffff' : '#CDCDCD80', borderRadius: 2, p: 1, textTransform: 'none' }}>
              {admin.name}
            </Button>
          ))}
        </Box>

        <TableContainer component={Paper} sx={{ mb: 8, boxShadow: 3, borderRadius: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#84E7F9' }}>
                <TableCell align="center">SL.no</TableCell>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Project</TableCell>
                <TableCell align="center">Task</TableCell>
                <TableCell align="center">Sub-Task</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Worked-Hrs</TableCell>
                <TableCell align="center">View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {spentTimeDetails
    .filter(detail => {
      const matchesAdmin = activeTab === 'all' || detail.name === activeTab;
      const matchesDate = (!dateRange[0] || new Date(detail.start_date).toDateString() >= new Date(dateRange[0]).toDateString()) && 
                          (!dateRange[1] || new Date(detail.start_date).toDateString() <= new Date(dateRange[1]).toDateString());
      const matchesProject = !project || detail.project_name === project;
      return matchesAdmin && matchesDate && matchesProject;
    })
    .map((detail, index) => (
      <TableRow key={detail.id || index}>
        <TableCell align="center">{index + 1}</TableCell>
        <TableCell>{detail.name}</TableCell>
        <TableCell>{detail.project_name}</TableCell>
        <TableCell>{detail.task_name}</TableCell>
        <TableCell>{detail.subtask_name}</TableCell>
        <TableCell>{new Date(detail.start_date).toLocaleDateString()}</TableCell>
        <TableCell>{detail.hours}</TableCell>
        <TableCell align="center">
          <IconButton onClick={() => handleViewClick(detail.id)}>
            <img src={visibility2Icon} width="25" alt="View" />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}
  {/* Show "No data found" message when no rows match the filters */}
  {spentTimeDetails.filter(detail => {
    const matchesAdmin = activeTab === 'all' || detail.name === activeTab;
    const matchesDate = (!dateRange[0] || new Date(detail.start_date).toDateString() >= new Date(dateRange[0]).toDateString()) && 
                        (!dateRange[1] || new Date(detail.start_date).toDateString() <= new Date(dateRange[1]).toDateString());
    const matchesProject = !project || detail.project_name === project;
    return matchesAdmin && matchesDate && matchesProject;
  }).length === 0 && (
    <TableRow>
      <TableCell colSpan={8} align="center">
        No data found
      </TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </TableContainer>
      </Box>

      <AddSpenttime open={showSpentModal} onClose={handleCloseSpentModal} />
    </>
  );
};

export default Dashboard;
