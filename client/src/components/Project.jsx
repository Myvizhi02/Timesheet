import React from 'react';
import addIcon from '../add.png';
import borderIcon from '../border.png';

const Project = () => {
  const projects = [
    {
      id: 1,
      name: "Winfast",
      domain: "Development",
      lob: "-",
      startDate: "01/03/2025",
      endDate: "31/03/2025"
    },
    {
      id: 2,
      name: "Winfast",
      domain: "Development",
      lob: "-",
      startDate: "01/03/2025",
      endDate: "31/03/2025"
    }
  ];

  return (
    <div style={{ padding: '30px 40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header and Create Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          style={{
            borderRadius: '12px',
            backgroundColor: '#3D6BFA',
            border: 'none',
            color: 'white',
            width: '160px',
            height: '44px',
            fontSize: '14px',
            fontWeight: '600',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}>
          <img src={addIcon} alt="Add Icon" style={{ width: '18px' }} />
          Create Project
        </button>
      </div>

      {/* Table */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
      }}>
        <thead style={{ backgroundColor: '#84E7F9' }}>
          <tr style={{ textAlign: 'center', fontWeight: 600 }}>
            <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>SL No</th>
            <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>Name of the Project</th>
            <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>Domain</th>
            <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>LOB</th>
            <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>Start -Date</th>
            <th style={{ padding: '12px', borderRight: '1px solid #ccc' }}>End-Date</th>
            <th style={{ padding: '12px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((proj, index) => (
            <tr key={proj.id} style={{ textAlign: 'center', borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{index + 1}</td>
              <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.name}</td>
              <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.domain}</td>
              <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.lob}</td>
              <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.startDate}</td>
              <td style={{ padding: '10px', borderRight: '1px solid #eee' }}>{proj.endDate}</td>
              <td style={{ padding: '10px' }}>
                <button
                  style={{
                    backgroundColor: '#FFF3CD',
                    border: '1px solid #ffeeba',
                    color: '#856404',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <img src={borderIcon} alt="Border Icon" style={{ width: '16px' }} />
                  Edit Project
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Project;
