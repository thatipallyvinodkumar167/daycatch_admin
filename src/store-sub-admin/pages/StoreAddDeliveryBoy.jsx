import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  TextField,
  Button,
  MenuItem,
  IconButton,
  alpha,
  Divider,
} from "@mui/material";
import {
  ArrowBack as BackIcon,
  CloudUpload as UploadIcon,
  Person as PersonIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";

const StoreAddDeliveryBoy = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    city: "",
    idType: "",
    idNumber: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2", borderRadius: "14px" }}>
            <BackIcon />
          </IconButton>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Add Delivery Boy
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
               Onboard a new delivery partner for {store.name}.
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: 5, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
          <Grid container spacing={4}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Boy Name</Typography>
                  <TextField fullWidth name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Boy Phone</Typography>
                  <TextField fullWidth name="phone" placeholder="Enter mobile number" value={formData.phone} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Password</Typography>
                  <TextField fullWidth type="password" name="password" placeholder="Create login password" value={formData.password} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Select City</Typography>
                  <TextField select fullWidth name="city" value={formData.city} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }}>
                    <MenuItem value="">Select City</MenuItem>
                    <MenuItem value="Hyderabad">Hyderabad</MenuItem>
                    <MenuItem value="Bangalore">Bangalore</MenuItem>
                  </TextField>
                </Box>
              </Stack>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Select ID</Typography>
                  <TextField select fullWidth name="idType" value={formData.idType} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }}>
                    <MenuItem value="">Select ID</MenuItem>
                    <MenuItem value="Aadhar">Aadhar Card</MenuItem>
                    <MenuItem value="Voter">Voter ID</MenuItem>
                    <MenuItem value="DL">Driving License</MenuItem>
                  </TextField>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>ID Number</Typography>
                  <TextField fullWidth name="idNumber" placeholder="Enter ID number" value={formData.idNumber} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>ID Image</Typography>
                  <Box sx={{ border: "2px dashed #e0e5f2", borderRadius: "16px", p: 3, textAlign: "center", bgcolor: "#fcfcfc" }}>
                    <UploadIcon sx={{ color: "#d1d9e2", mb: 1 }} />
                    <Typography variant="caption" sx={{ display: "block", mb: 1, color: "#a3aed0", fontWeight: 700 }}>No file chosen</Typography>
                    <Button size="small" variant="outlined" sx={{ borderRadius: "10px", fontWeight: 800, textTransform: "none" }}>Choose file</Button>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Boy Address</Typography>
                  <TextField fullWidth multiline rows={2} name="address" placeholder="Enter a location" value={formData.address} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 5, borderColor: "#eef2f6" }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="text"
              onClick={() => navigate(-1)}
              sx={{ color: "#707eae", fontWeight: 800, px: 4 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ borderRadius: "16px", py: 2, px: 6, bgcolor: "#4318ff", fontWeight: 900, boxShadow: "0 10px 25px rgba(67,24,255,0.2)" }}
            >
              Register Delivery Boy
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default StoreAddDeliveryBoy;
