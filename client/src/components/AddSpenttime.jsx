import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogActions,
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
  const [subTasks, setSubTasks] = useState([]);
  const [project, setProject] = useState('');
  const [projectsList, setProjectsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
const [selectedTask, setSelectedTask] = useState('');
const [subtaskOptions, setSubtaskOptions] = useState([]);
const [selectedSubtask, setSelectedSubtask] = useState('');


  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [agentName, setAgentName] = useState(localStorage.getItem('name') || 'Agent');

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
   
  
    useEffect(() => {
      fetch('http://localhost:3030/api/projects')
        .then(res => res.json())
        .then(data => {
          setProjectsList(data);
        })
        .catch(err => {
          console.error('Error fetching project list:', err);
        });
    }, []);
    useEffect(() => {
      fetch('http://localhost:3030/api/tasks')
        .then(res => res.json())
        .then(data => setTasksList(data))
        .catch(err => console.error('Error fetching task list:', err));
    }, []);
    

  useEffect(() => {
    if (open) {
      // Reset fields when modal opens
      setSubTasks([]);
      setStartDateTime(null);
      setEndDateTime(null);
    }
  }, [open]);
  
  const handleTaskChange = async (e) => {
    const taskName = e.target.value;
    setSelectedTask(taskName);
    
    // Find task_id from task name
    const selected = tasksList.find(t => t.task_name === taskName);
    const taskId = selected?.task_id;
  
    if (taskId) {
      try {
        const response = await fetch(`http://localhost:3030/api/subtasks?taskId=${taskId}`);
        const data = await response.json();
        setSubtaskOptions(data);
      } catch (err) {
        console.error('Error fetching subtasks:', err);
      }
    }
  };
  
  const handleAddSubTask = () => {
    if (subTasks.length === 0) {
      setSubTasks(['']);
    }
  };
  

  return (
    <>
      {/* Modal (Popup) */}
      <Dialog
        open={open} // controlled by parent
        onClose={onClose}
        fullWidth={false}
        PaperProps={{
          sx: {
            width: '37.625rem',
            height: '37.5rem',
            m: 0,
            p: 0,
            position: 'absolute', // Position the modal correctly
            top: '50%', // Center the modal vertically
            left: '50%', // Center the modal horizontally
            transform: 'translate(-50%, -50%)', // Adjust for exact centering
            zIndex: 11, // Ensure modal is above other content
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
                              onChange={(e) => setProject(e.target.value)}
                              SelectProps={{ native: true }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  width: '247px',
                                  height: '40px',
                                },
                              }}
                            >
                              <option value="" disabled></option>
                              {projectsList.map((proj) => (
                                <option key={proj.project_unique_id} value={proj.project_name}>
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
  value={selectedTask}
  onChange={handleTaskChange}
  SelectProps={{ native: true }}
  sx={{
    width: '16rem',
    height: '2.5rem',
    '& .MuiOutlinedInput-root': {
      height: '40px',
    },
  }}
>
  <option value="" disabled></option>
  {tasksList.map((task) => (
    <option key={task.task_id} value={task.task_name}>
      {task.task_name}
    </option>
  ))}
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
                <TextField
  select
  label="Select SubTask"
  fullWidth
  value={selectedSubtask}
  onChange={(e) => setSelectedSubtask(e.target.value)}
  SelectProps={{ native: true }}
  sx={{
    width: '26.5rem',
    height: '2.5rem',
    '& .MuiOutlinedInput-root': {
      height: '40px',
    },
  }}
>
  <option value="" disabled></option>
  {subtaskOptions.map((sub) => (
    <option key={sub.subtask_id} value={sub.subtask_name}>
      {sub.subtask_name}
    </option>
  ))}
</TextField>

                </Grid>
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

              {subTasks.map((_, index) => (
                <Grid item key={index}>
                  <TextField
                    label={`Enter Sub Task ${index + 1}`}
                    variant="outlined"
                    size="small"
                    sx={{ width: '32rem', height: '2.5rem' }}
                  />
                </Grid>
              ))}

              <Grid item xs={12} sm={6}>
              <TimePicker
  label="Start Time"
  value={startDateTime}
  onChange={(newValue) => setStartDateTime(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      sx={{
        width: '247px', // Set the width to 247px
        height: '40px', // Set the height to 40px
      }}
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
  label="Start Time"
  value={startDateTime}
  onChange={(newValue) => setStartDateTime(newValue)}
  renderInput={(params) => (
    <TextField
      {...params}
      fullWidth
      sx={{
        width: '257px',
        height: '40px',}}
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
                  sx={{
                    width: '33rem',
                    '& .MuiInputBase-root': {
                      minHeight: '6.25rem',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{
              py: 1,
              px: 4,
              borderRadius: '0.5rem',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// Parent Component
const ParentComponent = () => {
  const [open, setOpen] = useState(true); // open immediately when loaded

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AddSpenttime open={open} onClose={handleDialogClose} />
    </div>
  );
};

export default AddSpenttime;

