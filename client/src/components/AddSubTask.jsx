import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

const AddSubTask = ({
  onClose,
  onSubmit,
  projectId,
  project,
  taskList = [],
  taskName,
  taskId,
  onAddTaskWithoutClose,
  existingSubtasks = []
}) => {
  // States
  const [selectedTaskId, setSelectedTaskId] = useState(taskId || '');
  const [selectedTaskName, setSelectedTaskName] = useState(taskName || '');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(true);
  const [subtask, setSubtask] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [subtaskCounter, setSubtaskCounter] = useState(1);
  const [taskNameList, setTaskNameList] = useState([]);
useEffect(() => {
  if (taskNameList.length > 0) {
    setSelectedTaskName(taskNameList[0].task_name);
  }
}, [taskNameList]);
  // Fetch tasks when projectId changes
//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await fetch(`http://localhost:3030/api/tasks/by-project/${projectId}`);
//         const data = await res.json();
//         console.log("Fetched tasks:", data);
// console.log('taskNameList:', taskNameList);
// console.log('selectedTaskId:', selectedTaskId);

//         if (res.ok) {
//           setTaskNameList(data);

//           if (!selectedTaskId && data.length > 0) {
//             setSelectedTaskId(data[0].id);
//             setSelectedTaskName(data[0].task_name);
//           }
//         } else {
//           showSnackbar(`❌ Failed to fetch tasks: ${data.error || 'Unknown error'}`, 'error');
//         }
//       } catch (error) {
//         console.error(error);
//         showSnackbar('❌ Failed to fetch tasks: Network error or server is down', 'error');
//       }
//     };

//     if (projectId) {
//       fetchTasks();
//     }
//   }, [projectId]);
useEffect(() => {
  if (projectId) {
    fetch(`http://localhost:3030/api/tasks/by-project/${projectId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Fetched tasks:', data);
        setTaskNameList(data);
      })
      .catch(e => console.error(e));
  }
}, [projectId]);
useEffect(() => {
  if (taskNameList.length > 0) {
    setSelectedTaskId(taskNameList[0].id);
    setSelectedTaskName(taskNameList[0].task_name);
  }
}, [taskNameList]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAddSubTask = async () => {
    if (!subtask || !description) {
      showSnackbar("⚠ Please fill all the required fields.", "warning");
      return;
    }
    const crm_log_id = localStorage.getItem('crm_log_id');
    const statusValue = status ? 1 : 2;

    const selectedIdToUse = selectedTaskId || taskId;

    const subTaskData = {
      project_id: projectId,
      task_id: selectedIdToUse,
      sub_task_name: subtask,
      description,
      status: statusValue,
      created_by: crm_log_id,
      modified_by: crm_log_id,
    };
    try {
      const res = await fetch('http://localhost:3030/api/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subTaskData),
      });

      const result = await res.json();

      if (res.ok) {
        showSnackbar('✅ SubTask added successfully!', 'success');
        setSubtask('');
        setDescription('');
        setSubtaskCounter(prev => prev + 1);
        if (onAddTaskWithoutClose) onAddTaskWithoutClose();
      } else {
        showSnackbar(`❌ Failed to add subtask: ${result.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      showSnackbar('❌ Failed to add subtask: Network error or server is down', 'error');
      console.error(error);
    }
  };

  const handleSubmit = async () => {
  if (!subtask || !description) {
    showSnackbar("⚠ Please fill all the required fields.", "warning");
    return;
  }

  const crm_log_id = localStorage.getItem('crm_log_id');
  if (!crm_log_id) {
    showSnackbar("⚠ User not logged in or crm_log_id missing.", "warning");
    return;
  }

  const statusValue = status ? 1 : 2;
  const selectedIdToUse = selectedTaskId || taskId;

  if (!selectedIdToUse) {
    showSnackbar("⚠ Please select a valid task.", "warning");
    return;
  }

  const subTaskData = {
    project_id: projectId,
    task_id: selectedIdToUse,
    sub_task_name: subtask,
    description,
    status: statusValue,
    created_by: crm_log_id,
    modified_by: crm_log_id,
  };

  console.log("Sending subtask data:", subTaskData);

  try {
    const res = await fetch('http://localhost:3030/api/subtasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subTaskData),
    });

    const result = await res.json();

    if (res.ok) {
      showSnackbar('✅ SubTask added successfully!', 'success');
      setSubtask('');
      setDescription('');
      if (onSubmit) onSubmit();
    } else {
      showSnackbar(`❌ Failed to add subtask: ${result.error || 'Unknown error'}`, 'error');
    }
  } catch (error) {
    showSnackbar('❌ Failed to add subtask: Network error or server is down', 'error');
    console.error(error);
  }
};

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '90%', sm: '500px', md: '602px' },
            height: { xs: '90%', sm: '50%', md: '597px' },
            maxWidth: '95vw',
            maxHeight: '95vh',
            borderRadius: '12px',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#A3EAFD',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1px 20px',
          }}
        >
          <Typography fontSize="18px" fontWeight="bold">
            Add Sub Task
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: { xs: 2, sm: 3, md: 4 },
            overflow: 'auto',
          }}
        >
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} pt={4}>
            <TextField
              label="Project"
              fullWidth
              value={project}
              disabled
              InputProps={{ readOnly: true }}
              sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
            />
{taskNameList.length > 0 ? (
  <TextField
    select
    label="Task Name"
    fullWidth
    value={selectedTaskId || ''}
   onChange={(e) => {
  const selectedValue = e.target.value;
  const selectedId = selectedValue === '' ? null : Number(selectedValue);
  setSelectedTaskId(selectedId);
  console.log(selectedId);

  const selectedTask = taskNameList.find(task => task.id === selectedId);
  if (selectedTask) {
    setSelectedTaskName(selectedTask.task_name);
    console.log(selectedTask);
  } else {
    console.log('No matching task found for id:', selectedId);
    setSelectedTaskName('');
  }
}}

    sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
  >
    {taskNameList.map(task => (
      <MenuItem key={task.id} value={task.id}>
        {task.task_name}
      </MenuItem>
    ))}
  </TextField>
) : (
  <TextField
    label="Task Name"
    fullWidth
    value={taskName}
    disabled
    InputProps={{ readOnly: true }}
    placeholder="Add a task first"
    sx={{ '& .MuiOutlinedInput-root': { height: '40px' } }}
  />
)}


          </Box>

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              label={`Enter SubTask ${subtaskCounter}`}
              value={subtask}
              onChange={(e) => setSubtask(e.target.value)}
              sx={{ width: { xs: '100%', sm: '260px' }, '& .MuiOutlinedInput-root': { height: '40px' } }}
            />
            <TextField
              label="Status"
              variant="outlined"
              value={status ? 'Open' : 'Closed'}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Box
                      onClick={() => setStatus(!status)}
                      sx={{
                        width: { xs: '40px', sm: '40px' },
                        height: '20px',
                        backgroundColor: status ? '#3DC1F2' : '#ccc',
                        borderRadius: '20px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s',
                        mr: { xs: 1, sm: 4 },
                      }}
                    >
                      <Box
                        sx={{
                          height: '16px',
                          width: { xs: '17px', sm: '17px' },
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: '2px',
                          left: status ? '20px' : '3px',
                          transition: 'left 0.3s',
                        }}
                      />
                    </Box>
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: '100%', sm: '260px' },
                '& .MuiOutlinedInput-root': { height: '40px' },
              }}
            />
          </Box>

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{
              width: { xs: '100%', sm: '100%' },
            }}
          />

          <Box display="flex" justifyContent="center" mt="auto" gap={3}>
            <Button
              variant="contained"
              onClick={handleAddSubTask}
              sx={{
                backgroundColor: '#3758f9',
                paddingX: 5,
                paddingY: 1,
                textTransform: 'none',
                width: { xs: '90%', sm: 'auto' },
                '&:hover': { backgroundColor: '#2c47c5' },
              }}
            >
              Add SubTask
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#3758f9',
                paddingX: 5,
                paddingY: 1,
                textTransform: 'none',
                width: { xs: '90%', sm: 'auto' },
                '&:hover': { backgroundColor: '#2c47c5' },
              }}
            >
              Submit
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddSubTask;
