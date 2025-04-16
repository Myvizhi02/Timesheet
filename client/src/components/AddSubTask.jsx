import { InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';

const AddSubTask = ({ onClose, onSubmit }) => {
  const [project, setProject] = useState('');
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);

  const handleSubmit = () => {
    const taskData = {
      project,
      taskName,
      description,
      status: status ? 'Open' : 'Closed',
    };
    onSubmit(taskData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        width: '602px',
        height: '597px',
        backgroundColor: 'white',
        borderRadius: '10px',
        position: 'relative',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#A3EAFD',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          margin: '-20px',
          marginBottom: '30px'
        }}>
          <span style={{ fontSize: '18px', fontWeight: 600 }}>Add SubTask</span>
          <button onClick={onClose} style={{
            fontSize: '18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}>✕</button>
        </div>

        {/* Input Row */}
        <div style={{ display: 'flex', gap: '60px', marginBottom: '20px' }}>
          <TextField
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                width: '247px'
              }
            }}
            label="Project"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span style={{ color: 'black' }}>Winfast</span>
                </InputAdornment>
              )
            }}
          />

          <TextField
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                width: '247px'
              }
            }}
            label="Task Name"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span style={{ color: 'black' }}>Creating Ticket</span>
                </InputAdornment>
              )
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '60px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Enter Task"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={{
              flex: 1,
              height: '40px',
              width: '247px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px',
              marginTop: '20px'
            }}
          />

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: 'fit-content',
            marginBottom: '20px',
            height: '40px',
            marginTop: '20px'
          }}>
            <TextField
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '40px',
                  width: '247px'
                }
              }}
              label="Status"
              variant="outlined"
              value={status ? 'Open' : 'Closed'}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <div
                      onClick={() => setStatus(!status)}
                      style={{
                        width: '40px',
                        height: '20px',
                        backgroundColor: status ? '#3DC1F2' : '#ccc',
                        borderRadius: '20px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        marginLeft: '28px'
                      }}
                    >
                      <div style={{
                        height: '16px',
                        width: '16px',
                        backgroundColor: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px',
                        left: status ? '20px' : '3px',
                        transition: 'left 0.3s'
                      }} />
                    </div>
                  </InputAdornment>
                )
              }}
              style={{ width: '250px', cursor: 'pointer' }}
            />
          </div>
        </div>

        <textarea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px',
            resize: 'none',
            height: '40px',
            overflow: 'hidden'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '180px' }}>
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1034A6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              minWidth: '140px'
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSubTask;
