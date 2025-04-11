import React from 'react';
import arrowIcon from '../arrow.png';
import homeIcon from '../home.png';
import imgIcon from '../img.png';
import navIcon from '../navigation.png';


const SpenttimeHeader = () => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        width: '100%',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Left Side: Navigation, Home, Arrow, Spenttime */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={navIcon} alt="Navigation Icon" style={{ width: '26px' }} />
        <img src={homeIcon} alt="Home Icon" style={{ width: '24px' }} />
        <img src={arrowIcon} alt="Arrow Icon" style={{ width: '26px' }} />
        <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>Spent Time</span>
      </div>

      {/* Right Side: Name and Profile Image */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>Pradeep Shiva</span>
        <img src={imgIcon} alt="User Icon" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
      </div>
    </div>
  );
};

export default SpenttimeHeader;
