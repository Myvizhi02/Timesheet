import React from "react";
import { Box, TextField, Button, Typography, Grid, Paper } from "@mui/material";
import { makeStyles } from '@mui/styles';
import timeIcon from "../assets/time.png";
import image from "../assets/bgimg.png";

const useStyles = makeStyles(() => ({
  loginContainer: {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginCard: {
    display: "flex",
    flexDirection: "row",
    borderRadius: 16,
    boxShadow: "0px 8px 20px rgba(223, 220, 221, 0.2)",
    maxWidth: "90%",
    width: "70%",
  },
  loginLeft: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f7ff",
    padding: 2,
  },
  loginImage: {
    width: "100%",
  },
  loginRight: {
    flex: 2,
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1rem",
  },
  loginHeading: {
    marginBottom: "1rem",
    color: "#3758f9",
  },
  loginButton: {
    marginTop: "1rem",
    backgroundColor: "#3758f9",
    color: "#fff",
    borderRadius: "8px",
    width: "100%",
    fontSize: "1rem",
    "&:hover": {
      backgroundColor: "#2c47c5",
    },
  },
  loginTextField: {
    marginBottom: "1rem",
    borderRadius: "8px",
    padding: "0.70rem",
  },
}));

function Login() {
  const classes = useStyles();

  return (
    <Box className={classes.loginContainer}>
      <Paper className={classes.loginCard}>
        {/* Left Side Image */}
        <Box className={classes.loginLeft}>
          <img src={timeIcon} alt="Time Icon" className={classes.loginImage} />
        </Box>

        {/* Right Side Form */}
        <Box className={classes.loginRight}>
          <Typography variant="h5" className={classes.loginHeading} fontWeight="bold">
            Welcome to Timesheet
          </Typography>

          {/* Form Fields */}
          <TextField
            label="Employee ID"
            variant="outlined"
            fullWidth
            className={classes.loginTextField}
            placeholder="Enter your Employee ID"
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            className={classes.loginTextField}
            placeholder="Enter your password"
          />
          <Button variant="contained" className={classes.loginButton}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
