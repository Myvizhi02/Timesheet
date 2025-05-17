import { Box, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImg from "../assets/bgimg.png";
import timeIcon from "../assets/time.png";

// Custom styled TextField with MUI styles
const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#3758f9',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#bfc7d2',
    },
    '&:hover fieldset': {
      borderColor: '#3758f9',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3758f9',
    },
  },
});

const Login = () => {
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!agentId.trim() || !password.trim()) {
      alert('Please enter both Employee ID and Password.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3030/login', {
        agent_id: agentId.trim(),
        password: password.trim(),
      });

      const { crm_log_id, name, redirectTo, admin_flag } = res.data;

      if (crm_log_id && name) {
        // Save login info and role in localStorage (or sessionStorage)
        localStorage.setItem('crm_log_id', crm_log_id);
        localStorage.setItem('name', name);
        localStorage.setItem('agentId', agentId.trim());
        localStorage.setItem('admin_flag', admin_flag); // Store admin_flag for route protection

        // Redirect based on backend's redirectTo or default
        navigate(redirectTo || '/dashboard');
      } else {
        alert('Invalid login details.');
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data?.error || err.message);
      alert('Login failed: ' + (err.response?.data?.error || 'Unknown error'));
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          borderRadius: 4,
          overflow: 'hidden',
          width: { xs: '90%', md: '70%', lg: '55%' },
          maxWidth: 1000,
        }}
      >
        {/* Left side image */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#f5f7ff',
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <img src={timeIcon} alt="Time Icon" style={{ width: "80%", maxWidth: "300px" }} />
        </Box>

        {/* Right side form */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 4, md: 6 },
          }}
        >
          <Typography
            variant="h4"
            color="#3758f9"
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            Timesheet Login
          </Typography>

          <StyledTextField
            label="Employee ID"
            variant="outlined"
            fullWidth
            sx={{ mb: 3 }}
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
          />

          <StyledTextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            sx={{ mb: 4 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: '#3758f9',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: 2,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#2c47c5',
              },
            }}
            onClick={handleLogin}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : "Login"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
