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
 
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import timeIcon from "../assets/time.png";  // Left side illustration
import image from "../assets/bgimg.png";   // Full background

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#A0AAB4',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
});

const Login = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          display: "flex",
          borderRadius: 5,
          overflow: "hidden",
          maxWidth: 1000,
          width: "90%",
        }}
      >
        {/* Left Side - Illustration */}
        <Box
          sx={{
            flex: 1,
            
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
          }}
        >
          <img
            src={timeIcon}
            alt="Time Icon"
            style={{ width: "100%", maxWidth: 400 }}
          />
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: 6,
            py: 8,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#3758f9"
            sx={{ mb: 4 }}
          >
            Welcome to Timesheet
          </Typography>

          <CssTextField
            label="Employee ID"
            placeholder="Enter your Employee ID"
            variant="standard"
            fullWidth
            sx={{ mb: 4 }}
          />
          <CssTextField
            label="Password"
            type="password"
            placeholder="Enter your password"
            variant="standard"
            fullWidth
            sx={{ mb: 4 }}
          />

          <Button
            variant="contained"
            sx={{
              mt: 1,
              backgroundColor: "#3758f9",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "1rem",
              textTransform: "none",
              padding: "0.75rem",
              '&:hover': {
                backgroundColor: "#2c47c5",
              },
            }}
            fullWidth
          >

            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
