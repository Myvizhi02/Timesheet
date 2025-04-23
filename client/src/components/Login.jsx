import React, { useState } from "react";
import { Box, Button, Typography, Paper, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import timeIcon from "../assets/time.png";
import image from "../assets/bgimg.png";

// Styling the TextField
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
  const [agentId, setAgentId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!agentId.trim() || !password.trim()) {
      alert('Please fill in both Agent ID and Password.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3030/login', {
        agent_id: agentId.trim(),
        password: password.trim(),
      });

      if (response.data.name) {
        localStorage.setItem('name', response.data.name); // Store name in localStorage
        localStorage.setItem('agentId', agentId.trim()); // Store agentId in localStorage
      }

      if (response.data.redirectTo) {
        navigate(response.data.redirectTo); // Navigate to the dashboard or next page
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed: ' + (error.response?.data || 'Unknown error'));
      setPassword(''); // Clear password after failed login
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Box sx={{
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Paper elevation={10} sx={{
        display: "flex", borderRadius: 5, overflow: "hidden", maxWidth: 1000, width: "90%",
      }}>
        <Box sx={{
          flex: 1, display: "flex", justifyContent: "center", alignItems: "center", px: 2, backgroundColor: "#f5f7ff",
        }}>
          <img src={timeIcon} alt="Time Icon" style={{ width: "100%", maxWidth: 400 }} />
        </Box>

        <Box sx={{
          flex: 1, backgroundColor: "white", display: "flex", flexDirection: "column", justifyContent: "center", px: 6, py: 8,
        }}>
          <Typography variant="h4" fontWeight="bold" color="#3758f9" sx={{ mb: 4 }}>
            Welcome to Timesheet
          </Typography>

          <CssTextField label="Employee ID" placeholder="Enter your Employee ID" variant="standard" fullWidth value={agentId} onChange={(e) => setAgentId(e.target.value)} sx={{ mb: 4 }} />
          <CssTextField label="Password" type="password" placeholder="Enter your password" variant="standard" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 4 }} />

          <Button variant="contained" onClick={handleLogin} disabled={loading} sx={{
            mt: 1, backgroundColor: "#3758f9", color: "#fff", borderRadius: "8px", fontSize: "1rem", textTransform: "none", padding: "0.75rem", '&:hover': {
              backgroundColor: "#2c47c5",
            },
          }} fullWidth>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
