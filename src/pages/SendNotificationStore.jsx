import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Grid,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CampaignIcon from "@mui/icons-material/Campaign";
import axios from "axios";

const SendNotificationStore = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    targetStore: "all",
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
      alert("Notification sent to selected stores successfully!");
      setFormData({ title: "", message: "", targetStore: "all" });
    } catch (error) {
      console.error("Error sending store notification:", error);
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
          Send internal push notifications and alerts to store owners.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Target Stores</Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="targetStore"
                                    value={formData.targetStore}
                                    onChange={handleChange}
                                    sx={{ borderRadius: "10px" }}
                                >
                                    <MenuItem value="all">All Stores</MenuItem>
                                    <MenuItem value="active">Active Stores Only</MenuItem>
                                    <MenuItem value="pending">Pending Approval Stores</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Subject / Title</Typography>
                            <TextField
                                fullWidth
                                name="title"
                                placeholder="e.g. System Maintenance Update"
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Message Content</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                name="message"
                                placeholder="Enter the detailed instruction or update for store owners..."
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
                            {isSubmitting ? "Sending..." : "Notify Stores"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: "20px", backgroundColor: "#333", color: "#fff" }}>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                    <StorefrontIcon /> Store App Preview
                </Typography>
                
                <Box sx={{ p: 3, backgroundColor: "#444", borderRadius: "15px", border: "1px solid #555" }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <CampaignIcon sx={{ color: "#2d60ff" }} />
                        <Typography variant="caption" fontWeight="700">ADMIN UPDATE</Typography>
                    </Stack>
                    <Typography variant="body1" fontWeight="700" sx={{ mb: 1 }}>
                        {formData.title || "Subject Title"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6" }}>
                        {formData.message || "The message content for the store manager will appear here..."}
                    </Typography>
                </Box>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="caption" color="rgba(255,255,255,0.5)">
                        * This notification will be delivered to the primary contact of the store via their management dashboard and push notification.
                    </Typography>
                </Box>
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SendNotificationStore;