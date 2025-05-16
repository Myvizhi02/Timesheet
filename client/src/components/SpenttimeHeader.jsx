import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { Menu, MenuItem } from '@mui/material';
import {
  Box, Avatar,
  Typography,
  IconButton
} from '@mui/material';

import arrowIcon from '../assets/arrow.png';
import DimgIcon from '../assets/Dimg.png';
import home_Icon from '../assets/home_.png';
import navIcon from '../assets/navigation.png';

const SpenttimeHeader = () => {
  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');
   const navigate = useNavigate(); 
   const [anchorEl, setAnchorEl] = useState(null);
  
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
       <img src={navIcon} alt="Navigation Icon" width={26} height={26} />
                         <img src={home_Icon} alt="Home Icon" width={24} height={24} />
                         <img src={arrowIcon} alt="Arrow Icon" width={26} height={26} />
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>Spent Time</Typography>
      </Box>

      {/* Right Section: Agent Name and Profile Image */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>{agentName}</Typography>
         <IconButton>
            <Avatar alt="User Profile" src={DimgIcon} sx={{ width: 36, height: 36 }} style={{ cursor: 'pointer' }}
    onClick={handleNavClick}/><Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleMenuClose}
  >
    <MenuItem onClick={handleLogout} sx={{ color: 'black', mt:2 }}>
       Logout</MenuItem>
  </Menu>
          </IconButton>
      </Box>
    </Box>
  );
};

export default SpenttimeHeader;
