import React, { useState } from 'react';
import addIcon from '../add.png';
import visibility2Icon from '../visibility2.png';
    import AddTask from './AddTask'; 

const Task = () => {
    const [showPopup, setShowPopup] = useState(false);

    const handleCreateTask = (data) => {
        console.log('New Task:', data);  
      };
      

    const task = [
        {
            id: 1,
            project: "Bridge Application",
            taskname: "Merge Core and JD",
            subtask: "Sub Task",
            description: "Uniting the user of core and JD",
            status: "Status"
        },
        {
            id: 2,
            project: "Winfast CRM",
            taskname: "Setup Dashboard",
            subtask: "UI Build",
            description: "Uniting the user of core and JD",
            status: "Status"
        },
        {
            id: 3,
            project: "Tata CRM",
            taskname: "Setup Dashboard",
            subtask: "UI Build",
            description: "Uniting the user of core and JD",
            status: "Status"
        }
    ];

    return (
        <>
            <div style={{ padding: '30px 40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                {/* Header and Create Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <button
                        onClick={() => setShowPopup(true)}
                        style={{
                            borderRadius: '12px',
                            backgroundColor: '#3D6BFA',
                            border: 'none',
                            color: 'white',
                            width: '160px',
                            height: '44px',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}>
                        <img src={addIcon} alt="Add Icon" style={{ width: '18px' }} />
                        Add Task
                    </button>
                </div>

                {/* Table */}
                <div>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                    }}>
                        <thead style={{ backgroundColor: '#84E7F9' }}>
                            <tr style={{ textAlign: 'center', fontWeight: 600 }}>
                                <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>SL No</th>
                                <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>Project</th>
                                <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>Task Name</th>
                                <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>Sub Task</th>
                                <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>Description</th>
                                <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>Status</th>
                                <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {task.map((proj, index) => (
                                <tr key={proj.id} style={{ textAlign: 'center', borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{index + 1}</td>
                                    <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.project}</td>
                                    <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.taskname}</td>
                                    <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.subtask}</td>
                                    <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.description}</td>
                                    <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.status}</td>
                                    <td style={{ padding: '10px', display: 'flex', justifyContent: 'center' }}>
                                        <button style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img src={visibility2Icon} alt="View" style={{ width: '16px' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Task Popup */}
            {showPopup && (
                <AddTask
                    onClose={() => setShowPopup(false)}
                    onSubmit={handleCreateTask}
                />
            )}
        </>
    );
};

export default Task;
