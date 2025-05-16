import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Avatar } from '@mui/material'; // 👈 add this line

import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import arrowIcon from '../assets/arrow.png';
import DimgIcon from '../assets/Dimg.png';
import home_Icon from '../assets/home_.png';
import navIcon from '../assets/navigation.png';
import axios from 'axios';

const TaskHeader = () => {

  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');
 const [anchorEl, setAnchorEl] = useState(null);

const navigate = useNavigate(); 
   const handleHomeClick = () => {
    navigate('/dashboard'); // ✅ navigate to dashboard
  };

  const handleNavClick = (event) => {
    setAnchorEl(event.currentTarget); // open menu
  };

  const handleLogout = () => {
    // Clear localStorage or token
    localStorage.clear();
    setAnchorEl(null); // close menu
    navigate('/'); // go to login
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchAgentName = async () => {
      try {
        const agentId = localStorage.getItem('agentId');
        if (agentId) {
          const response = await axios.get(`http://localhost:3030/api/agents/${agentId}`);
          if (response.data?.name) {
            setAgentName(response.data.name);
            localStorage.setItem('name', response.data.name);
          }
        }
      } catch (error) {
        // Optional: handle error display or silent fail
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3}}>
           {/* <img src={navIcon} alt="Navigation Icon" width={26} height={26} /> */}
            <img
    src={navIcon}
    alt="Navigation Icon"
    width={26}
    height={26}
    
  />
  
                             <img
                    src={home_Icon}
                    alt="Home Icon"
                    width={24}
                    height={24}
                    style={{ cursor: 'pointer' }}
                    onClick={handleHomeClick}
                  />
          <img src={arrowIcon} alt="Arrow Icon" width={26} height={26} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, fontSize: '1.2rem', color: '#000' }}
          >
            Task
          </Typography>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, fontSize: '1.2rem', color: '#000' }}
          >
            {agentName}
          </Typography>
          <IconButton>
            <Avatar alt="User Profile" src={DimgIcon} sx={{ width: 36, height: 36 }} style={{ cursor: 'pointer' }}
    onClick={handleNavClick}/><Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleMenuClose}
  >
    <MenuItem onClick={handleLogout} sx={{ color: 'black' }}>
       Logout</MenuItem>
  </Menu>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TaskHeader;
