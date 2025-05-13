import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  IconButton
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowForward as ArrowIcon,
  Menu as NavIcon
} from '@mui/icons-material';
import DimgIcon from '../assets/Dimg.png';

const SpenttimeHeader = () => {
  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');

  useEffect(() => {
    const fetchAgentName = async () => {
      try {
        const agentId = localStorage.getItem('agentId');
        if (agentId) {
          const response = await axios.get(`http://localhost:3030/api/agents/${agentId}`);
          setAgentName(response.data.name);
          localStorage.setItem('name', response.data.name);
        }
      } catch (error) {
        // Error is silently caught for a clean UI; you can handle this in a global error boundary if needed
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
        position: 'fixed',
        top: 0,
        zIndex: 1302,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Left Section: Navigation */}
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
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>Spent Time</Typography>
      </Box>

      {/* Right Section: Agent Name and Profile Image */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>{agentName}</Typography>
        <img
          src={DimgIcon}
          alt="User Icon"
          style={{ width: '36px', height: '36px', borderRadius: '50%' }}
        />
      </Box>
    </Box>
  );
};

export default SpenttimeHeader;
