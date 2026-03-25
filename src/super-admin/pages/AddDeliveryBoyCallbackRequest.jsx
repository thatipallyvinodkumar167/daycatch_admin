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
import { genericApi } from "../../api/genericApi";

const AddDeliveryBoyCallbackRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    deliveryBoyName: "",
    deliveryBoyPhone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deliveryBoyName.trim() || !formData.deliveryBoyPhone.trim()) {
      alert("Operational Requirement: Rider Identity and Contact are mandatory.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Using modern camelCase keys - compatible with our upgraded Smart-List
      const payload = {
        deliveryBoyName: formData.deliveryBoyName.trim(),
        deliveryBoyPhone: formData.deliveryBoyPhone.trim(),
        status: "On Queue",
        addedBy: "Admin Management",
        date: new Date().toISOString()
      };
      await genericApi.create("deliveryboycallbackrequests", payload);
      navigate("/delivery-boy-callback-request");
    } catch (error) {
      console.error("Error creating delivery boy callback request:", error);
      alert("Fleet Sync Logic Error: Unable to dispatch assistance ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Header with Navigation */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/delivery-boy-callback-request")} sx={{ mr: 2, bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <ArrowBackIcon sx={{ color: "#4318ff" }} />
        </IconButton>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Rider Assistance Entry
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Log a new field report or emergency callback request for the delivery fleet.
            </Typography>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", p: 4 }}>
        <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 4, borderBottom: "2px solid #f4f7fe", pb: 2 }}>
            Fleet Personnel Details
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                  RIDER NAME
                </Typography>
                <TextField
                  fullWidth
                  name="deliveryBoyName"
                  placeholder="e.g. Vikram Singh (Rider ID: 88)"
                  variant="outlined"
                  value={formData.deliveryBoyName}
                  onChange={handleChange}
                  sx={{ 
                    "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" },
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                  }}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>
                  FIELD MOBILE NUMBER
                </Typography>
                <TextField
                  fullWidth
                  name="deliveryBoyPhone"
                  placeholder="e.g. +91 88765 44321"
                  variant="outlined"
                  value={formData.deliveryBoyPhone}
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
                        onClick={() => navigate("/delivery-boy-callback-request")}
                        sx={{ 
                            color: "#a3aed0", 
                            fontWeight: "800",
                            textTransform: "none",
                            borderRadius: "14px",
                            px: 4
                        }}
                    >
                        Discard Entry
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
                        {isSubmitting ? "Dispatching Logic..." : "Record Assistance Ticket"}
                    </Button>
                </Stack>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddDeliveryBoyCallbackRequest;


