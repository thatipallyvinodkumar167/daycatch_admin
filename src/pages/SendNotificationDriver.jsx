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
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Fade,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CampaignIcon from "@mui/icons-material/Campaign";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SpeedIcon from "@mui/icons-material/Speed";
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
      setSnackbar({ open: true, message: "Fleet asset payload exceeds 1000 KB threshold.", severity: "error" });
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
      setSnackbar({ open: true, message: "Fleet Headline and Operational manifest are required.", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.create("driver_notifications", {
        ...formData,
        image: imageFile ? imageFile.name : null,
      });
      setSnackbar({ open: true, message: "Operational Alert broadcasted to fleet successfully!", severity: "success" });
      setFormData({ selectDeliveryBoys: "all", title: "", message: "" });
      removeImage();
    } catch (error) {
      console.error("Error sending driver notification:", error);
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
                Fleet Alert Dispatch
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Broadcast operational updates, safety alerts, and deployment notices to the delivery fleet.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ px: 2, py: 1, borderRadius: "12px", bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
                <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ display: "block", lineHeight: 1 }}>CLUSTER</Typography>
                <Typography variant="subtitle2" fontWeight="800" color="#4318ff">FLEET-SEND</Typography>
            </Box>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left Column: Composition Card (Dual Module Architecture) */}
        <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                    <Box sx={{ p: 1, borderRadius: "12px", bgcolor: "rgba(67, 24, 255, 0.05)" }}>
                        <SpeedIcon sx={{ color: "#4318ff" }} />
                    </Box>
                    <Typography variant="h6" fontWeight="800" color="#1b2559">
                        Operational Alert Manifest
                    </Typography>
                </Stack>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        
                        {/* Select Deployment Group */}
                        <Box>
                            <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                                Select Deployment Group
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="selectDeliveryBoys"
                                    value={formData.selectDeliveryBoys}
                                    onChange={handleChange}
                                    sx={{ 
                                        borderRadius: "16px", 
                                        bgcolor: "#fafbfc",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e5f2" }
                                    }}
                                >
                                    <MenuItem value="all">Global Delivery Fleet</MenuItem>
                                    <MenuItem value="active">Active/On-Duty Hub</MenuItem>
                                    <MenuItem value="inactive">Dormant Operations</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Title */}
                        <Box>
                            <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                                Operational Headline
                            </Typography>
                            <TextField
                                fullWidth
                                name="title"
                                placeholder="Formal headline (e.g. Safety Alert)"
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                            />
                        </Box>

                        {/* Message Manifest */}
                        <Box>
                            <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                                Fleet Execution Directive
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                name="message"
                                placeholder="Enter operational instructions or safety directives..."
                                value={formData.message}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                            />
                        </Box>

                        {/* Situational Image Asset */}
                        <Box>
                          <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                            Situational Asset (Optional)
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
                              transition: "0.2s",
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
                              <PhotoCameraIcon sx={{ color: "#4318ff", fontSize: "21px" }} />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight="800" color="#1b2559">
                                {imageFile ? imageFile.name : "Map or Asset Node"}
                              </Typography>
                              <Typography variant="caption" color="#a3aed0" fontWeight="600">
                                {imageFile
                                  ? `${(imageFile.size / 1024).toFixed(1)} KB`
                                  : "PNG, JPG • MAX 1MB"}
                              </Typography>
                            </Box>
                            <Button
                              variant="text"
                              size="small"
                              sx={{ borderRadius: "10px", fontWeight: "800", color: "#4318ff", textTransform: "none" }}
                            >
                              Upload
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
                                    height: 90,
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
                                    top: -8,
                                    right: -8,
                                    backgroundColor: "#ff4d49",
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#d32f2f" }
                                  }}
                                >
                                  <CloseIcon sx={{ fontSize: "14px" }} />
                                </IconButton>
                              </Box>
                            </Fade>
                          )}
                        </Box>

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
                                boxShadow: "0 10px 25px rgba(67, 24, 255, 0.25)"
                            }}
                        >
                            {isSubmitting ? "Initiating Dispatch..." : "Execute Fleet Broadcast"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Grid>

        {/* Right Column: Fleet Simulator Overlay */}
        <Grid item xs={12} md={5}>
            <Box sx={{ position: "sticky", top: 20 }}>
                <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 3, px: 1 }}>
                    Operational View Preview
                </Typography>
                
                <Paper sx={{ p: 4, borderRadius: "28px", backgroundColor: "#000", color: "#fff", position: "relative", overflow: "hidden", minHeight: "520px" }}>
                    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, bgcolor: "#4318ff" }} />

                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                        <Box sx={{ p: 1, borderRadius: "12px", bgcolor: "rgba(67, 24, 255, 0.2)" }}>
                            <DeliveryDiningIcon sx={{ color: "#4318ff" }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="900" sx={{ color: "#fff" }}>FLEET INTERFACE</Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>PROTOCOL: OPS-SECURE-ALPHA</Typography>
                        </Box>
                    </Stack>
                    
                    <Box sx={{ 
                        backgroundColor: "rgba(255,255,255,0.05)", 
                        borderRadius: "22px", 
                        p: 3, 
                        border: "1px solid rgba(255,255,255,0.1)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                    }}>
                        <Fade in={true}>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <CampaignIcon sx={{ color: "#ff4d49", fontSize: "20px" }} />
                                    <Typography variant="caption" fontWeight="900" sx={{ color: "#ff4d49", letterSpacing: "2px" }}>CRITICAL OPERATIONAL ALERT</Typography>
                                </Stack>
                                
                                {imagePreview && (
                                <Box
                                    component="img"
                                    src={imagePreview}
                                    sx={{
                                    width: "100%",
                                    height: 120,
                                    objectFit: "cover",
                                    borderRadius: "14px",
                                    mb: 2,
                                    border: "1px solid rgba(255,255,255,0.1)"
                                    }}
                                />
                                )}
                                
                                <Typography variant="h6" fontWeight="800" sx={{ mb: 1, color: "#fff" }}>
                                    {formData.title || "Safety Update Manifest"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6", fontSize: "14px", fontWeight: "500" }}>
                                    {formData.message || "Operational instructions or dispatch node directives will appear here for the fleet..."}
                                </Typography>
                            </Box>
                        </Fade>
                    </Box>

                    <Box sx={{ mt: 5, textAlign: "center" }}>
                        <Button 
                            variant="outlined" 
                            sx={{ 
                                borderRadius: "30px", 
                                borderColor: "rgba(255,255,255,0.1)", 
                                color: "#fff", 
                                px: 4, 
                                py: 1, 
                                textTransform: "none", 
                                fontWeight: "800",
                                fontSize: "12px",
                                pointerEvents: "none"
                            }}
                        >
                            SWIPE TO ACKNOWLEDGE
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Grid>
      </Grid>
      
      {/* Fleet Alert Protocol */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "14px", fontWeight: "700", bgcolor: snackbar.severity === "success" ? "#00d26a" : "#ff4d49" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SendNotificationDriver;
