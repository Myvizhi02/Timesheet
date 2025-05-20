import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';

import AddProject from './AddProject';
import EditProject from './EditProject';

import addIcon from '../assets/add.png';
import editIcon from '../assets/edit.png';

const Project = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3030/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    fetchProjects();
    setShowModal(false);
  };

  const handleUpdateProject = () => {
    fetchProjects();
    setShowEditModal(false);
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  return (
    <Box
      sx={{
        padding: { xs: '16px', sm: '30px 40px' },
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', sm: 'flex-end' },
          marginBottom: '20px',
        }}
      >
        <Button
          onClick={() => setShowModal(true)}
          sx={{
            borderRadius: '12px',
            backgroundColor: '#3D6BFA',
            color: 'white',
            width: { xs: '100%', sm: '160px' },
            height: '44px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#2c47c5',
            },
          }}
        >
          <img src={addIcon} alt="Add" width="18" />
          Create Project
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ overflowX: 'auto', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#84E7F9' }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 600 }}>SL No</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Domain</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>LOB</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Start Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>End Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography fontStyle="italic" color="text.secondary">
                    No data found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((proj, index) => (
                <TableRow key={proj.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{proj.project_name}</TableCell>
                  <TableCell align="center">{proj.department}</TableCell>
                  <TableCell align="center">{proj.lob}</TableCell>
                  <TableCell align="center">{proj.start_date}</TableCell>
                  <TableCell align="center">{proj.end_date}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      onClick={() => handleEditClick(proj)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 500,
                        padding: '6px 12px',
                        borderRadius: '4px',
                        backgroundColor: '#F9E49261',
                        borderColor: '#F9E49261',
                        color: 'black',
                      }}
                    >
                      <img src={editIcon} alt="Edit" width="16" />
                      Edit  Project
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Project Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="add-project-modal"
        aria-describedby="modal-to-add-a-new-project"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            boxShadow: 24,
          }}
        >
          <AddProject
            onClose={() => setShowModal(false)}
            onSubmit={handleCreateProject}
          />
        </Box>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        aria-labelledby="edit-project-modal"
        aria-describedby="modal-to-edit-project"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 500 },
            boxShadow: 24,
          }}
        >
          <EditProject
            project={selectedProject}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleUpdateProject}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Project;
