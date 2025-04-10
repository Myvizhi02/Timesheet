import React from 'react';
import addIcon from '../add.png';
import foldereyeIcon from '../foldereye.png';
import shareIcon from '../share.png';
import visibilityIcon from '../visibility.png';

const CenterBlock = () => {
    
    return (
        <div className="d-flex justify-content-center py-2 shadow-sm" style={{ backgroundColor: 'white', marginLeft: '50px', marginTop: '27px', marginRight: '50px', width: '1339px', height: '130px' }}>
            <h2 style={{
                marginLeft: '10px',
                marginBottom: '20px'
            }}>Welcome to Pradeep Shiva.</h2>

            <button
                style={{
                    backgroundColor: 'green',
                    color: 'white',
                    marginTop: '49px',
                    marginLeft: '698px'
                }}>
                <img src={shareIcon} alt="Share Icon"></img> Export to Excel</button>

            <button
                style={{
                    backgroundColor: '#213E9A',
                    color: 'white',
                    marginTop: '49px',
                    marginLeft: '15px'
                }}>
                <img src={visibilityIcon} alt="Visibility Icon"></img> View Task</button>

            <button
                style={{
                    backgroundColor: '#213E9A',
                    color: 'white',
                    marginTop: '49px',
                    marginLeft: '15px'
                }}>
                <img src={foldereyeIcon} alt="Foldereye Icon"></img> View Project</button>

            <button
                style={{
                    backgroundColor: '#213E9A',
                    color: 'white',
                    marginTop: '49px',
                    marginLeft: '15px',
                }}>
                <img src={addIcon} alt="Add Icon"></img> Add Spent time</button>



        </div>
    )
}

export default CenterBlock