import React, { useState } from 'react';

const SubTask = () => {
  const [showNewInput, setShowNewInput] = useState(false);
  const [highlightSubTask, setHighlightSubTask] = useState(false);
  const [subTasks, setSubTasks] = useState(['']); // for multiple subtasks

  const handleAddSubTask = () => {
    setHighlightSubTask(true);
    setShowNewInput(true);
    setSubTasks([...subTasks, '']);
  };

  const handleSubTaskChange = (index, value) => {
    const updated = [...subTasks];
    updated[index] = value;
    setSubTasks(updated);
  };

  return (
    <div>
      {/* Select SubTask Box */}
      <div
        style={{
          backgroundColor: highlightSubTask ? '#ffdddd' : '#fff',
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ color: highlightSubTask ? 'red' : '#999' }}>Select SubTask</span>
        <button
          type="button"
          onClick={handleAddSubTask}
          style={{
            backgroundColor: '#2264E5',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Sub Task
        </button>
      </div>

      {/* New Subtask Input Boxes */}
      {showNewInput &&
        subTasks.map((task, index) => (
          <input
            key={index}
            value={task}
            onChange={(e) => handleSubTaskChange(index, e.target.value)}
            placeholder={`Enter Sub Task ${index + 1}`}
            style={{
              padding: '10px',
              marginBottom: '8px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        ))}
    </div>
  );
};

export default SubTask;
