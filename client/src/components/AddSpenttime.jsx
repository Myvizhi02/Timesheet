import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AddSpenttime = ({ open, onClose }) => {
  const [projectsList, setProjectsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [subTasks, setSubTasks] = useState([]);

  const [project, setProject] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedSubTask, setSelectedSubTask] = useState('');
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [comments, setComments] = useState('');
  const [subTaskError, setSubTaskError] = useState(false);
  const [showExtraField, setShowExtraField] = useState(false);

  const crmLogId = localStorage.getItem('crm_log_id');

  useEffect(() => {
    if (open) {
      resetForm();
      fetchProjects();
    }
  }, [open]);

  const resetForm = () => {
    setProject('');
    setSelectedProjectId('');
    setSelectedTaskId('');
    setSelectedSubTask('');
    setStartDateTime(null);
    setEndDateTime(null);
    setTasksList([]);
    setSubTasks([]);
    setComments('');
    setSubTaskError(false);
    setShowExtraField(false);
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:3030/api/projects');
      setProjectsList(response.data);
    } catch (error) {
      console.error('Error fetching project list:', error);
    }
  };

  const handleProjectChange = async (e) => {
    const selectedProjectName = e.target.value;
    setProject(selectedProjectName);

    try {
      const response = await axios.get('http://localhost:3030/api/projects');
      const projectData = response.data.find(p => p.project_name === selectedProjectName);
      if (projectData) {
        setSelectedProjectId(projectData.id);
        const taskResponse = await axios.get(`http://localhost:3030/api/tasks?project_id=${projectData.id}`);
        setTasksList(taskResponse.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
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
      console.error('Error fetching subtasks:', error);
      setSubTasks([]);
    }
  };

  const checkPartialOverlap = async (startDate, startTime, endTime) => {
  try {
    const res = await axios.get('http://localhost:3030/api/spenttime/partial-check', {
      params: {
        start_date: startDate,
        start_time: startTime,
        end_time: endTime
      }
    });

    if (res.data.exists) {
      alert('Time overlap detected!');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking overlap:', error);
    return false;
  }
};

  const handleSaveTime = async () => {
    if (!selectedSubTask || !startDateTime || !endDateTime || !comments) {
      alert('Please fill in all fields.');
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const duration = (end - start) / (1000 * 60 * 60);

    if (duration <= 0) {
      alert('End time must be after start time.');
      return;
    }

    const formattedDate = new Date().toISOString().split('T')[0];
    const startTimeStr = start.toTimeString().split(' ')[0];
    const endTimeStr = end.toTimeString().split(' ')[0];
    const hours = duration.toFixed(2);

    const overlap = await checkPartialOverlap(formattedDate, startTimeStr, endTimeStr);

    if (overlap) return;

    const payload = {
      project_id: selectedProjectId,
      task_id: selectedTaskId,
      sub_task_id: selectedSubTask,
      user_id: crmLogId,
      start_date: formattedDate,
      end_date: formattedDate,
      start_time: startTimeStr,
      end_time: endTimeStr,
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
    <Dialog open={open} onClose={onClose} PaperProps={{
      sx: {
        width: 600,
        height: 600,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 11
      }
    }}>
      <DialogTitle sx={{ backgroundColor: '#A3EAFD', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Add Spent Time</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Select Project"
                fullWidth
                value={project}
                onChange={handleProjectChange}
                SelectProps={{ native: true }}
              >
                <option value="" disabled>Select project</option>
                {projectsList.map(proj => (
                  <option key={proj.id} value={proj.project_name}>{proj.project_name}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Select Task"
                fullWidth
                value={selectedTaskId}
                onChange={handleTaskChange}
                disabled={!selectedProjectId}
                SelectProps={{ native: true }}
              >
                <option value="" disabled>Select task</option>
                {tasksList.map(task => (
                  <option key={task.id} value={task.id}>{task.task_name}</option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Select SubTask"
                fullWidth
                value={selectedSubTask}
                onChange={(e) => {
                  setSelectedSubTask(e.target.value);
                  setSubTaskError(false);
                }}
                error={subTaskError}
                disabled={!selectedTaskId}
                SelectProps={{ native: true }}
              >
                <option value="" disabled>Select subtask</option>
                {subTasks.length > 0 ? subTasks.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.subtask_name}</option>
                )) : <option value="" disabled>No subtasks available</option>}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={handleAddSubTask}>Add Subtask</Button>
            </Grid>
            {showExtraField && (
              <Grid item xs={12}>
                <TextField label="Enter Sub Task" variant="outlined" size="small" fullWidth />
              </Grid>
            )}
            <Grid item xs={6}>
              <TimePicker
                label="Start Time"
                value={startDateTime}
                onChange={setStartDateTime}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label="End Time"
                value={endDateTime}
                onChange={setEndDateTime}
                slotProps={{
                  textField: {
                    fullWidth: true
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Comments"
                multiline
                rows={3}
                fullWidth
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" color="primary" onClick={handleSaveTime}>
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
