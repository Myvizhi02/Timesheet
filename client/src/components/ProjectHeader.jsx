import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Assets
import arrowIcon from '../assets/arrow.png';
import DimgIcon from '../assets/Dimg.png';
import home_Icon from '../assets/home_.png';
import navIcon from '../assets/navigation.png';

const ProjectHeader = () => {
  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchAgentName = async () => {
      try {
        const agentId = localStorage.getItem('agentId');
        if (agentId) {
          const response = await axios.get(`http://localhost:3030/api/agents/${agentId}`);
          const name = response.data.name;
          setAgentName(name);
          localStorage.setItem('name', name);
        }
      } catch (error) {
        console.error('Error fetching agent name:', error);
      }
    };

    fetchAgentName();
  }, []);

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  const handleNavClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    localStorage.clear();
    setAnchorEl(null);
    navigate('/');
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        width: '100%',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '0 10px' : '0 20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        boxSizing: 'border-box',
      }}
    >
      {/* Left Section: Navigation + Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 1.5 : 3 }}>
        <img src={navIcon} alt="Navigation Icon" width={isMobile ? 22 : 26} height={isMobile ? 22 : 26} />
        <img
          src={home_Icon}
          alt="Home Icon"
          width={isMobile ? 20 : 24}
          height={isMobile ? 20 : 24}
          style={{ cursor: 'pointer' }}
          onClick={handleHomeClick}
        />
        <img src={arrowIcon} alt="Arrow Icon" width={isMobile ? 22 : 26} height={isMobile ? 22 : 26} />
        <Typography sx={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 500 }}>
          Project
        </Typography>
      </Box>

      {/* Right Section: User Info */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography sx={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 500 }}>
          {agentName}
        </Typography>

        <IconButton onClick={handleNavClick}>
          <Avatar alt="User" src={DimgIcon} sx={{ width: 36, height: 36 }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout} sx={{ color: 'black' }}>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ProjectHeader;
