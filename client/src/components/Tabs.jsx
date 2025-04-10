import React, { useState } from 'react';
import Visibility2Icon from '../visibility2.png';


const EmployeeTabs = () => {
    const [activeTab, setActiveTab] = useState('all');

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
        <div className="p-4">
            {/* Tabs */}
            <div className="mb-3" style={{ backgroundColor: '#CDCDCD80', marginTop: '62px', marginLeft: '51px', width: '300px' }}>
                <button
               
                    onClick={() => setActiveTab('all')}
                    className={`btn me-2 ${activeTab === 'all' ? 'btn-white text-dark border' : 'btn-light'}`}
                    style={{
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius:'8px',
                        padding: '4px 10px 4px 10px',
                        marginRight: '5px'
                    }}>
                    All Executive</button>
                <button
                    onClick={() => setActiveTab('emp1')}
                    className={`btn me-2 ${activeTab === 'all' ? 'btn-white text-dark border' : 'btn-light'}`}
                    style={{
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius:'8px',
                        padding: '4px 10px 4px 10px',
                        marginRight: '5px'
                    }}>
                    Employee 1</button>
                <button
                    onClick={() => setActiveTab('emp2')}
                    className={`btn me-2 ${activeTab === 'all' ? 'btn-white text-dark border' : 'btn-light'}`}
                    style={{
                        borderTopLeftRadius: '8px',
                        borderTopRightRadius:'8px',
                        padding: '4px 10px 4px 10px'
                    }}>
                    Employee 2</button>
            </div>


            <div
                style={{
                    backgroundColor: 'white',
                    marginTop: '12px',
                    marginLeft: '51px',
                    marginBottom: '62px',
                    marginRight: '52px',
                    width: '1337px',
                    height: '144px'
                }}>

                {/* Table */}
                <table className="table table-bordered text-center" style={{width: '1339px'}} border={{}}>
                    <thead className="table-info" >
                        <tr style={{ backgroundColor: '#84E7F9'}}>
                            <th>  SL.no  </th>
                            <th>  Name  </th>
                            <th>  Project  </th>
                            <th>  Task  </th>
                            <th>  Sub-Task  </th>
                            <th>  Date  </th>
                            <th>  Worked-Hrs  </th>
                            <th>  View  </th>
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
                                <td><i className="bi bi-eye">
                                    <img src={Visibility2Icon} alt="Visibility2 Icon"></img>
                                </i></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> </div>
    );
};

export default EmployeeTabs;
