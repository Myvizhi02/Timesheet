import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Button,Box,
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
        payload.sub_task_id = subtaskRes.data.insertId;
      } catch (error) {
        console.error('Error creating custom subtask:', error);
        alert('Failed to create new subtask.');
        return;
      }
    }
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
      <Dialog
  open={open}
  onClose={onClose}
  PaperProps={{
    sx: {
      width: { xs: '90%', sm: '600px' },
       maxWidth: '95vw',
      height: { xs: 'auto', sm: '600px' },
      maxHeight: '90vh',

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
      px: 3,
      py: 1,
    }}
  >
    <Typography fontSize="18px" fontWeight="bold">Add Spent Time</Typography>
    <IconButton onClick={onClose}>
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent dividers sx={{ p: { xs: 2, sm: 4 }, pt: 3, overflowY: 'auto' }}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container rowSpacing={2.5} columnSpacing={3} sx={{ flexWrap: 'wrap' }}>
        <Grid xs={12}>
          <TextField
            select
            label="Select Project"
            fullWidth
            value={selectedProjectId}
            onChange={handleProjectChange}
            SelectProps={{ native: true }}
            sx={{ width: { xs: '250px', sm: '247px' },}}
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

        <Grid xs={12} sm={6}>
          <TextField
            select
            label="Select Task"
           fullWidth
            value={selectedTaskId}
            onChange={handleTaskChange}
            SelectProps={{ native: true }}
            disabled={!selectedProjectId}
           sx={{ width: { xs: '250px', sm: '247px' },}}
          >
            <option value="" disabled></option>
            {tasksList.map((task) => (
              <option key={task.id} value={task.id}>
                {task.task_name}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid  xs={12}>
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
               width: { xs: '250px', sm: '370px' },
              '& .MuiOutlinedInput-root': {
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

        <Grid  xs={12}>
          <Button
            variant="contained"
            onClick={handleAddSubTask}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              width: '120px',
              height:'55px',
              maxWidth: '200px',
            }}
          >
            Add Subtask
          </Button>
        </Grid>

        {showExtraField && (
          <Grid  xs={12}>
            <TextField
              label="Enter Sub Task"
              fullWidth
              value={extraSubTaskName}
              onChange={(e) => setExtraSubTaskName(e.target.value)}
              sx={{ width: { xs: '250px', sm: '520px' },}}
            />
          </Grid>
        )}

    <Grid  xs={12} sm={6}>
  <Box sx={{ width: '250px' }}>
    <TimePicker
      label="Start Time"
      value={startDateTime}
      onChange={setStartDateTime}
      renderInput={(params) => (
        <TextField {...params} fullWidth />
      )}
    />
  </Box>
</Grid>


<Grid  xs={12} sm={6} >
  <Box sx={{ width: '250px' }}>
  <TimePicker
    label="End Time"
    value={endDateTime}
    onChange={setEndDateTime}
    renderInput={(params) => (
      <TextField
        {...params}
       fullWidth
      />
    )}
  /></Box>
</Grid>



        <Grid  xs={12}>
          <TextField
            label="Comments"
            multiline
            rows={3}
            fullWidth
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            sx={{ width: { xs: '250px', sm: '520px' },}}
          />
        </Grid>

        <Grid  xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              ml: { xs: 15, sm:25},
              width: { xs: '100%', sm: '200px' },
              height: '2.5rem',
              textTransform: 'none',
            }}
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