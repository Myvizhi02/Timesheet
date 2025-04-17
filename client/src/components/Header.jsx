import React from 'react';
import { AppBar, Toolbar, Box, Typography, Avatar, IconButton } from '@mui/material';
import homeIcon from '../home.png';
import imgIcon from '../img.png';
import navIcon from '../navigation.png';

const Header = () => {
  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: '70px',
        justifyContent: 'center',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton>
            <img src={navIcon} alt="Navigation Icon" style={{ width: '26px' }} />
          </IconButton>
          <IconButton>
            <img src={homeIcon} alt="Home Icon" style={{ width: '24px' }} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 500, color: 'black' }}>
            Dashboard
          </Typography>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 500, color: 'black' }}>
            Pradeep Shiva
          </Typography>
          <Avatar alt="User" src={imgIcon} sx={{ width: 36, height: 36 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
