import React from 'react'
import addIcon from '../add.png';

const Project = () => {
  return (
    <div>
      <button>
      <img src={addIcon} alt="Add Icon" style={{ width: '20px', marginRight: '8px' }}> </img>
       Create Project</button>
      
       <select style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }}></select>
    </div>
  )
}

export default Project