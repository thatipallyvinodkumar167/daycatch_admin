import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CampaignIcon from "@mui/icons-material/Campaign";
import axios from "axios";

const SendNotificationDriver = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      alert("Title and Message are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("https://jsonplaceholder.typicode.com/posts", formData);
      alert("Notification broadcasted to all drivers successfully!");
      setFormData({ title: "", message: "" });
    } catch (error) {
      console.error("Error sending driver notification:", error);
      alert("Failed to send notification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Broadcast alerts and operational updates to the delivery fleat.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Alert Title</Typography>
                            <TextField
                                fullWidth
                                name="title"
                                placeholder="e.g. Heavy Rain Alert - Exercise Caution 🌧️"
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Message to Drivers</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                name="message"
                                placeholder="Enter operational instructions or safety alerts..."
                                value={formData.message}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                        </Box>

                        <Button 
                            type="submit"
                            variant="contained" 
                            disabled={isSubmitting}
                            startIcon={<SendIcon />}
                            sx={{ 
                                backgroundColor: "#2d60ff", 
                                "&:hover": { backgroundColor: "#2046cc" },
                                borderRadius: "10px",
                                py: 1.5,
                                textTransform: "none",
                                fontWeight: "700",
                                fontSize: "16px",
                                boxShadow: "0 4px 12px rgba(45, 96, 255, 0.3)"
                            }}
                        >
                            {isSubmitting ? "Broadcasting..." : "Send to All Drivers"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: "20px", backgroundColor: "#000", color: "#fff", position: "relative" }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                    <DeliveryDiningIcon sx={{ color: "#2d60ff" }} /> Driver App Preview
                </Typography>
                
                <Box sx={{ 
                    backgroundColor: "rgba(255,255,255,0.1)", 
                    borderRadius: "15px", 
                    p: 2, 
                    border: "1px solid rgba(255,255,255,0.2)",
                    position: "relative"
                }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <CampaignIcon sx={{ color: "#ff4d49", fontSize: "18px" }} />
                        <Typography variant="caption" fontWeight="800" sx={{ color: "#ff4d49", letterSpacing: "1px" }}>CRITICAL ALERT</Typography>
                    </Stack>
                    <Typography variant="subtitle1" fontWeight="800" sx={{ mb: 0.5 }}>
                        {formData.title || "Safety Update"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
                        {formData.message || "Important operational details will appear here for the drivers to acknowledge..."}
                    </Typography>
                </Box>

                <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
                    <Box 
                        sx={{ 
                            px: 3, 
                            py: 1, 
                            borderRadius: "20px", 
                            backgroundColor: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)"
                        }}
                    >
                        <Typography variant="caption">ACKNOWLEDGE</Typography>
                    </Box>
                </Box>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SendNotificationDriver;