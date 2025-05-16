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
  const [subTasks, setSubTasks] = useState([]);
  const [project, setProject] = useState('');
  const [projectsList, setProjectsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedSubTask, setSelectedSubTask] = useState('');
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [subTaskError, setSubTaskError] = useState(false);
  const [showExtraField, setShowExtraField] = useState(false);
  const [comments, setComments] = useState('');
  const crmLogId = localStorage.getItem('crm_log_id');

  useEffect(() => {
    fetch('http://localhost:3030/api/projects')
      .then(res => res.json())
      .then(data => setProjectsList(data))
      .catch(err => console.error('Error fetching project list:', err));
  }, []);

  const handleProjectChange = async (e) => {
    const selectedProjectName = e.target.value;
    setProject(selectedProjectName);

    try {
      const projectResponse = await axios.get('http://localhost:3030/api/projects');
      const selectedProject = projectResponse.data.find(proj => proj.project_name === selectedProjectName);

      if (selectedProject) {
        setSelectedProjectId(selectedProject.id);
        const taskResponse = await axios.get(`http://localhost:3030/api/tasks?project_id=${selectedProject.id}`);
        setTasksList(taskResponse.data);
      }
    } catch (error) {
      console.error('Error fetching tasks for project:', error);
    }
  };

  const handleTaskChange = async (e) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);

    try {
      const response = await axios.get(`http://localhost:3030/api/subtasks`, {
        params: { task_id: taskId, project_id: selectedProjectId }
      });
      setSubTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching subtasks for task:', error);
      setSubTasks([]);
    }
  };

  useEffect(() => {
    if (open) {
      setProject('');
      setSelectedProjectId('');
      setSelectedTaskId('');
      setSelectedSubTask('');
      setStartDateTime(null);
      setEndDateTime(null);
      setTasksList([]);
      setSubTasks([]);
    }
  }, [open]);

  const handleSaveTime = async () => {
    if (!selectedSubTask || !startDateTime || !endDateTime || !comments) {
      alert('Please fill in all fields.');
      return;
    }

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const hours = ((end - start) / (1000 * 60 * 60)).toFixed(2);

    if (hours <= 0) {
      alert('End time should be after start time.');
      return;
    }

    const payload = {
      project_id: selectedProjectId,
      task_id: selectedTaskId,
      sub_task_id: selectedSubTask,
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
      await axios.post('http://localhost:3030/api/spenttime', payload);
      alert('Time saved successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving time:', error);
      alert('Failed to save time.');
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
    <Dialog open={open} onClose={onClose} fullWidth={false} PaperProps={{ sx: { width: '600px', height: '600px', m: 0, p: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 11 } }}>
      <DialogTitle sx={{ backgroundColor: '#A3EAFD', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 0, }}>
        <Typography variant="h6">Add Spent Time</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4, pt: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField select label="Select Project" fullWidth value={project} onChange={handleProjectChange} SelectProps={{ native: true }}sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '258px',
                    height: '50px',
                  },
                }}>
                <option value="" disabled></option>
                {projectsList.map((proj) => <option key={proj.id} value={proj.project_name}>{proj.project_name}</option>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Select Task" fullWidth value={selectedTaskId} onChange={handleTaskChange} SelectProps={{ native: true }} disabled={!selectedProjectId}sx={{
                  '& .MuiOutlinedInput-root': {
                    width: '258px',
                    height: '50px',
                  },
                }}>
                <option value="" disabled></option>
                {tasksList.map((task) => <option key={task.id} value={task.id}>{task.task_name}</option>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField select label="Select SubTask" fullWidth value={selectedSubTask} onChange={(e) => { setSelectedSubTask(e.target.value); setSubTaskError(false); }} SelectProps={{ native: true }} disabled={!selectedTaskId} error={subTaskError}
                sx={{
                  width: '428px',
                  '& .MuiOutlinedInput-root': {
                    height: '50px',
                    backgroundColor: subTaskError ? '#FED3D3' : 'inherit',
                  },
                }}>
                <option value="" disabled></option>
                {subTasks.length > 0 ? subTasks.map((subtask) => <option key={subtask.id} value={subtask.id}>{subtask.subtask_name}</option>) : <option value="" disabled>No subtasks available</option>}
              </TextField>
            </Grid>
            <Grid item xs={12} >
              <Button variant="contained" color="primary" onClick={handleAddSubTask}sx={{
                    width: '5.5rem',
                    height: '3.0rem',
                    textTransform: 'none',
                    minWidth: 0,
                    fontSize: '0.58rem',
                  }}>Add Subtask</Button>
            </Grid>
            {showExtraField && (
              <Grid item xs={12}>
                <TextField label="Enter Sub Task" variant="outlined" size="small" fullWidth  sx={{ width: '525px', height: '2.5rem' }}
 />
              </Grid>
            )}
            <Grid item xs={6}>
              <TimePicker label="Start Time" value={startDateTime} onChange={setStartDateTime}  renderInput={(params) => (
      <TextField
        {...params}
        sx={{
          width: '250px',         // Set desired width
          '& .MuiInputBase-root': {
            height: '20px',       // Set desired height
          },
        }}
      />
    )}/>
            </Grid>
            <Grid item xs={6}>
              <TimePicker label="End Time" value={endDateTime} onChange={setEndDateTime}  renderInput={(params) => (
      <TextField
        {...params}
        sx={{
          width: '250px',         // Set desired width
          '& .MuiInputBase-root': {
            height: '20px',       // Set desired height
          },
        }}
      />
    )} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Comments" multiline rows={3} fullWidth value={comments} onChange={(e) => setComments(e.target.value)} sx={{
                  width: '530px',
                  '& .MuiOutlinedInput-root': {
                    height: '100px',
                    
                  },
                }} />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center',mt:2,ml:20  }}>
              <Button variant="contained" color="primary" onClick={handleSaveTime} fullWidth sx={{
                  width: '12rem',
                  height: '2.5rem',
                  textTransform: 'none',
                  minWidth: 0,
                  //fontSize: '0.5rem',
                }}>Submit</Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddSpenttime;