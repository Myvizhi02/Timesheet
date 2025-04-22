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
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import addIcon from '../add.png';
import dateIcon from '../date.png';
import foldereyeIcon from '../foldereye.png';
import selectionIcon from '../selection.png';
import shareIcon from '../share.png';
import visibilityIcon from '../visibility.png';
import visibility2Icon from '../visibility2.png';
import AddSpenttime from './AddSpenttime';
import View from './View';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showSpentModal, setShowSpentModal] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [project, setProject] = useState('');

  const employees = {
      all: [
          { id: 1, name: 'Employee 1', project: 'Bridge - Application', task: 'Offer Addition', subtask: 'Edit Page of User Details', date: '21-02-25', hours: '5hrs' },
          { id: 2, name: 'Employee 2', project: 'Bridge - Application', task: 'Follow Up time slot', subtask: 'Edit Page of User Details', date: '21-02-25', hours: '5hrs' }
      ],
      emp1: [{ id: 1, name: 'Employee 1', project: 'Bridge - Application', task: 'Offer Addition', subtask: 'Edit Page of User Details', date: '21-02-25', hours: '5hrs' }],
      emp2: [{ id: 2, name: 'Employee 2', project: 'Bridge - Application', task: 'Follow Up time slot', subtask: 'Edit Page of User Details', date: '21-02-25', hours: '5hrs' }]
  };

  const handleViewClick = (task) => {
      setSelectedTask(task);
      setShowModal(true);
  };

  const closeModal = () => setShowModal(false);
  const handleOpenSpentModal = () => setShowSpentModal(true);
  const handleCloseSpentModal = () => setShowSpentModal(false);

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
              readOnly
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
          {/* Top Welcome Section */}
          <Box
              sx={{
                  margin: { xs: 2, md: 4 },
                  backgroundColor: 'white',
                  padding: { xs: 2, md: 4 },
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  borderRadius: 2,
              
              }}
          >
              <Typography variant="h5" sx={{ pl: 2 }}>
                  Welcome to Pradeep Shiva.
              </Typography>

              {/* DatePicker + Select + Buttons */}
              <Grid container size={12} spacing={3} alignItems="center">
  {/* Left Side */}
  <Grid size={{ xs: 12, md: 3 }}>
      <Box
          sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 2,
          }}
      >
          {/* Date Picker */}
          <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="6Mar - 7Mar"
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput placeholder="Select Start Date" />}
          />

          {/* Select Project */}
          <Box
              sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  backgroundColor: 'white',
                  width: 191,
                  height: 42,
                  paddingLeft: 1,
              }}
          >
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
                      outline: 'none',
                  }}
              >
                  <MenuItem value=""><em>Select Project</em></MenuItem>
                  <MenuItem value="Bridge - Application">Bridge - Application</MenuItem>
                  <MenuItem value="CRM Dashboard">CRM Dashboard</MenuItem>
                  <MenuItem value="Admin Panel">Admin Panel</MenuItem>
              </Select>
          </Box>
      </Box>
  </Grid>

  {/* Right Side - Buttons */}
  
  <Grid size={{ xs: 12, md: 8 }}>
      <Box
          sx={{
              display: 'flex',
               // flexWrap: 'wrap',
              gap: 2,
              justifyContent: { xs: 'center', md: 'flex-end' }, // <-- IMPORTANT LINE
              ml: { xs: 0, md: '90px' }, // Space between left and right side
          }}
      >
          <Button
              variant="contained"
              color="success"
              sx={{ minWidth: 150, maxWidth: 180, height: 42, textTransform:'none' }}
              startIcon={<img src={shareIcon} alt="Share" width="20" />}
          >
              Export to Excel
          </Button>

          <Button
              variant="contained"
              sx={{ bgcolor: '#213E9A', minWidth: 150, maxWidth: 180, height: 42,  textTransform:'none' }}
              startIcon={<img src={visibilityIcon} alt="View" width="20" />}
          >
              View Task
          </Button>

          <Button
              variant="contained"
              sx={{ bgcolor: '#213E9A', minWidth: 150, maxWidth: 180, height: 42, textTransform:'none' }}
              startIcon={<img src={foldereyeIcon} alt="Project" width="20" />}
          >
              View Project
          </Button>

          <Button
              variant="contained"
              sx={{ bgcolor: '#213E9A', minWidth: 150, maxWidth: 180, height: 42, textTransform:'none' }}
              startIcon={<img src={addIcon} alt="Add" width="20" />}
              onClick={handleOpenSpentModal}
          >
              Add Spent Time
          </Button>
      </Box>
  </Grid>
</Grid>


          </Box>

          {/* Tabs Section */}
          <Box sx={{ mt: 8, mx: { xs: 2, md: 6 } }}>
              {/* Tabs */}
              <Box sx={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, display: 'flex', width: { xs: '100%', md: 400 }, p: 1 }}>
                  <Button
                      onClick={() => setActiveTab('all')}
                      sx={{
                          flex: 1,
                          bgcolor: activeTab === 'all' ? '#ffffff' : '#CDCDCD80',
                          borderRadius: 2,
                          p: 1,
                      }}
                  >
                      All Executive
                  </Button>
                  <Button
                      onClick={() => setActiveTab('emp1')}
                      sx={{
                          flex: 1,
                          bgcolor: activeTab === 'emp1' ? '#ffffff' : '#CDCDCD80',
                          borderRadius: 2,
                          p: 1,
                      }}
                  >
                      Employee 1
                  </Button>
                  <Button
                      onClick={() => setActiveTab('emp2')}
                      sx={{
                          flex: 1,
                          bgcolor: activeTab === 'emp2' ? '#ffffff' : '#CDCDCD80',
                          borderRadius: 2,
                          p: 1,
                      }}
                  >
                      Employee 2
                  </Button>
              </Box>

              {/* Table */}
              <TableContainer component={Paper} sx={{ mb: 8, boxShadow: 3, borderRadius: 2 }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                          {employees[activeTab].map((emp) => (
                              <TableRow key={emp.id}>
                                  <TableCell align="center">{emp.id}</TableCell>
                                  <TableCell align="center">{emp.name}</TableCell>
                                  <TableCell align="center">{emp.project}</TableCell>
                                  <TableCell align="center">{emp.task}</TableCell>
                                  <TableCell align="center">{emp.subtask}</TableCell>
                                  <TableCell align="center">{emp.date}</TableCell>
                                  <TableCell align="center">{emp.hours}</TableCell>
                                  <TableCell align="center">
                                      <IconButton onClick={() => handleViewClick(emp)}>
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
      </>
  );
};

export default Dashboard;