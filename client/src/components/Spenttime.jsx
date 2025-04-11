import React from 'react';
import dateIcon from "../date.png";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';


const Spenttime = ({ onClose }) => {
    const [startDate, setStartDate] = useState(null);
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
        width: '602px',
        height: '600px',
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
          padding: '10px 20px',
        }}>
          <span style={{ fontWeight: '600' }}>Add Spent Time</span>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer'
          }}>✕</button>
        </div>

        {/* Form Fields */}
        <div style={{ padding: '25px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="Select Project" style={inputStyle} />
            <input type="text" placeholder="Select Task" style={inputStyle} />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input type="text" placeholder="Select SubTask" style={{ ...inputStyle, flex: 1 }} />
            <button style={{
              padding: '6px 12px',
              backgroundColor: '#3D6BFA',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>Add Sub Task</button>
          </div>

          {/* Start & End Time with Icons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              {/* <input
                type="date"
                placeholder="Select Start Time"
               id='start date'
               name='sattt'
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  backgroundColor: 'transparent'
                }}
              /> */}
              <DatePicker
  selected={startDate}
  onChange={(date) => setStartDate(date)}
  placeholderText="Start Date"
  dateFormat="dd/MM/yyyy"
  className="custom-input"
/>
              <img src={dateIcon} alt="Date Icon" style={{ width: '20px', marginLeft: '8px' }} />
            </div>

            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              <input
                type="text"
                placeholder="Select End Time"
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  backgroundColor: 'transparent'
                }}
              />
              <img src={dateIcon} alt="Date Icon" style={{ width: '20px', marginLeft: '8px' }} />
            </div>
          </div>

          <textarea
            placeholder="Enter comments"
            rows={4}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              marginBottom: '20px'
            }}
          />

          {/* Submit Button */}
          <div style={{ textAlign: 'center', marginTop:'60px' }}>
            <button style={{
              backgroundColor: '#3D6BFA',
              color: '#fff',
              padding: '8px 30px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer'
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
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px'
};

export default Spenttime;
