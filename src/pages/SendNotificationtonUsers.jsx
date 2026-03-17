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
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import CampaignIcon from "@mui/icons-material/Campaign";
import axios from "axios";

const SendNotificationUsers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "Promotional",
    imageUrl: "",
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
      alert("Notification broadcasted to all users successfully!");
      setFormData({ title: "", message: "", type: "Promotional", imageUrl: "" });
    } catch (error) {
      console.error("Error sending notification:", error);
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
          Broadcast push notifications to your customers.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Notification Title</Typography>
                            <TextField
                                fullWidth
                                name="title"
                                placeholder="e.g. Weekend Flash Sale! ⚡"
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Notification Type</Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    sx={{ borderRadius: "10px" }}
                                >
                                    <MenuItem value="Promotional">Promotional</MenuItem>
                                    <MenuItem value="Alert">Transactional/Alert</MenuItem>
                                    <MenuItem value="Update">App Update</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Message Content</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="message"
                                placeholder="Write your notification message here..."
                                value={formData.message}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Image URL (Optional)</Typography>
                            <TextField
                                fullWidth
                                name="imageUrl"
                                placeholder="https://example.com/banner.jpg"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ImageIcon sx={{ color: "#a3aed0" }} />
                                        </InputAdornment>
                                    ),
                                }}
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
                            {isSubmitting ? "Sending..." : "Send Notification"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
                Live Preview
            </Typography>
            <Box 
                sx={{ 
                    width: "300px", 
                    mx: "auto", 
                    borderRadius: "30px", 
                    border: "8px solid #333", 
                    height: "500px", 
                    backgroundColor: "#000",
                    position: "relative",
                    overflow: "hidden"
                }}
            >
                {/* Status Bar */}
                <Box sx={{ p: 1, display: "flex", justifyContent: "space-between", color: "#fff", fontSize: "10px" }}>
                    <Typography fontSize="10px">9:41</Typography>
                    <Typography fontSize="10px">🔋 100%</Typography>
                </Box>
                
                {/* Notification Card */}
                <Box 
                    sx={{ 
                        m: 2, 
                        p: 2, 
                        backgroundColor: "rgba(255,255,255,0.9)", 
                        borderRadius: "15px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                        backdropFilter: "blur(5px)"
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <CampaignIcon sx={{ fontSize: "16px", color: "#2d60ff" }} />
                        <Typography variant="caption" fontWeight="700" color="#2d60ff">DAY CATCH</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ ml: "auto" }}>now</Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight="700" color="#1b2559" noWrap>
                        {formData.title || "Your Title Here"}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ 
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                    }}>
                        {formData.message || "Start typing to see the message preview..."}
                    </Typography>
                    {formData.imageUrl && (
                        <Box 
                            component="img"
                            src={formData.imageUrl}
                            onError={(e) => e.target.style.display = 'none'}
                            sx={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px", mt: 1 }}
                        />
                    )}
                </Box>
            </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SendNotificationUsers;