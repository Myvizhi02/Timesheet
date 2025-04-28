import React, { useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Paper
} from '@mui/material';
import AddProject from './AddProject';
import EditProject from './EditProject';
import addIcon from '../add.png';
import editIcon from '../edit.png';
import dateIcon from '../date.png';

const Project = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleCreateProject = (data) => {
    console.log('New Project:', data);
    // Add new project to state or send to backend
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleUpdateProject = (updatedData) => {
    console.log('Updated Project:', updatedData);
    // Update project logic here
    setShowEditModal(false);
  };

  const projects = [
    {
      id: 1,
      name: "Winfast",
      domain: "Development",
      lob: "-",
      startDate: "01/03/2025",
      endDate: "31/03/2025"
    },
    {
      id: 2,
      name: "Winfast",
      domain: "Development",
      lob: "-",
      startDate: "01/03/2025",
      endDate: "31/03/2025"
    }
  ];

  return (
    <Box sx={{ padding: '30px 40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header and Create Button */}
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
            gap: '1px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#2c47c5',
            }
          }}
        >
          <img src={addIcon} alt="Add" width="18" />
          Create Project
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#84E7F9' }}>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 600 }}>SL No</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Name of the Project</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Domain</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>LOB</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Start Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>End Date</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((proj, index) => (
              <TableRow key={proj.id} sx={{ textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                <TableCell sx={{ textAlign: 'center' }}>{index + 1}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{proj.name}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{proj.domain}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{proj.lob}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{proj.startDate}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>{proj.endDate}</TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'center' }}>
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
                      backgroundColor: "#F9E49261",
                      borderColor: "#F9E49261",
                      color: 'black'
                    }}
                  >
                    <img src={editIcon} alt="Edit" style={{ width: '16px', height: '16px' }} />
                    Edit Project
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Project Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="add-project-modal"
        aria-describedby="modal-to-add-a-new-project"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 3,
          width: 400,
          boxShadow: 24,
        }}>
          <AddProject onClose={() => setShowModal(false)} onSubmit={handleCreateProject} />
        </Box>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        aria-labelledby="edit-project-modal"
        aria-describedby="modal-to-edit-existing-project"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          borderRadius: 2,
          //padding: 3,
          width: 500,
          boxShadow: 24,
        }}>
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
