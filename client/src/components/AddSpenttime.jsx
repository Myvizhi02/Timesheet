import React, { useState } from 'react';
import dateIcon from "../date.png";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Spenttime = ({ onClose }) => {
  const [subTasks, setSubTasks] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const CustomInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#fff',
        width: '245px',
        height: '42px',
        cursor: 'pointer'
      }}
    >
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        readOnly
        style={{
          border: 'none',
          outline: 'none',
          width: '245px',
          backgroundColor: 'transparent',
          fontSize: '14px',
          color: value ? '#000' : '#888',
        }}
      />
      <img src={dateIcon} alt="Date Icon" style={{ width: '20px', marginLeft: '8px' }} />
    </div>
  ));

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999
    }}>
      <div style={{
        width: '550px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#A3EAFD',
          padding: '12px 20px',
        }}>
          <span style={{ fontWeight: '600', fontSize: '16px' }}>Add Spent Time</span>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}>✕</button>
        </div>

        {/* Form Fields */}
        <div style={{
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Project and Task */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="text" placeholder="Select Project" style={inputStyle} />
            <input type="text" placeholder="Select Task" style={inputStyle} />
          </div>

          {/* Subtask and Button */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Select SubTask"
              style={{
                ...inputStyle,
                flex: 1,
                backgroundColor: subTasks.length > 0 ? '#f8d7da' : 'white' // red if subtasks exist
              }}
            />
            <button
              style={{
                height: '42px',
                padding: '0 16px',
                backgroundColor: '#3D6BFA',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
              onClick={() => setSubTasks([...subTasks, ""])}
            >
              Add Sub Task
            </button>
          </div>

          {/* Dynamic SubTask Inputs */}
          {subTasks.map((_, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder={`Enter Sub Task ${index + 1}`}
                style={{
                  ...inputStyle,
                  width: '100%',
                }}
              />
            </div>
          ))}

          {/* Start & End Date */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select Start Date"
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput placeholder="Select Start Date" />}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select End Date"
              dateFormat="dd/MM/yyyy"
              customInput={<CustomInput placeholder="Select End Date" />}
            />
          </div>

          {/* Comments */}
          <textarea
            placeholder="Enter comments"
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginBottom: '25px'
            }}
          />

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button style={{
              backgroundColor: '#3D6BFA',
              color: '#fff',
              padding: '10px 40px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  flex: 1,
  padding: '10px 12px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  height: '42px'
};

export default Spenttime;
