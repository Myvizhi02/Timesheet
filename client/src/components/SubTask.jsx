import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';

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
    <Box>
      {/* Select SubTask Box */}
      <Box
        sx={{
          backgroundColor: highlightSubTask ? '#ffdddd' : '#fff',
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography sx={{ color: highlightSubTask ? 'red' : '#999' }}>
          Select SubTask
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#2264E5',
            color: '#fff',
            borderRadius: '4px',
          }}
          onClick={handleAddSubTask}
        >
          Add Sub Task
        </Button>
      </Box>

      {/* New Subtask Input Boxes */}
      {showNewInput &&
        subTasks.map((task, index) => (
          <TextField
            key={index}
            value={task}
            onChange={(e) => handleSubTaskChange(index, e.target.value)}
            placeholder={`Enter Sub Task ${index + 1}`}
            variant="outlined"
            fullWidth
            sx={{
              marginBottom: '8px',
              borderRadius: '6px',
            }}
          />
        ))}
    </Box>
  );
};

export default SubTask;
