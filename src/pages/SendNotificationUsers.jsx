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
  Alert,
  Chip,
  Snackbar,
  IconButton,
  Tooltip,
  Fade
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CampaignIcon from "@mui/icons-material/Campaign";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { genericApi } from "../api/genericApi";

const SendNotificationUsers = () => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    selectUsers: "all",
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
      setSnackbar({ open: true, message: "Asset payload exceeds 1000 KB threshold.", severity: "error" });
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
      setSnackbar({ open: true, message: "Operational Title and Message manifest are required.", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.create("user_notifications", {
        ...formData,
        image: imageFile ? imageFile.name : null,
      });
      setSnackbar({ open: true, message: "Broadcast dispatched to consumers successfully!", severity: "success" });
      setFormData({ selectUsers: "all", title: "", message: "" });
      removeImage();
    } catch (error) {
      console.error("Error sending notification:", error);
      setSnackbar({ open: true, message: "Transmission failure identified.", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>

      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Consumer Broadcast Console
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Compose and dispatch high-velocity push notifications to the registered audience.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ px: 2, py: 1, borderRadius: "12px", bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
                <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ display: "block", lineHeight: 1 }}>PROTOCOL</Typography>
                <Typography variant="subtitle2" fontWeight="800" color="#4318ff">FCM-LIVE</Typography>
            </Box>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left Column: Composition Card (Structure like Category Management) */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: "12px", bgcolor: "rgba(67, 24, 255, 0.05)" }}>
                    <CampaignIcon sx={{ color: "#4318ff" }} />
                </Box>
                <Typography variant="h6" fontWeight="800" color="#1b2559">
                    Compose Manifest
                </Typography>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>

                {/* Select Audience */}
                <Box>
                  <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                    Target Audience Cluster
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="selectUsers"
                      value={formData.selectUsers}
                      onChange={handleChange}
                      sx={{ 
                        borderRadius: "16px", 
                        bgcolor: "#fafbfc",
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e5f2" }
                      }}
                    >
                      <MenuItem value="all">All Global Consumers</MenuItem>
                      <MenuItem value="active">Active High-Velocity Users</MenuItem>
                      <MenuItem value="verified">Verified Identity Tier</MenuItem>
                      <MenuItem value="new">New Registry (30 Days)</MenuItem>
                      <MenuItem value="inactive">Dormant Audience</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Title */}
                <Box>
                  <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                    Broadcast Title
                  </Typography>
                  <TextField
                    fullWidth
                    name="title"
                    placeholder="Capture attention with a compelling headline..."
                    value={formData.title}
                    onChange={handleChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                  />
                </Box>

                {/* Message */}
                <Box>
                  <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                    Notification Body Manifest
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="message"
                    placeholder="Enter the detailed communication payload..."
                    value={formData.message}
                    onChange={handleChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                  />
                </Box>

                {/* Image Upload Protocol */}
                <Box>
                  <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                    Visual Asset Payload (Optional)
                  </Typography>

                  <Box
                    sx={{
                      border: "2px dashed #e0e5f2",
                      borderRadius: "20px",
                      p: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 2.5,
                      backgroundColor: "#fafbfc",
                      cursor: "pointer",
                      "&:hover": { borderColor: "#4318ff", backgroundColor: "rgba(67, 24, 255, 0.02)" },
                      transition: "0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "14px",
                        backgroundColor: "rgba(67, 24, 255, 0.05)",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <PhotoCameraIcon sx={{ color: "#4318ff", fontSize: "24px" }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="800" color="#1b2559">
                        {imageFile ? imageFile.name : "Select Visual Asset"}
                      </Typography>
                      <Typography variant="caption" color="#a3aed0" fontWeight="600">
                        {imageFile
                          ? `${(imageFile.size / 1024).toFixed(1)} KB`
                          : "PNG, JPG, WEBP • MAX 1MB"}
                      </Typography>
                    </Box>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ borderRadius: "10px", fontWeight: "800", color: "#4318ff", textTransform: "none" }}
                    >
                      Browse
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                  </Box>

                  {/* Image Preview Overlay */}
                  {imagePreview && (
                    <Fade in={true}>
                      <Box sx={{ mt: 2, position: "relative", width: "fit-content" }}>
                        <Box
                          component="img"
                          src={imagePreview}
                          sx={{
                            height: 100,
                            borderRadius: "16px",
                            border: "2px solid #fff",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); removeImage(); }}
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            backgroundColor: "#ff4d49",
                            color: "#fff",
                            boxShadow: "0 4px 10px rgba(255, 77, 73, 0.3)",
                            "&:hover": { backgroundColor: "#d32f2f" }
                          }}
                        >
                          <CloseIcon sx={{ fontSize: "16px" }} />
                        </IconButton>
                      </Box>
                    </Fade>
                  )}
                </Box>

                {/* Submit Dispatch */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={<SendIcon />}
                  sx={{
                    backgroundColor: "#4318ff",
                    "&:hover": { backgroundColor: "#3310cc" },
                    borderRadius: "18px",
                    py: 2,
                    textTransform: "none",
                    fontWeight: "800",
                    fontSize: "16px",
                    boxShadow: "0 10px 25px rgba(67, 24, 255, 0.25)",
                    transition: "0.2s"
                  }}
                >
                  {isSubmitting ? "Initiating Dispatch..." : "Execute Broadcast"}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Right Column: Live Simulator Panel */}
        <Grid item xs={12} md={5}>
          <Box sx={{ position: "sticky", top: 20 }}>
            <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 3, px: 1 }}>
                Live Simulator
            </Typography>
            
            <Box
              sx={{
                width: "320px",
                mx: "auto",
                borderRadius: "45px",
                border: "12px solid #1b2559",
                height: "600px",
                backgroundColor: "#fff",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 40px 100px rgba(27, 37, 89, 0.15)",
                display: "flex",
                flexDirection: "column",
                borderBottom: "20px solid #1b2559"
              }}
            >
              {/* Notch Area */}
              <Box sx={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "120px", height: "25px", bgcolor: "#1b2559", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", zIndex: 10 }} />
              
              {/* Device Status Bar */}
              <Box sx={{ p: "35px 20px 10px", display: "flex", justifyContent: "space-between", color: "#1b2559" }}>
                <Typography fontSize="12px" fontWeight="900">9:41</Typography>
                <Stack direction="row" spacing={0.5}>
                    <Typography fontSize="12px">⚡</Typography>
                    <Typography fontSize="12px">🔋</Typography>
                </Stack>
              </Box>

              {/* Wallpaper Canvas */}
              <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #f4f7fe 0%, #ffffff 100%)", zIndex: 0 }} />

              {/* Push Interface Overlay */}
              <Box sx={{ position: "relative", zIndex: 1, p: 2, mt: 4 }}>
                <Fade in={true}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            backgroundColor: "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(20px)",
                            borderRadius: "20px",
                            border: "1px solid rgba(67, 24, 255, 0.1)",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                        }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                            <Box sx={{ p: 0.5, borderRadius: "6px", bgcolor: "#4318ff", display: "flex" }}>
                                <CampaignIcon sx={{ fontSize: "14px", color: "#fff" }} />
                            </Box>
                            <Typography variant="caption" fontWeight="900" color="#4318ff" sx={{ fontSize: "10px", letterSpacing: "1px" }}>
                                DAY CATCH • NOW
                            </Typography>
                        </Stack>
                        
                        <Typography variant="body2" fontWeight="900" color="#1b2559" sx={{ fontSize: "14px", mb: 0.5 }}>
                            {formData.title || "Dispatch Headline"}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="#a3aed0"
                            sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                fontSize: "11.5px",
                                lineHeight: 1.4,
                                fontWeight: "600"
                            }}
                        >
                            {formData.message || "Enter broadcast content to simulate real-time notification delivery on the end-user device..."}
                        </Typography>
                        
                        {imagePreview && (
                            <Box
                                component="img"
                                src={imagePreview}
                                sx={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "14px", mt: 2, border: "1px solid #f4f7fe" }}
                            />
                        )}
                    </Paper>
                </Fade>
                
                {/* Protocol Tier Indicator */}
                <Box sx={{ mt: 2, px: 1 }}>
                    <Chip
                        label={`→ Cluster: ${
                        formData.selectUsers === "all" ? "Global" :
                        formData.selectUsers === "active" ? "Active" :
                        formData.selectUsers === "verified" ? "Verified" :
                        formData.selectUsers === "new" ? "Recent" : "Inactive"
                        }`}
                        size="small"
                        sx={{ backgroundColor: "rgba(67, 24, 255, 0.1)", color: "#4318ff", fontWeight: "900", fontSize: "10px", borderRadius: "8px" }}
                    />
                </Box>
              </Box>

              {/* App Grid Simulator Placeholder */}
              <Box sx={{ mt: "auto", mb: 4, px: 4 }}>
                  <Grid container spacing={2}>
                      {[1,2,3,4].map(i => (
                          <Grid item xs={3} key={i}>
                              <Box sx={{ width: "40px", height: "40px", borderRadius: "10px", bgcolor: "rgba(0,0,0,0.03)" }} />
                          </Grid>
                      ))}
                  </Grid>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar Protocol */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
            severity={snackbar.severity} 
            variant="filled" 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            sx={{ borderRadius: "14px", fontWeight: "700", bgcolor: snackbar.severity === "success" ? "#00d26a" : "#ff4d49", color: "#fff" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SendNotificationUsers;
