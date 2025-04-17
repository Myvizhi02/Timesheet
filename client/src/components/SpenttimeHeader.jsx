import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Home as HomeIcon, ArrowForward as ArrowIcon, Menu as NavIcon } from '@mui/icons-material';
import imgIcon from '../img.png';

const SpenttimeHeader = () => {
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
      {/* Left Side: Navigation, Home, Arrow, Spenttime */}
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

      {/* Right Side: Name and Profile Image */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>Pradeep Shiva</Typography>
        <img src={imgIcon} alt="User Icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
      </Box>
    </Box>
  );
};

export default SpenttimeHeader;
