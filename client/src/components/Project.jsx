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
} from '@mui/material';
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


  const fetchProjects = async () => {
    console.log("Fetch project")
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

  // Called when AddProject form submits new project data
  const handleCreateProject = async (data) => {
    try {
      // await axios.post('http://localhost:3030/api/projects', data);
      fetchProjects();  // refresh project list after adding
      setShowModal(false); // close modal
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };


  // Called when EditProject form submits updated project data
  const handleUpdateProject = () => {
    fetchProjects();             // ✅ refresh projects
    setShowEditModal(false);    // ✅ close modal
  };


  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  return (
    <>
      <Box sx={{ padding: '30px 40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <Button
            onClick={() => setShowModal(true)}
            sx={{
              borderRadius: '12px',
              backgroundColor: '#3D6BFA',
              color: 'white',
              width: '160px',
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

        <TableContainer component={Paper} sx={{ boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#84E7F9' }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  SL No
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Name of Project
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Domain
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  LOB
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Start Date
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  End Date
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ fontStyle: 'italic', color: '#888' }}>
                    No data found
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
                        Edit Project
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
              backgroundColor: 'white',
              borderRadius: 2,
              padding: 3,
              width: 400,
              boxShadow: 24,
            }}
          >
            {showModal && (
              <AddProject
                onClose={() => setShowModal(false)}
                onSubmit={handleCreateProject}  // <-- important!
              />
            )}

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
              backgroundColor: 'white',
              borderRadius: 2,
              padding: 3,
              width: 500,
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
    </>
  );
};

export default Project;