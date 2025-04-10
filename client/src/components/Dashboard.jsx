import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import addIcon from '../add.png';
import dateIcon from '../date.png';
import foldereyeIcon from '../foldereye.png';
import selectionIcon from '../selection.png';
import shareIcon from '../share.png';
import visibilityIcon from '../visibility.png';
import visibility2Icon from '../visibility2.png';
import View from './View'; // ✅ Make sure this path is correct

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const handleViewClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };
    
      
      const closeModal = () => {
        setShowModal(false);
      };
      

    const employees = {
        all: [
            {
                id: 1,
                name: 'Employee 1',
                project: 'Bridge - Application',
                task: 'Offer Addition',
                subtask: 'Edit Page of User Details',
                date: '21-02-25',
                hours: '5hrs'
            },
            {
                id: 2,
                name: 'Employee 2',
                project: 'Bridge - Application',
                task: 'Follow Up time slot',
                subtask: 'Edit Page of User Details',
                date: '21-02-25',
                hours: '5hrs'
            }
        ],
        emp1: [
            {
                id: 1,
                name: 'Employee 1',
                project: 'Bridge - Application',
                task: 'Offer Addition',
                subtask: 'Edit Page of User Details',
                date: '21-02-25',
                hours: '5hrs'
            }
        ],
        emp2: [
            {
                id: 2,
                name: 'Employee 2',
                project: 'Bridge - Application',
                task: 'Follow Up time slot',
                subtask: 'Edit Page of User Details',
                date: '21-02-25',
                hours: '5hrs'
            }
        ]
    };

    
    return (
        <>
            {/* Header */}
            <div style={{
                margin: '27px 50px 0 50px',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h2 style={{ margin: 0 }}>Welcome to Pradeep Shiva.</h2>
            </div>

            {/* Button Row */}
            <div style={{
                display: 'flex',
                gap: '10px',
                margin: '10px 50px'
            }}>

                <div style={{ width: '40%', display: 'flex', gap: '12px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        width: '200px'
                    }}>
                        <img src={dateIcon} alt="Date Icon" style={{ width: '20px', marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="6 Mar - 7 Mar"
                            style={{ border: 'none', outline: 'none', width: '100%' }}
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        width: '200px'
                    }}>
                        <img src={selectionIcon} alt="Select Project" style={{ width: '20px', marginRight: '8px' }} />
                        <select style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%' }}>
                            <option>Select Project</option>
                            <option>Bridge - Application</option>
                            <option>CRM Dashboard</option>
                            <option>Admin Panel</option>
                        </select>
                    </div>
                </div>

                <div style={{ width: '60%', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button style={{ backgroundColor: 'green', color: 'white', padding: '8px 12px', borderRadius: '6px' }}>
                        <img src={shareIcon} alt="Share Icon" style={{ marginRight: '6px' }} /> Export to Excel
                    </button>
                    <button style={{ backgroundColor: '#213E9A', color: 'white', padding: '8px 12px', borderRadius: '6px' }}>
                        <img src={visibilityIcon} alt="Visibility Icon" style={{ marginRight: '6px' }} /> View Task
                    </button>
                    <button style={{ backgroundColor: '#213E9A', color: 'white', padding: '8px 12px', borderRadius: '6px' }}>
                        <img src={foldereyeIcon} alt="Foldereye Icon" style={{ marginRight: '6px' }} /> View Project
                    </button>
                    <button style={{ backgroundColor: '#213E9A', color: 'white', padding: '8px 12px', borderRadius: '6px' }}>
                        <img src={addIcon} alt="Add Icon" style={{ marginRight: '6px' }} /> Add Spent time
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="p-4" style={{
                borderRadius: '50px',
                padding: '5px 10px',
                width: 'fit-content',
                margin: '40px auto 20px'
            }}>
                <div className="mb-3" style={{ backgroundColor: 'white', marginTop: '62px', marginLeft: '51px', width: '345px', borderRadius: '50px' }}>
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`btn me-2 ${activeTab === 'all' ? 'btn-white text-dark border' : 'btn-light'}`}
                        style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', padding: '4px 10px', marginRight: '5px' }}>
                        All Executive
                    </button>
                    <button
                        onClick={() => setActiveTab('emp1')}
                        className={`btn me-2 ${activeTab === 'emp1' ? 'btn-white text-dark border' : 'btn-light'}`}
                        style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', padding: '4px 10px', marginRight: '5px' }}>
                        Employee 1
                    </button>
                    <button
                        onClick={() => setActiveTab('emp2')}
                        className={`btn me-2 ${activeTab === 'emp2' ? 'btn-white text-dark border' : 'btn-light'}`}
                        style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px', padding: '4px 10px' }}>
                        Employee 2
                    </button>
                </div>

                {/* Table */}
                <div style={{
                    backgroundColor: 'white',
                    margin: '0 50px 62px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0px 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <table className="table table-bordered text-center" style={{ width: '1339px' }}>
                        <thead className="table-info">
                            <tr style={{ backgroundColor: '#84E7F9' }}>
                                <th>SL.no</th>
                                <th>Name</th>
                                <th>Project</th>
                                <th>Task</th>
                                <th>Sub-Task</th>
                                <th>Date</th>
                                <th>Worked-Hrs</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees[activeTab].map((emp) => (
                                <tr key={emp.id}>
                                    <td>{emp.id}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.project}</td>
                                    <td>{emp.task}</td>
                                    <td>{emp.subtask}</td>
                                    <td>{emp.date}</td>
                                    <td>{emp.hours}</td>
                                    <td>
                                    <img
  src={visibility2Icon}
  alt="View Icon"
  style={{ cursor: 'pointer' }}
  onClick={(e) => {
    e.preventDefault();
    handleViewClick(emp);
  }}
/>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ Modal Component */}
            <View show={showModal} data={selectedTask} onClose={closeModal} />

        </>
    );
};

export default Dashboard;
