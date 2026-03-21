import React, { useState, useRef } from "react";
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
  Snackbar,
  Alert
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CampaignIcon from "@mui/icons-material/Campaign";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { genericApi } from "../api/genericApi";

const SendNotificationDriver = () => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    selectDeliveryBoys: "all",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 1000 * 1024; // 1000 KB
    if (file.size > maxSize) {
      setSnackbar({ open: true, message: "Image size exceeds 1000 KB. Please choose a smaller file.", severity: "error" });
      e.target.value = "";
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      setSnackbar({ open: true, message: "Title and Message are required.", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.create("driver_notifications", {
        ...formData,
        image: imageFile ? imageFile.name : null,
      });
      setSnackbar({ open: true, message: "Notification broadcasted to delivery boys successfully!", severity: "success" });
      setFormData({ selectDeliveryBoys: "all", title: "", message: "" });
      removeImage();
    } catch (error) {
      console.error("Error sending driver notification:", error);
      setSnackbar({ open: true, message: "Failed to send notification.", severity: "error" });
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
                <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
                    Notification to Driver
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        
                        {/* Select Delivery Boys */}
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                                Select Delivery Boys
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="selectDeliveryBoys"
                                    value={formData.selectDeliveryBoys}
                                    onChange={handleChange}
                                    sx={{ borderRadius: "10px" }}
                                >
                                    <MenuItem value="all">All Delivery Boys</MenuItem>
                                    <MenuItem value="active">Active/On-Duty Boys</MenuItem>
                                    <MenuItem value="inactive">Off-Duty Boys</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Title */}
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                                Title
                            </Typography>
                            <TextField
                                fullWidth
                                name="title"
                                placeholder="e.g. Heavy Rain Alert - Exercise Caution 🌧️"
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                        </Box>

                        {/* Message */}
                        <Box>
                            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                                Message
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="message"
                                placeholder="Enter operational instructions or safety alerts..."
                                value={formData.message}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                            />
                        </Box>

                        {/* Image Upload */}
                        <Box>
                          <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                            Image{" "}
                            <Typography component="span" variant="caption" color="textSecondary">
                              (Max. Size 1000 KB)
                            </Typography>
                          </Typography>

                          <Box
                            sx={{
                              border: "2px dashed #d0d7f0",
                              borderRadius: "12px",
                              p: 2.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              backgroundColor: "#f8f9ff",
                              cursor: "pointer",
                              "&:hover": { borderColor: "#2d60ff", backgroundColor: "#f0f4ff" },
                              transition: "all 0.2s ease",
                            }}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: "10px",
                                backgroundColor: "#e0e7ff",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <ImageIcon sx={{ color: "#2d60ff", fontSize: "24px" }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="600" color="#1b2559">
                                {imageFile ? imageFile.name : "No file chosen"}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {imageFile
                                  ? `${(imageFile.size / 1024).toFixed(1)} KB`
                                  : "Click to choose file · PNG, JPG, WEBP"}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                              sx={{
                                borderRadius: "8px",
                                textTransform: "none",
                                borderColor: "#2d60ff",
                                color: "#2d60ff",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Choose File
                            </Button>
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleImageChange}
                            />
                          </Box>

                          {/* Image Preview */}
                          {imagePreview && (
                            <Box sx={{ mt: 2, position: "relative", width: "fit-content" }}>
                              <Box
                                component="img"
                                src={imagePreview}
                                sx={{
                                  height: 80,
                                  borderRadius: "10px",
                                  border: "1px solid #e0e5f2",
                                  objectFit: "cover",
                                }}
                              />
                              <Box
                                onClick={removeImage}
                                sx={{
                                  position: "absolute",
                                  top: -8,
                                  right: -8,
                                  backgroundColor: "white",
                                  borderRadius: "50%",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                  cursor: "pointer",
                                  p: 0.5,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  "&:hover": { backgroundColor: "#fff1f0", color: "#ff4d4f" },
                                }}
                              >
                                <CloseIcon sx={{ fontSize: "16px" }} />
                              </Box>
                            </Box>
                          )}
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
                            {isSubmitting ? "Broadcasting..." : "Send to Drivers"}
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
                    {imagePreview && (
                      <Box
                        component="img"
                        src={imagePreview}
                        sx={{
                          width: "100%",
                          height: 120,
                          objectFit: "cover",
                          borderRadius: "10px",
                          mb: 2
                        }}
                      />
                    )}
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
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SendNotificationDriver;
