import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useEffect, useState } from 'react';

const AddSpenttime = ({ open, onClose, onSaved }) => {
  const [subTasks, setSubTasks] = useState([]);
  const [executiveProjects, setExecutiveProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [tasksList, setTasksList] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedSubTask, setSelectedSubTask] = useState('');
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [subTaskError, setSubTaskError] = useState(false);
  const [showExtraField, setShowExtraField] = useState(false);
  const [extraSubTaskName, setExtraSubTaskName] = useState('');
  const [comments, setComments] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const crmLogId = localStorage.getItem('crm_log_id');

  useEffect(() => {
    if (!crmLogId) return;
    axios
      .get(`http://localhost:3030/api/projects/by-executive/${crmLogId}`)
      .then((response) => {
        setExecutiveProjects(response.data);
      })
      .catch((error) => {
        console.error('Error fetching projects for executive:', error);
      });
  }, [crmLogId]);

  const handleProjectChange = async (e) => {
    const projectId = e.target.value;
    setSelectedProjectId(projectId);
    setSelectedTaskId('');
    setSelectedSubTask('');
    setTasksList([]);
    setSubTasks([]);

    if (!projectId) return;

    try {
      const taskResponse = await axios.get(`http://localhost:3030/api/tasks?project_id=${projectId}`);
      setTasksList(taskResponse.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskChange = async (e) => {
    const taskId = e.target.value;
    setSelectedTaskId(taskId);
    setSelectedSubTask('');
    setSubTasks([]);

    if (!taskId || !selectedProjectId) return;

    try {
      const response = await axios.get('http://localhost:3030/api/subtasks', {
        params: { task_id: taskId, project_id: selectedProjectId }
      });
      setSubTasks(response.data || []);
    } catch (error) {
      console.error('Error fetching subtasks:', error);
      setSubTasks([]);
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedProjectId('');
      setSelectedTaskId('');
      setSelectedSubTask('');
      setStartDateTime(null);
      setEndDateTime(null);
      setTasksList([]);
      setSubTasks([]);
      setShowExtraField(false);
      setExtraSubTaskName('');
      setComments('');
      setSubTaskError(false);
    }
  }, [open]);

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

    const payload = {
      project_id: selectedProjectId,
      task_id: selectedTaskId,
      sub_task_id: selectedSubTask || ' ',
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

    if (!selectedSubTask && extraSubTaskName.trim()) {
      try {
        const subtaskRes = await axios.post('http://localhost:3030/subtasks', {
          subtask_name: extraSubTaskName,
          task_id: selectedTaskId,
          project_id: selectedProjectId,
          created_by: crmLogId,
          modified_by: crmLogId,
          is_active: 1,
        });
        console.log('tskdmsdmk');
        console.log(subtaskRes.data.insertId);
        payload.sub_task_id = subtaskRes.data.insertId;
      } catch (error) {
        console.error('Error creating custom subtask:', error);
        alert('Failed to create new subtask.');
        return;
      }
    }

    console.log(payload);
    try {
      await axios.post('http://localhost:3030/api/spenttime', payload);
      setSnackbar({ open: true, message: 'Time saved successfully!', severity: 'success' });
      onSaved();
      
    } catch (error) {
      console.error('Error saving time:', error);
      setSnackbar({ open: true, message: 'Failed to save time.', severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async () => {
    if (extraSubTaskName && extraSubTaskName.trim() !== '') {
      try {
        await handleSaveTime();
      } catch (error) {
        console.error("Error in creating subtask and saving time:", error);
      }
    } else if (selectedSubTask) {
      await handleSaveTime();
    } else {
      setSnackbar({ open: true, message: 'Please select or enter a subtask.', severity: 'warning' });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} PaperProps={{
        sx: {
          width: '600px',
          height: '600px',
          m: 0,
          p: 0,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 11
        }
      }}>
        <DialogTitle sx={{ backgroundColor: '#A3EAFD', display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 0 }}>
          <Typography variant="large">Add Spent Time</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4, pt: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Select Project"
                  fullWidth
                  value={selectedProjectId}
                  onChange={handleProjectChange}
                  SelectProps={{ native: true }}
                    sx={{ '& .MuiOutlinedInput-root': { width: '258px', height: '50px' } }}

                >
                  <option value="" disabled></option>
                  {executiveProjects.length === 0 ? (
                    <option disabled>No projects assigned</option>
                  ) : (
                    executiveProjects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.project_name}
                      </option>
                    ))
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Select Task"
                  fullWidth
                  value={selectedTaskId}
                  onChange={handleTaskChange}
                  SelectProps={{ native: true }}
                  disabled={!selectedProjectId}
                    sx={{ '& .MuiOutlinedInput-root': { width: '258px', height: '50px' } }}

                >
                  <option value="" disabled></option>
                  {tasksList.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.task_name}
                    </option>
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
                  SelectProps={{ native: true }}
                  disabled={!selectedTaskId}
                  error={subTaskError}
                   sx={{
      width: '428px',
      '& .MuiOutlinedInput-root': {
        height: '50px',
        backgroundColor: subTaskError ? '#FED3D3' : 'inherit',
      },
    }}

                >
                  <option value="" disabled></option>
                  {subTasks.length > 0 ? (
                    subTasks.map((subtask) => (
                      <option key={subtask.id} value={subtask.id}>
                        {subtask.subtask_name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No subtasks available</option>
                  )}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleAddSubTask}
                  sx={{
                  width: '5.5rem',
                  height: '3.0rem',
                  textTransform: 'none',
                  fontSize: '0.58rem',
                }}

                >
                  Add Subtask
                </Button>
              </Grid>

              {showExtraField && (
                <Grid item xs={12}>
                  <TextField
                  
                    label="Enter Sub Task"
                    fullWidth
                    value={extraSubTaskName}
                    onChange={(e) => setExtraSubTaskName(e.target.value)}
                     sx={{ width: '525px', height: '2.5rem' }}

                  />
                </Grid>
              )}

              <Grid item xs={6}>
                <TimePicker
                  label="Start Time"
                  value={startDateTime}
                  onChange={setStartDateTime}
                  renderInput={(params) => <TextField {...params} fullWidth  sx={{ width: '250px',mt:2, '& .MuiInputBase-root': { height: '20px' } }}/>}
                  
                />
              </Grid>
              <Grid item xs={6}>
                <TimePicker
                  label="End Time"
                  value={endDateTime}
                  onChange={setEndDateTime}
                  renderInput={(params) => <TextField {...params} fullWidth  sx={{ width: '250px', '& .MuiInputBase-root': { height: '20px' } }}/>}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Comments"
                  multiline
                  rows={3}
                  fullWidth
                  value={comments}sx={{ width: '530px', '& .MuiOutlinedInput-root': { height: '100px' } }}

                  onChange={(e) => setComments(e.target.value)}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center',ml:20 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                    sx={{ width: '12rem', height: '2.5rem', textTransform: 'none' }}

                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default AddSpenttime;