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
        {/* Left Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
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
              display: { xs: 'none', sm: 'block' }, // Hide "Dashboard" on extra small screens
            }}
          >
            Dashboard
          </Typography>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 500,
              fontSize: { xs: '14px', sm: '16px' },
              color: 'black',
              display: { xs: 'none', sm: 'block' }, // Hide name on small mobile
            }}
          >
            Pradeep Shiva
          </Typography>
          <Avatar
            alt="User"
            src={imgIcon}
            sx={{
              width: { xs: 30, sm: 36 },
              height: { xs: 30, sm: 36 },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
