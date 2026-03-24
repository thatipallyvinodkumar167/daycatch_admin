import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  FormControlLabel,
  Switch
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api/usersApi";

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    isVerified: true
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone) {
      alert("Validation Error: Name and Phone are required.");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        "User Name": formData.name,
        "User Email": formData.email,
        "User Phone": formData.phone,
        "Is Verified": formData.isVerified,
        "Registration Date": new Date().toISOString()
      };
      
      await createUser(payload);
      alert("User registered successfully.");
      navigate("/user-data");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user. API Error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 3 }}>
        <Tooltip title="Back to User Management">
            <IconButton onClick={() => navigate("/user-data")} sx={{ backgroundColor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", borderRadius: "14px", p: 1.5 }}>
                <ArrowBackIcon sx={{ color: "#4318ff" }} />
            </IconButton>
        </Tooltip>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Add New User
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Register a new user profile manually into the system.
            </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 5, borderRadius: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", maxWidth: 800, mx: "auto", bgcolor: "#fff" }}>
        
        <Grid container spacing={4}>
          <Grid item xs={12}>
              <Box>
                <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>FULL NAME</Typography>
                <TextField 
                    fullWidth 
                    placeholder="e.g. John Doe"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                />
              </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>PHONE NUMBER</Typography>
                <TextField 
                    fullWidth 
                    placeholder="e.g. 9876543210"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                />
              </Box>
          </Grid>

          <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>EMAIL ADDRESS (OPTIONAL)</Typography>
                <TextField 
                    fullWidth 
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }} 
                />
              </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ p: 3, border: "2px dashed #e0e5f2", borderRadius: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fcfdff" }}>
              <Box>
                  <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Account Verification</Typography>
                  <Typography variant="body2" color="#a3aed0" fontWeight="600">Marking this true will bypass the standard OTP validation process.</Typography>
              </Box>
              <FormControlLabel
                control={<Switch checked={formData.isVerified} onChange={e => setFormData({...formData, isVerified: e.target.checked})} color="primary" />}
                label={formData.isVerified ? "Verified" : "Unverified"}
                labelPlacement="start"
                sx={{ m: 0, "& .MuiTypography-root": { fontWeight: "800", color: formData.isVerified ? "#4318ff" : "#a3aed0", mr: 1 } }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
              <Divider sx={{ mb: 4, opacity: 0.1 }} />
              <Button 
                variant="contained" 
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ 
                    backgroundColor: "#4318ff", "&:hover": { backgroundColor: "#3311cc" }, borderRadius: "18px", px: 8, py: 2, 
                    fontWeight: "800", textTransform: "none", fontSize: "1.1rem", boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                }}
              >
                {loading ? "Registering User..." : "Add User"}
              </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddUser;
