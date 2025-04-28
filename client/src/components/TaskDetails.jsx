{tabIndex === 2 && (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        {/* Row 1 */}
        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Project Name
          </Typography>
          <Typography fontWeight={500}>
            {formData.project || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Task Name
          </Typography>
          <Typography fontWeight={500}>
            {formData.taskname || 'N/A'}
          </Typography>
        </Grid>
  
        {/* Row 2 */}
        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Task Description
          </Typography>
          <Typography fontWeight={500}>
            {formData.description || 'N/A'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Sub Task
          </Typography>
          <Typography fontWeight={500}>
            {task.subTask || 'Generate Ticket for all sources'}
          </Typography>
        </Grid>
  
        {/* Row 3 */}
        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Sub Task Description
          </Typography>
          <Typography fontWeight={500}>
            {task.subTaskDescription || 'To Create ticket what ever the source'}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Task Status
          </Typography>
          <Typography fontWeight={500}>
            {formData.status ? 'Open' : 'Closed'}
          </Typography>
        </Grid>
  
        {/* Row 4 */}
        <Grid item xs={6}>
          <Typography fontSize={14} color="text.secondary">
            Sub Task Status
          </Typography>
          <Typography fontWeight={500}>
            {task.subTaskStatus || 'Open'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )}
  