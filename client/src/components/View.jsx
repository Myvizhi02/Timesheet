import React from 'react';

const View = ({ show, onClose, data }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '602px', height: '641px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 999
    }}>
      <div style={{
        width: '500px',
        backgroundColor: 'white',
        padding: '20px',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#b2ebf2', padding: '10px', borderRadius: '5px' }}>
          <strong>{data?.name} ({data?.empId || 'K025689'})</strong>
          <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <p><strong>Task Details</strong></p>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>Start Time: <strong>{data?.startTime || '9.50 am'}</strong></div>
            <div>Start Date: <strong>{data?.startDate || '12/2/2025'}</strong></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <div>End Time: <strong>{data?.endTime || '13.00 pm'}</strong></div>
            <div>End Date: <strong>{data?.endDate || '12/2/2025'}</strong></div>
          </div>

          <p style={{ marginTop: '10px' }}>Task Status: <strong>{data?.status || 'Open'}</strong></p>
          <p>People Worked: {data?.peopleWorked || 'Employee 1(K025689), Employee 3(K0123456)'}</p>

          <div style={{ marginTop: '10px' }}>
            <label htmlFor="comments">Comments:</label>
            <textarea
              id="comments"
              style={{
                width: '100%',
                height: '100px',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}
              placeholder="Enter comments..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
