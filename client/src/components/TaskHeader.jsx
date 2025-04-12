import React from 'react';
import arrowIcon from '../arrow.png';
import homeIcon from '../home.png';
import imgIcon from '../img.png';
import navIcon from '../navigation.png';

const TaskHeader = () => {
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
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img src={navIcon} alt="Navigation Icon" width={26} height={26} />
        <img src={homeIcon} alt="Home Icon" width={24} height={24} />
        <img src={arrowIcon} alt="Arrow Icon" width={26} height={26} />
        <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>Task</span>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 500 }}>Pradeep Shiva</span>
        <img
          src={imgIcon}
          alt="User Profile"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  );
};

export default TaskHeader;