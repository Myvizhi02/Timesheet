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
  const [showModal, setShowModal] = useState(false);
  const [showSpentModal, setShowSpentModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [project, setProject] = useState('');
  const [employees, setEmployees] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [admins, setAdmins] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const agentName = localStorage.getItem('name') || 'Agent';
  const [projects, setProjects] = useState([]);
  const [spentTimeDetails, setSpentTimeDetails] = useState([]);

  // Fetch admins
  useEffect(() => {
    axios.get('http://localhost:3030/api/admins')
      .then((response) => setAdmins(response.data))
      .catch((error) => console.error('Error fetching admins:', error));
  }, []);

  // Fetch tasks
  useEffect(() => {
    axios.get('http://localhost:3030/api/tasks')
      .then((response) => setEmployees(response.data))
      .catch((error) => console.error('Error fetching task data:', error));
  }, []);

  // Fetch projects
  useEffect(() => {
    axios.get('http://localhost:3030/api/projects')
      .then((response) => setProjects(response.data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, []);

  // Fetch spent time details
  useEffect(() => {
    axios.get('http://localhost:3030/api/spent-time-details')
      .then((response) => setSpentTimeDetails(response.data))
      .catch((error) => {
        console.error('Error fetching spent-time-details:', error);
        alert(`Error: ${error.response?.data?.details || 'An unknown error occurred'}`);
      });
  }, []);

  const handleViewClick = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  const handleOpenSpentModal = () => setShowSpentModal(true);
  const handleCloseSpentModal = () => setShowSpentModal(false);
  const handleOpenProjectModal = () => setShowProjectModal(true);
  const handleCloseProjectModal = () => setShowProjectModal(false);
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
      {/* Top Section */}
      <Box sx={{ margin: 4, backgroundColor: 'white', padding: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ pl: 2 }}>
          Welcome to {agentName}.
        </Typography>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="dd/mm/yyyy"
                dateFormat="dd/MM/yyyy"
                customInput={<CustomInput placeholder="Select Start Date" />}
              />

              <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: 2, backgroundColor: 'white', width: 191, height: 42, paddingLeft: 1 }}>
                <img src={selectionIcon} alt="Select Project" style={{ width: 20, marginRight: 8 }} />
                <Select
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  displayEmpty
                  variant="standard"
                  sx={{
                    width: '100%',
                    borderBottom: 'none',
                    '&::before, &::after': { display: 'none' },
                  }}
                >
                  <MenuItem value=""><em>Select Project</em></MenuItem>
                  {projects.map((proj) => (
                    <MenuItem key={proj.project_unique_id} value={proj.project_name}>
                      {proj.project_name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={8}>
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
              <Button variant="contained" sx={{ bgcolor: '#213E9A', minWidth: 150, height: 42, textTransform: 'none' }} startIcon={<img src={addIcon} alt="Add" width="20" />} onClick={handleOpenSpentModal}>
                Add Spent Time
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
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

        {/* Table */}
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
                  const matchesDate = !startDate || new Date(detail.start_date).toDateString() === new Date(startDate).toDateString();
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
                    <TableCell>
                      <IconButton>
                        <img src={visibility2Icon} alt="View" style={{ width: 24 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modals */}
      <View show={showModal} data={selectedTask} onClose={closeModal} />
      {showSpentModal && <AddSpenttime onClose={handleCloseSpentModal} />}
      {showProjectModal && <Project onClose={handleCloseProjectModal} />}
    </>
  );
};

export default Dashboard;
