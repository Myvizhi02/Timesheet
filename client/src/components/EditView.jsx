import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Box
} from '@mui/material';

const EditTaskDialog = ({ open, onClose }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [formData, setFormData] = useState({
    project: 'Winfast',
    taskName: 'Merge JD and Core',
    description: 'Uniting Core and JD',
    status: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = () => {
    setFormData((prev) => ({ ...prev, status: !prev.status }));
  };

  const handleUpdate = () => {
    console.log('Updated data:', formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: '#e0f7fa' }}>Actions</DialogTitle>
      <DialogContent>
        <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Edit Task" />
          <Tab label="Sub-Task" />
          <Tab label="Task Details" />
        </Tabs>

        {tabIndex === 0 && (
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Project"
                  name="project"
                  fullWidth
                  variant="outlined"
                  value={formData.project}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Task Name"
                  name="taskName"
                  fullWidth
                  variant="outlined"
                  value={formData.taskName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch checked={formData.status} onChange={handleSwitchChange} />}
                  label={formData.status ? 'Open' : 'Closed'}
                />
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{ backgroundColor: '#002884', px: 4 }}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Add content for "Sub-Task" and "Task Details" tabs here */}
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
