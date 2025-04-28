import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';

import arrowIcon from '../arrow.png';
import DimgIcon from '../Dimg.png';
import homeIcon from '../home.png';
import navIcon from '../navigation.png';

const TaskHeader = () => {
  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');

  useEffect(() => {
    const fetchAgentName = async () => {
      try {
        const agentId = localStorage.getItem('agentId');
        if (agentId) {
          const response = await axios.get(`http://localhost:5000/api/agents/${agentId}`);
          setAgentName(response.data.name);
          localStorage.setItem('name', response.data.name);
        }
      } catch (error) {
        console.error('Error fetching agent name:', error);
      }
    };

    fetchAgentName();
  }, []);

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: '#ffffff',
        height: '70px',
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        px: 2,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src={navIcon} alt="Navigation Icon" width={26} height={26} />
          <img src={homeIcon} alt="Home Icon" width={24} height={24} />
          <img src={arrowIcon} alt="Arrow Icon" width={26} height={26} />
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.2rem', color: '#000' }}>
            Task
          </Typography>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.2rem', color: '#000' }}>
            {agentName}
          </Typography>
          <IconButton>
            <Avatar alt="User Profile" src={DimgIcon} sx={{ width: 36, height: 36 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TaskHeader;
