import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  IconButton,
  Grid
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const AddStoreCallbackRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: "",
    storePhone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.storeName.trim() || !formData.storePhone.trim()) {
      alert("Missing Required Fields: Merchant Name and Phone are essential.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Using modern camelCase keys - compatible with our upgraded Smart-List
      const payload = {
        storeName: formData.storeName.trim(),
        storePhone: formData.storePhone.trim(),
        status: "Pending Support",
        date: new Date().toISOString()
      };
      await genericApi.create("storecallbackrequests", payload);
      navigate("/store-callback-request");
    } catch (error) {
      console.error("Error creating store callback request:", error);
      alert("Verification Failed: Unable to synchronize partner request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Header with Navigation */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/store-callback-request")} sx={{ mr: 2, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <ArrowBackIcon sx={{ color: "#4318ff" }} />
        </IconButton>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Log Merchant Assistance
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Initiate a new support request for your store partners into the operational pipeline.
            </Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", p: 4 }}>
        <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 4, borderBottom: "2px solid #f4f7fe", pb: 2 }}>
            Merchant / Partner Identity
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                  STORE / TRADING NAME
                </Typography>
                <TextField
                  fullWidth
                  name="storeName"
                  placeholder="e.g. Ocean Delights Store #402"
                  variant="outlined"
                  value={formData.storeName}
                  onChange={handleChange}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                  }}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                  PRIMARY MERCHANT CONTACT
                </Typography>
                <TextField
                  fullWidth
                  name="storePhone"
                  placeholder="e.g. +91 91234 56789"
                  variant="outlined"
                  value={formData.storePhone}
                  onChange={handleChange}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                  }}
                />
            </Grid>

            <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button 
                        onClick={() => navigate("/store-callback-request")}
                        sx={{ 
                            color: "#a3aed0", 
                            fontWeight: "800",
                            textTransform: "none",
                            borderRadius: "14px",
                            px: 4
                        }}
                    >
                        Cancel Ticket
                    </Button>
                    <Button 
                        type="submit"
                        variant="contained" 
                        disabled={isSubmitting}
                        startIcon={<SendIcon />}
                        sx={{ 
                            backgroundColor: "#4318ff", 
                            "&:hover": { backgroundColor: "#3311cc" },
                            borderRadius: "14px",
                            textTransform: "none",
                            px: 6,
                            py: 1.5,
                            fontWeight: "800",
                            boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                        }}
                    >
                        {isSubmitting ? "Syncing Logic..." : "Dispatch Assistance"}
                    </Button>
                </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddStoreCallbackRequest;
