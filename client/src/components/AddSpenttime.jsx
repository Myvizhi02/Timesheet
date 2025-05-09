import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import dateIcon from '../assets/date.png';


const AddSpenttime = ({ open, onClose }) => {
  const [subTasks, setSubTasks] = useState([{ name: '', error: false }]);
  const [project, setProject] = useState('');
  const [projectsList, setProjectsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedSubTask, setSelectedSubTask] = useState('');
  const [selectedSubTaskId, setSelectedSubTaskId] = useState('');
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [subTaskError, setSubTaskError] = useState(false);
  const [showExtraField, setShowExtraField] = useState(false);
  const [comments, setComments] = useState('');
const crmLogId = localStorage.getItem('crm_log_id'); // assuming it's stored in localStorage


  // Fetch agent name on load
  useEffect(() => {
    const fetchAgentName = async () => {
      try {
        const agentId = localStorage.getItem('agentId');
        if (agentId) {
          const response = await axios.get(`http://localhost:3030/api/agents/${agentId}`);
          setAgentName(response.data.name);
          localStorage.setItem('name', response.data.name);
        }
      } catch (error) {
        console.error('Error fetching agent name:', error);
      }
    };

    fetchAgentName();
  }, []);

  // Fetch projects list on load
  useEffect(() => {
    fetch('http://localhost:3030/api/projects')
      .then(res => res.json())
      .then(data => setProjectsList(data))
      .catch(err => console.error('Error fetching project list:', err));
  }, []);

  // Fetch tasks based on selected project
  const handleProjectChange = async (e) => {
    const selectedProjectName = e.target.value;
    setProject(selectedProjectName);

    try {
      const projectResponse = await axios.get('http://localhost:3030/api/projects');
      const selectedProject = projectResponse.data.find(
        (proj) => proj.project_name === selectedProjectName
      );

      if (selectedProject) {
        setSelectedProjectId(selectedProject.id);

        const taskResponse = await axios.get(
          `http://localhost:3030/api/tasks?project_id=${selectedProject.id}`
        );
        console.log("taskresponse" ,taskResponse)
        setTasksList(taskResponse.data);
        
      }
    } catch (error) {
      console.error('Error fetching tasks for project:', error);
    }
  };
 // Handle task change
const handleTaskChange = async (e) => {
  const selectedTaskId = e.target.value;  // Get the selected task_id
  console.log("Selected Task ID:", selectedTaskId);
  setSelectedTaskId(selectedTaskId); // Store the task_id

  try {
    // Find the selected task from the list based on task_id
    const selectedTask = tasksList.find((task) => task.id === selectedTaskId);  // Ensure the property matches the task_id

    if (selectedTask) {
      console.log("Mapped Task:", selectedTask);

      // Fetch subtasks for the selected task
      const subtaskResponse = await axios.get(
        `http://localhost:3030/api/subtasks`, {
          params: { task_id: selectedTaskId, project_id: selectedProjectId } // Pass both task_id and project_id
        }
      );

      // Handle subtask response
      if (subtaskResponse.data) {
        setSubTasks(subtaskResponse.data); // Update the state with subtasks
      } else {
        console.log("No subtasks found for this task.");
        setSubTasks([]);  // Clear subtasks if none found
      }
    } else {
      console.log("Task not found for the selected ID.");
    }
  } catch (error) {
    console.error('Error fetching subtasks for task:', error);
  }
};

  // Fetch subtasks based on selected task and project
  useEffect(() => {
    if (selectedTaskId && selectedProjectId) {
      console.log(`Fetching subtasks for taskId: ${selectedTaskId} and projectId: ${selectedProjectId}`);
      fetchTaskAndSubtasks(selectedTaskId, selectedProjectId);
    }
  }, [selectedTaskId, selectedProjectId]);
  
  const fetchTaskAndSubtasks = async (taskId, projectId) => {
    try {
      const response = await axios.get(`Fapi/subtasks`, {
        params: { task_id: taskId, project_id: projectId }
      });
  
      // Set the fetched subtask list for the dropdown
      setSubTasks(response.data || []);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('No subtasks found');
        setSubTasks([]);
      } else {
        console.error('Error fetching subtasks:', error.message);
      }
    }
  };
  
  // Reset form fields when dialog opens
  useEffect(() => {
    if (open) {
      setProject('');
      setSelectedProjectId('');
      setSelectedTask('');
      setSelectedSubTask('');
      setStartDateTime(null);
      setEndDateTime(null);
      setTasksList([]);
      setSubTasks([]);
    }
  }, [open]);

  const handleSaveTime = async () => {
    console.log('Dropdown selected name:', selectedSubTask);
    console.log('Available subTasks:', subTasks);
  
    // Check for required fields
    if (!selectedSubTask || !startDateTime || !endDateTime || !comments) {
      alert('Please fill in all fields.');
      return;
    }
  
    // selectedSubTask is already the subtask id now
    const selectedSubTaskId = selectedSubTask;
    console.log('Converted sub_task_id:', selectedSubTaskId);
  
    if (!selectedSubTaskId) {
      alert('Invalid sub-task selected.');
      return;
    }
  
    if (!selectedProjectId || !selectedTaskId || !crmLogId) {
      alert('Invalid project, task, or user.');
      return;
    }
  
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
  
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
  
    // Validate start and end times
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert('Invalid date or time format.');
      return;
    }
  
    const hours = ((end - start) / (1000 * 60 * 60)).toFixed(2); // in hours
  
    // Avoid negative or zero hours
    if (hours <= 0) {
      alert('End time should be after start time.');
      return;
    }
  
    const payload = {
      project_id: selectedProjectId,
      task_id: selectedTaskId,
      sub_task_id: selectedSubTaskId,
      user_id: crmLogId,
      start_date: formattedDate,
      end_date: formattedDate,
      start_time: start.toTimeString().split(' ')[0],
      end_time: end.toTimeString().split(' ')[0],
      hours,
      created_by: crmLogId,
      modified_by: crmLogId,
      created_date: formattedDate,
      is_active: 1,
      comments
    };
  
    try {
      const response = await axios.post('http://localhost:3030/api/spenttime', payload);
      console.log('Response:', response);  // Log the response
      alert('Time saved successfully!');
      onClose();  // Close the dialog
    } catch (error) {
      console.error('Error saving time:', error);
      
      // Improved error handling: Check if the error has a response from the server
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Error: ${error.response.data.message || 'Failed to save time.'}`);
      } else {
        alert('Failed to save time.');
      }
    }
  };
  
  const handleAddSubTask = () => {
    if (!selectedSubTask) {
      setSubTaskError(true);
      setShowExtraField(true);
    } else {
      setSubTaskError(false);
      setShowExtraField(false);
    }
  };
  


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={false}
      PaperProps={{
        sx: {
          width: '37.625rem',
          height: '37.5rem',
          m: 0,
          p: 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 11,
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#A3EAFD',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '3rem',
          px: 3,
          py: 0,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Add Spent Time
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 2,
          pt: 3,
          height: 'calc(100% - 7rem)',
          overflowY: 'auto',
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <TextField
                select
                label="Select Project"
                fullWidth
                value={project}
                onChange={handleProjectChange}
                SelectProps={{ native: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '255px',
                    height: '40px',
                  },
                }}
              >
                <option value="" disabled></option>
                {projectsList.map((proj) => (
                  <option key={proj.id} value={proj.project_name}>
                    {proj.project_name}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item>
            <TextField
  select
  label="Select Task"
  fullWidth
  value={selectedTaskId}  // Use task_id as the value
  onChange={handleTaskChange}
  SelectProps={{ native: true }}
  sx={{
    '& .MuiOutlinedInput-root': {
      width: '255px',
      height: '40px',
    },
  }}
  disabled={!selectedProjectId}
>
  <option value="" disabled></option>
  {tasksList.map((task) => (
    <option key={task.id} value={task.id}> {/* Use task_id as value */}
      {task.task_name}
    </option>
  ))}
</TextField>

        </Grid>

            <Grid item>
            <TextField
   select
   label="Select SubTask"
   fullWidth
   value={selectedSubTask}
   onChange={(e) => {
     setSelectedSubTask(e.target.value);
     setSubTaskError(false); // remove error once user selects
   }}
   SelectProps={{ native: true }}
   sx={{
     width: '428px',
     '& .MuiOutlinedInput-root': {
       height: '40px',
       backgroundColor: subTaskError ? '#FED3D3' : 'inherit',
     },
   }}
   disabled={!selectedTaskId}
  >
    <option value="" disabled></option>
    {subTasks.length > 0 ? (
      subTasks.map((subtask) => (
        <option key={subtask.id} value={subtask.id}>
  {subtask.subtask_name}
</option>

      ))
    ) : (
      <option value="" disabled>No subtasks available</option> // Message when no subtasks found
    )}
  </TextField>

            </Grid>

            <Grid
              item
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{ flexWrap: 'nowrap' }}
            >
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddSubTask}
                  sx={{
                    width: '5rem',
                    height: '2.5rem',
                    textTransform: 'none',
                    minWidth: 0,
                    fontSize: '0.5rem',
                  }}
                >
                  Add Subtask
                </Button>
              </Grid>
            </Grid>
            {showExtraField && (
  <Grid item>
    <TextField
      label="Enter Sub Task"
      variant="outlined"
      size="small"
      sx={{ width: '525px', height: '2.5rem' }}
    />
  </Grid>
)}
           
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Start Time"
                value={startDateTime}
                onChange={(newValue) => setStartDateTime(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{ width: '247px', height: '40px' }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <img
                            src={dateIcon}
                            alt="Date Icon"
                            style={{ width: '1.25rem', cursor: 'pointer' }}
                            onClick={() => {
                              params.inputProps?.onClick?.();
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TimePicker
                label="End Time"
                value={endDateTime}
                onChange={(newValue) => setEndDateTime(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{ width: '257px', height: '40px' }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <InputAdornment position="end">
                          <img
                            src={dateIcon}
                            alt="Date Icon"
                            style={{ width: '1.25rem', cursor: 'pointer' }}
                            onClick={() => {
                              params.inputProps?.onClick?.();
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <TextField
  label="Enter Comments"
  multiline
  variant="outlined"
  value={comments}
  onChange={(e) => setComments(e.target.value)}
  sx={{
    width: '33rem',
    '& .MuiInputBase-root': {
      minHeight: '6.25rem',
    },
  }}
/>

              </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  width: '12rem',
                  height: '2.5rem',
                  textTransform: 'none',
                  minWidth: 0,
                  //fontSize: '0.5rem',
                }}
                onClick={handleSaveTime}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddSpenttime;