import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dateIcon from '../date.png';

const AddProject = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        projectId: '',
        projectName: '',
        domain: '',
        lob: '',
        startDate: '',
        endDate: '',
        budget: '',
        people: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };
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
                width: '275px',
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
                    width: '275px',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    color: value ? '#000' : '#888',
                }}
            />
            <img src={dateIcon} alt="Date Icon" style={{ width: '20px', marginLeft: '8px' }} />
        </div>));

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
                width: '603px',
                height: '562px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                position: 'relative',
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
            }}>
                {/* Header */}
                <div style={{
                    backgroundColor: '#A3EAFD',
                    padding: '10px 20px',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px'
                }}>
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>Add Project</span>
                    <button onClick={onClose} style={{
                        fontSize: '18px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                    }}>✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}><div>
                    <div style={{
                        padding: '20px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        marginBottom: '20px'
                    }}>
                        <input name="projectId" placeholder="Project ID" onChange={handleChange} required style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }} />
                        <input name="projectName" placeholder="Project Name" onChange={handleChange} required style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }} />
                        <input name="domain" placeholder="Domain" onChange={handleChange} required style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }} />
                        <input name="lob" placeholder="LOB" onChange={handleChange} required style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }} />
                        <div>

                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                placeholderText="Start Date"
                                dateFormat="dd/MM/yyyy"
                                customInput={<CustomInput placeholder="Select Start Date" />}
                            />

                        </div>


                        <div>

                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholderText="End Date"
                                dateFormat="dd/MM/yyyy"
                                customInput={<CustomInput placeholder="Select End Date" />}
                            />

                        </div>
                        <div >
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholderText="End Date"
                                dateFormat="dd/MM/yyyy"
                                customInput={<CustomInput placeholder="Select End Date" />}
                            />
                        </div>

                        <input name="budget" placeholder="Budget" onChange={handleChange} style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }} />
                        <input name="people" placeholder="Add People" onChange={handleChange} style={{
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid #ccc',
                            fontSize: '14px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }} />
                    </div> </div>

                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <button type="submit" style={{
                            backgroundColor: '#3D6BFA',
                            color: '#fff',
                            padding: '10px 30px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProject;
