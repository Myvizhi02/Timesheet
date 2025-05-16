import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AddSpenttime = ({ open, onClose, onSaved }) => {
  const [executiveProjects, setExecutiveProjects] = useState([]);
  const [projectDbId, setProjectDbId] = useState('');
  const [selectedProjectUniqueId, setSelectedProjectUniqueId] = useState('');
  const [tasksList, setTasksList] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [subTasks, setSubTasks] = useState([]);
  const [selectedSubTask, setSelectedSubTask] = useState('');
  const [extraSubTaskName, setExtraSubTaskName] = useState('');
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [comments, setComments] = useState('');
  const [showExtraField, setShowExtraField] = useState(false);
  const [subTaskError, setSubTaskError] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const crmLogId = localStorage.getItem('crm_log_id');

  // Fetch projects by executive
  useEffect(() => {
    if (crmLogId) {
      axios
        .get(`http://localhost:3030/api/projects/by-executive/${crmLogId}`)
        .then((res) => setExecutiveProjects(res.data))
        .catch((err) => console.error('Error fetching projects:', err));
    }
  }, [crmLogId]);

  const handleProjectChange = async (e) => {
    const uniqueId = e.target.value;
    setSelectedProjectUniqueId(uniqueId);
    setSelectedTaskId('');
    setSelectedSubTask('');
    setSubTasks([]);
    setTasksList([]);

    try {
      const project = executiveProjects.find((p) => String(p.project_unique_id) === uniqueId);
      if (project) {
        setProjectDbId(project.id);

        const taskRes = await axios.get(`http://localhost:3030/api/tasks?project_id=${project.id}`);
        setTasksList(taskRes.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleTaskChange = async (e) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);
    setSelectedSubTask('');
    setSubTasks([]);
    setShowExtraField(false);

    if (!taskId || !projectDbId) return;

    try {
      const res = await axios.get('http://localhost:3030/api/subtasks', {
        params: { task_id: taskId, project_id: projectDbId },
      });
      setSubTasks(res.data || []);
    } catch (err) {
      console.error('Error fetching subtasks:', err);
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

  const handleSaveTime = async () => {
    if ((!selectedSubTask && !extraSubTaskName.trim()) || !startDateTime || !endDateTime || !comments.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const hours = ((end - start) / (1000 * 60 * 60)).toFixed(2);
    if (hours <= 0) {
      alert('End time must be after start time.');
      return;
    }

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    let subTaskIdToSave = selectedSubTask;

    // Add custom subtask if needed
    if (!selectedSubTask && extraSubTaskName.trim()) {
      try {
        const subtaskRes = await axios.post('http://localhost:3030/api/subtasks', {
          subtask_name: extraSubTaskName,
          task_id: selectedTaskId,
          project_id: projectDbId,
          created_by: crmLogId,
          modified_by: crmLogId,
          is_active: 1,
        });
        subTaskIdToSave = subtaskRes.data.insertId;
      } catch (err) {
        console.error('Error creating subtask:', err);
        alert('Failed to create new subtask.');
        return;
      }
    }

    const payload = {
      project_id: projectDbId,
      task_id: selectedTaskId,
      sub_task_id: subTaskIdToSave,
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
      comments,
    };

    try {
      await axios.post('http://localhost:3030/api/spenttime', payload);
      setSnackbar({ open: true, message: 'Time saved successfully!', severity: 'success' });
      if (onSaved) onSaved();
      onClose();
    } catch (err) {
      console.error('Error saving time:', err);
      setSnackbar({ open: true, message: 'Failed to save time.', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    if (open) {
      // Reset form on open
      setSelectedProjectUniqueId('');
      setProjectDbId('');
      setSelectedTaskId('');
      setSelectedSubTask('');
      setExtraSubTaskName('');
      setTasksList([]);
      setSubTasks([]);
      setStartDateTime(null);
      setEndDateTime(null);
      setComments('');
      setSubTaskError(false);
      setShowExtraField(false);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={onClose} PaperProps={{
        sx: {
          width: '600px',
          height: '600px',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      }}>
        <DialogTitle sx={{ backgroundColor: '#A3EAFD', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Add Spent Time</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select label="Select Project" fullWidth
                  value={selectedProjectUniqueId}
                  onChange={handleProjectChange}
                  SelectProps={{ native: true }}
                >
                  <option value="" disabled>Select project</option>
                  {executiveProjects.map(proj => (
                    <option key={proj.id} value={proj.project_unique_id}>{proj.project_name}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select label="Select Task" fullWidth
                  value={selectedTaskId}
                  onChange={handleTaskChange}
                  disabled={!projectDbId}
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
                  select label="Select SubTask" fullWidth
                  value={selectedSubTask}
                  onChange={(e) => {
                    setSelectedSubTask(e.target.value);
                    setSubTaskError(false);
                  }}
                  disabled={!selectedTaskId}
                  error={subTaskError}
                  SelectProps={{ native: true }}
                >
                  <option value="">Select subtask</option>
                  {subTasks.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.subtask_name}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={handleAddSubTask}>Add Subtask</Button>
              </Grid>
              {showExtraField && (
                <Grid item xs={12}>
                  <TextField
                    label="Enter Sub Task"
                    fullWidth
                    value={extraSubTaskName}
                    onChange={(e) => setExtraSubTaskName(e.target.value)}
                  />
                </Grid>
              )}
              <Grid item xs={6}>
                <TimePicker label="Start Time" value={startDateTime} onChange={setStartDateTime} renderInput={(params) => <TextField {...params} fullWidth />} />
              </Grid>
              <Grid item xs={6}>
                <TimePicker label="End Time" value={endDateTime} onChange={setEndDateTime} renderInput={(params) => <TextField {...params} fullWidth />} />
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
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                <Button variant="contained" onClick={handleSaveTime}>Submit</Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddSpenttime;
