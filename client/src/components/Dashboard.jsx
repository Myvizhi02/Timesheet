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
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import addIcon from '../assets/add.png';
import dateIcon from '../assets/date.png';
import foldereyeIcon from '../assets/foldereye.png';
import shareIcon from '../assets/share.png';
import visibilityIcon from '../assets/visibility.png';
import visibility2Icon from '../assets/visibility2.png';
import AddSpenttime from './AddSpenttime';
import View from './View';


const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [project, setProject] = useState('');
  const [employees, setEmployees] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [admins, setAdmins] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [spentTimeDetails, setSpentTimeDetails] = useState([]);
  const [executiveProjects, setExecutiveProjects] = useState([]);

  const agentName = localStorage.getItem('name') || 'Agent';
  const crmLogId = localStorage.getItem('crm_log_id');
  
  const empIdFromStorage = localStorage.getItem('agentId');

  const exportToExcel = async () => {
  const dataToExport = spentTimeDetails
    .filter(detail => {
      const matchesAdmin = activeTab === 'all' || detail.name === activeTab;
      const matchesDate =
        (!dateRange[0] || new Date(detail.start_date) >= new Date(dateRange[0])) &&
        (!dateRange[1] || new Date(detail.start_date) <= new Date(dateRange[1]));
      const matchesProject = !project || detail.project_name === project;
      return matchesAdmin && matchesDate && matchesProject;
    })
    .map((detail, index) => ({
      sl: index + 1,
      name: detail.name,
      project: detail.project_name,
      task: detail.task_name,
      subtask: detail.subtask_name,
      date: new Date(detail.start_date).toLocaleDateString(),
      hours: detail.hours
    }));

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Spent Time');

  // Define columns
  worksheet.columns = [
    { header: 'SL.no', key: 'sl', width: 6 },
    { header: 'Name', key: 'name', width: 18 },
    { header: 'Project', key: 'project', width: 25 },
    { header: 'Task', key: 'task', width: 25 },
    { header: 'Sub-Task', key: 'subtask', width: 25 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Worked-Hrs', key: 'hours', width: 12 },
  ];

  // Add data rows
  dataToExport.forEach(row => worksheet.addRow(row));

  // Style header row
  worksheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F81BD' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // Style data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    row.eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'left' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });
  });

  // Write and download the file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'SpentTimeDetails.xlsx');
};


  useEffect(() => {
    if (!crmLogId) return;
    axios.get(`http://localhost:3030/api/projects/by-executive/${crmLogId}`)
      .then(response => setExecutiveProjects(response.data))
      .catch(error => console.error('Error fetching projects for executive:', error));
  }, [crmLogId]);

  useEffect(() => {
    const url = project
      ? `http://localhost:3030/api/project-admins?project=${project}`
      : `http://localhost:3030/api/project-admins`;

    axios.get(url)
      .then(response => setAdmins(response.data))
      .catch(error => console.error('Error fetching admins:', error));
  }, [project]);

  useEffect(() => {
    axios.get('http://localhost:3030/api/admins')
      .then(response => setAdmins(response.data))
      .catch(error => console.error('Error fetching admins:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3030/api/tasks')
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching task data:', error));
  }, []);

  useEffect(() => {
    axios.get('http://localhost:3030/api/projects')
      .then(response => setProjects(response.data))
      .catch(error => console.error('Error fetching projects:', error));
  }, []);

  const fetchSpentTimeDetails = () => {
    axios.get('http://localhost:3030/api/spent-time-details')
      .then(response => setSpentTimeDetails(response.data))
      .catch(error => {
        console.error('Error fetching spent-time-details:', error);
        alert(`Error: ${error.response?.data?.details || 'An unknown error occurred'}`);
      });
  };

  useEffect(() => {
    fetchSpentTimeDetails();
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toISOString().split('T')[0];
      const endDate = dateRange[1].toISOString().split('T')[0];
      axios.get('http://localhost:3030/api/spent-time-details', {
        params: { startDate, endDate },
      }).then(response => setSpentTimeDetails(response.data))
        .catch(error => {
          console.error('Error fetching spent-time-details:', error);
          alert(`Error: ${error.response?.data?.details || 'An unknown error occurred'}`);
        });
    }
  }, [dateRange]);

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    fetchSpentTimeDetails();
  };

  const handleViewClick = (taskDetail) => {


    setSelectedTask({
      project_id: taskDetail.project_id,
      task_id: taskDetail.task_id,
      name: taskDetail.name,
      empId: empIdFromStorage,

    });
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => setShowViewModal(false);
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
        borderRadius: '7px',
        backgroundColor: '#fff',
        width: '195px',
        height: '40px',
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
       <Typography
  variant="h5"
  sx={{
    pl: { xs: 1, sm: 2, md: 3 },  // padding-left changes with screen size
    pb: { xs: 2, sm: 3, md: 4 },  // padding-bottom changes with screen size
    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }, // font size changes with breakpoints
  }}
>
  Welcome to {agentName}.
</Typography>


        <Grid container spacing={3} alignItems="center">
  <Grid item xs={12} md={3}>
    <DatePicker
      selectsRange
      startDate={dateRange[0]}
      endDate={dateRange[1]}
      onChange={(update) => setDateRange(update)}
      placeholderText="dd/mm/yyyy"
      dateFormat="dd/MM/yyyy"
      customInput={<CustomInput placeholder="Select Date Range" />}
      isClearable={true}
      // style the customInput inside CustomInput component for responsiveness if needed
    />
  </Grid>

  <Grid item xs={12} md={4}>
    <Select
      value={project}
      onChange={(e) => setProject(e.target.value)}
      displayEmpty
      fullWidth
      sx={{
        height: 42,
        width: { xs: 220, sm: 230 }, // full width on xs, fixed 240px on sm and above
        minWidth: 120, // to prevent too small on very small screens
      }}
    >
      <MenuItem value="">
        <em>Select Project</em>
      </MenuItem>
      {executiveProjects.length === 0 ? (
        <MenuItem disabled>No projects assigned</MenuItem>
      ) : (
        executiveProjects.map((proj) => (
          <MenuItem key={proj.project_unique_id} value={proj.project_name}>
            {proj.project_name}
          </MenuItem>
        ))
      )}
    </Select>
  </Grid>



         <Grid item xs={12} md={5}>
  <Box
    sx={{
      display: 'flex',
      gap: 2,
      flexWrap: 'wrap', // allow buttons to wrap on smaller screens
      justifyContent: { xs: 'center', md: 'flex-end' },
      ml: { xs: 0, md: '90px' },
    }}
  >
    <Button
      variant="contained"
      color="success"
      sx={{ minWidth: 150, height: 42, textTransform: 'none' }}
      startIcon={<img src={shareIcon} alt="Share" width="14" />}
      onClick={exportToExcel}
    >
      Export to Excel
    </Button>
    <Button
      variant="contained"
      sx={{ bgcolor: '#213E9A', minWidth: 150, height: 42, textTransform: 'none' }}
      startIcon={<img src={visibilityIcon} alt="View" width="15" />}
      onClick={handleViewTaskPage}
    >
      View Task
    </Button>
    <Button
      variant="contained"
      sx={{ bgcolor: '#213E9A', minWidth: 150, height: 42, textTransform: 'none' }}
      startIcon={<img src={foldereyeIcon} alt="Project" width="15" />}
      onClick={handleViewProjectPage}
    >
      View Project
    </Button>
    <Button
      variant="contained"
      sx={{ bgcolor: '#213E9A', minWidth: 150, height: 42, textTransform: 'none' }}
      startIcon={<img src={addIcon} alt="Add" width="13" />}
      onClick={handleOpenAddModal}
    >
      Add Spent Time
    </Button>
  </Box>
</Grid>

        </Grid>
      </Box >
<Box sx={{ mt: 8, mx: { xs: 2, md: 6 } }}>
<Box sx={{ mt: 8, }}>
  <Box
    sx={{
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      display: 'flex',
      width: { xs: '100%', md: '100%' },
      flexWrap: 'wrap',
      
    }}
  >
    {/* Always show "All Executive" tab */}
    <Button
      onClick={() => setActiveTab('all')}
      sx={{
        flex: { xs: '1 1 100%', md: 1 },
        bgcolor: activeTab === 'all' ? '#ffffff' : '#CDCDCD80',
        borderRadius: 2,
        p: { xs: 1, md: 1.5 },
        fontSize: { xs: '0.85rem', md: '1rem' },
        textTransform: 'none',
      }}
    >
      All Executive
    </Button>

    {/* Conditionally render other tabs only if project is selected */}
    {project &&
      admins.map((admin, idx) => (
        <Button
          key={admin.admin_id || idx}
          onClick={() => setActiveTab(admin.name)}
          sx={{
            flex: { xs: '1 1 100%', md: 1 },
            bgcolor: activeTab === admin.name ? '#ffffff' : '#CDCDCD80',
            borderRadius: 2,
            p: { xs: 1, md: 1.5 },
            fontSize: { xs: '0.85rem', md: '1rem' },
            textTransform: 'none',
          }}
        >
          {admin.name}
        </Button>
      ))}
  </Box>
</Box>




       <TableContainer component={Paper} sx={{ mb: 8, boxShadow: 3, borderRadius: 2, overflowX: 'auto' }}>
  <Table sx={{ minWidth: 650, width: '100%' }} aria-label="spent time table">
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
        .filter((detail) => {
          const matchesAdmin = activeTab === 'all' || detail.name === activeTab;
          const matchesDate =
            (!dateRange[0] || new Date(detail.start_date) >= new Date(dateRange[0])) &&
            (!dateRange[1] || new Date(detail.start_date) <= new Date(dateRange[1]));
          const matchesProject = !project || detail.project_name === project;
          return matchesAdmin && matchesDate && matchesProject;
        })
        .map((detail, index) => (
          <TableRow key={detail.id || index}>
            <TableCell align="center" sx={{ whiteSpace: 'nowrap', fontSize: { xs: '0.75rem', md: '1rem' } }}>
              {index + 1}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>
              {detail.name}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>
              {detail.project_name}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>
              {detail.task_name}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>
              {detail.subtask_name}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>
              {new Date(detail.start_date).toLocaleDateString()}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}>
              {detail.hours}
            </TableCell>
            <TableCell align="center">
              <IconButton onClick={() => handleViewClick(detail)} size="small">
                <img src={visibility2Icon} alt="View" width={20} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      {spentTimeDetails.filter((detail) => {
        const matchesAdmin = activeTab === 'all' || detail.name === activeTab;
        const matchesDate =
          (!dateRange[0] || new Date(detail.start_date) >= new Date(dateRange[0])) &&
          (!dateRange[1] || new Date(detail.start_date) <= new Date(dateRange[1]));
        const matchesProject = !project || detail.project_name === project;
        return matchesAdmin && matchesDate && matchesProject;
      }).length === 0 && (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
            No data found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

      </Box>

      {/* <AddSpenttime open={showAddModal} onClose={handleCloseAddModal} /> */}
      <AddSpenttime
  open={showAddModal}
  onClose={handleCloseAddModal}
  onSaved={() => {
    handleCloseAddModal(); // Close the modal
    // fetchSpentTimeData(selectedDate.format('YYYY-MM-DD')); // Refresh the data
  }}
/>
      {
        selectedTask && (
          <View

            show={showViewModal}
            onClose={handleCloseViewModal}
            projectId={selectedTask.project_id}
            taskId={selectedTask.task_id}
            employee={{ name: selectedTask.name, empId: selectedTask.empId }}
          />
        )
      }
    </>
  );
};

export default Dashboard;
