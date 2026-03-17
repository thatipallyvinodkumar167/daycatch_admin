import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AddRedeemValue = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rewardPoints: "",
    redeemValue: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rewardPoints || !formData.redeemValue) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("https://jsonplaceholder.typicode.com/posts", formData);
      alert("Redeem value added successfully!");
      navigate("/redeem-value");
    } catch (error) {
      console.error("Error adding redeem value:", error);
      alert("Failed to add redeem value.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Button onClick={() => navigate(-1)} sx={{ minWidth: "auto", color: "#2b3674" }}>
          <ArrowBackIcon />
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">Add Redeem Value</Typography>
          <Typography variant="body1" color="textSecondary">Set the monetary value for reward points.</Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "15px", p: 4, maxWidth: "600px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body1" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Reward Points</Typography>
              <TextField
                fullWidth
                name="rewardPoints"
                type="number"
                placeholder="Enter points count..."
                value={formData.rewardPoints}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, backgroundColor: "#fff" }}
              />
            </Box>
            
            <Box>
              <Typography variant="body1" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Redeem Values (₹)</Typography>
              <TextField
                fullWidth
                name="redeemValue"
                type="number"
                placeholder="Enter monetary value..."
                value={formData.redeemValue}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, backgroundColor: "#fff" }}
              />
            </Box>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button 
                type="submit"
                variant="contained" 
                disabled={isSubmitting}
                sx={{ 
                  backgroundColor: "#2d60ff", 
                  "&:hover": { backgroundColor: "#2046cc" },
                  borderRadius: "10px",
                  textTransform: "none",
                  px: 4,
                  py: 1.5,
                  fontWeight: "700",
                  fontSize: "15px"
                }}
              >
                {isSubmitting ? "Saving..." : "Save Redeem Value"}
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate(-1)} 
                sx={{ 
                  borderRadius: "10px", 
                  textTransform: "none", 
                  px: 4,
                  borderColor: "#d1d5db",
                  color: "#475467" 
                }}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddRedeemValue;
