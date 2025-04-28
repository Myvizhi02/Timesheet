import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Home as HomeIcon, ArrowForward as ArrowIcon, Menu as NavIcon } from '@mui/icons-material';
import DimgIcon from '../Dimg.png';
import axios from 'axios';

const ProjectHeader = () => {
  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');
  
    useEffect(() => {
      const fetchAgentName = async () => {
        try {
          const agentId = localStorage.getItem('agentId'); // Get agentId from localStorage
          if (agentId) {
            const response = await axios.get(`http://localhost:3030/api/agents/${agentId}`);
            setAgentName(response.data.name); // ✅ Update UI immediately
          localStorage.setItem('name', response.data.name);
          }
        } catch (error) {
          console.error('Error fetching agent name:', error);
        }
      };
  
      fetchAgentName();
    }, []);
  
  return (
    <Box
      sx={{
        backgroundColor: 'white',
        width: '100%',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Left Side: Navigation, Home, Arrow, Project */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton>
                  <NavIcon sx={{ width: 26 }} />
                </IconButton>
                <IconButton>
                  <HomeIcon sx={{ width: 24 }} />
                </IconButton>
                <IconButton>
                  <ArrowIcon sx={{ width: 26 }} />
                </IconButton>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>Project</Typography>
      </Box>

      {/* Right Side: Name and Profile Image */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}> {agentName}</Typography>
        <img src={DimgIcon} alt="User Icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
      </Box>
    </Box>
  );
};

export default ProjectHeader;
