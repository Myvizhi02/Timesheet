import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DimgIcon from '../assets/Dimg.png';
import homeIcon from '../assets/home.png';
import navIcon from '../assets/navigation.png';
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');
   const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate(); 
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
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: { xs: '60px', sm: '70px' },
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* Left Side: Navigation + Home */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3} }}>
          <IconButton sx={{ p: 0 }}>
            <img
              src={navIcon}
              alt="Navigation"
              style={{
                width: '22px',
                height: '22px',
                objectFit: 'contain',
              }}
            />
          </IconButton>
          <IconButton sx={{ p: 0 }}>
            <img
              src={homeIcon}
              alt="Home"
              style={{
                width: '20px',
                height: '20px',
                objectFit: 'contain',
              }}
            />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '16px', sm: '18px' },
              color: 'black',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Dashboard
          </Typography>
        </Box>

        {/* Right Side: Agent Name + Profile Image */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '14px', sm: '16px' },
              color: 'black',
              display: { xs: 'none', sm: 'block' },
            }}
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

export default Header;
