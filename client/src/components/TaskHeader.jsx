import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Avatar,
  IconButton
} from '@mui/material';

import arrowIcon from '../arrow.png';
import homeIcon from '../home.png';
import imgIcon from '../img.png';
import navIcon from '../navigation.png';

const TaskHeader = () => {
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
        {/* Left Side: Navigation, Home, Arrow, Task */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img src={navIcon} alt="Navigation Icon" width={26} height={26} />
          <img src={homeIcon} alt="Home Icon" width={24} height={24} />
          <img src={arrowIcon} alt="Arrow Icon" width={26} height={26} />
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.2rem', color: '#000' }}>
            Task
          </Typography>
        </Box>

        {/* Right Side: User's Name and Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.2rem', color: '#000' }}>
            Pradeep Shiva
          </Typography>
          <IconButton>
            <Avatar
              alt="User Profile"
              src={imgIcon}
              sx={{ width: 36, height: 36 }}
            />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TaskHeader;
