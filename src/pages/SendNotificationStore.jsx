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
  Divider,
  Fade,
  Chip
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CampaignIcon from "@mui/icons-material/Campaign";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import TerminalIcon from "@mui/icons-material/Terminal";
import { genericApi } from "../api/genericApi";

const SendNotificationStore = () => {
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    selectStores: "all",
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
      setSnackbar({ open: true, message: "Memorandum asset exceeds 1000 KB threshold.", severity: "error" });
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
      setSnackbar({ open: true, message: "Memorandum Headline and Content manifest are required.", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.create("store_notifications", {
        ...formData,
        image: imageFile ? imageFile.name : null,
      });
      setSnackbar({ open: true, message: "Internal Bulletin dispatched to partners successfully!", severity: "success" });
      setFormData({ selectStores: "all", title: "", message: "" });
      removeImage();
    } catch (error) {
      console.error("Error sending store notification:", error);
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
                Merchant Bulletin HQ
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Compose internal memorandums and operational bulletins for the partner gateway.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ px: 2, py: 1, borderRadius: "12px", bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
                <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ display: "block", lineHeight: 1 }}>GATEWAY</Typography>
                <Typography variant="subtitle2" fontWeight="800" color="#4318ff">B2B-SECURE</Typography>
            </Box>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        
        {/* Left Column: Bulletin Composition Card (Dual Module Structure) */}
        <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                    <Box sx={{ p: 1, borderRadius: "12px", bgcolor: "rgba(67, 24, 255, 0.05)" }}>
                        <TerminalIcon sx={{ color: "#4318ff" }} />
                    </Box>
                    <Typography variant="h6" fontWeight="800" color="#1b2559">
                        Draft Memorandum
                    </Typography>
                </Stack>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        
                        {/* Select Target Cluster */}
                        <Box>
                            <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                                Target Merchant Cluster
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    name="selectStores"
                                    value={formData.selectStores}
                                    onChange={handleChange}
                                    sx={{ 
                                        borderRadius: "16px", 
                                        bgcolor: "#fafbfc",
                                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e5f2" }
                                    }}
                                >
                                    <MenuItem value="all">Global Partner Fleet</MenuItem>
                                    <MenuItem value="active">Active High-Velocity Stores</MenuItem>
                                    <MenuItem value="pending">Awaiting Verification Hub</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Title */}
                        <Box>
                            <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                                Bulletin Headline
                            </Typography>
                            <TextField
                                fullWidth
                                name="title"
                                placeholder="Enter memorandum subject..."
                                value={formData.title}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                            />
                        </Box>

                        {/* Message Manifest */}
                        <Box>
                            <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                                Detailed Memorandum Manifest
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={5}
                                name="message"
                                placeholder="Formal bulletin content or policy update..."
                                value={formData.message}
                                onChange={handleChange}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                            />
                        </Box>

                        {/* Visual Documentation Protocol */}
                        <Box>
                          <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                            Documentation Asset (Optional)
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
                                {imageFile ? imageFile.name : "Select Asset Node"}
                              </Typography>
                              <Typography variant="caption" color="#a3aed0" fontWeight="600">
                                {imageFile
                                  ? `${(imageFile.size / 1024).toFixed(1)} KB`
                                  : "PNG, JPG • MAX 1MB BUFFER"}
                              </Typography>
                            </Box>
                            <Button
                              variant="text"
                              size="small"
                              sx={{ borderRadius: "10px", fontWeight: "800", color: "#4318ff", textTransform: "none" }}
                            >
                              Select
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

                        {/* Dispatch Inbound */}
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
                            {isSubmitting ? "Initiating Transmission..." : "Notify Merchant Fleet"}
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Grid>

        {/* Right Column: Terminal Preview Panel */}
        <Grid item xs={12} md={5}>
            <Box sx={{ position: "sticky", top: 20 }}>
                <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 3, px: 1 }}>
                    B2B Protocol Preview
                </Typography>
                
                <Paper sx={{ p: 4, borderRadius: "28px", backgroundColor: "#1b2559", color: "#fff", border: "1px solid #e0e5f2", overflow: "hidden", position: "relative" }}>
                    <Box sx={{ position: "absolute", bottom: -50, right: -20, opacity: 0.05 }}>
                        <StorefrontIcon sx={{ fontSize: "280px", color: "#fff" }} />
                    </Box>

                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4, position: "relative", zIndex: 1 }}>
                        <Box sx={{ p: 1, borderRadius: "12px", bgcolor: "rgba(255, 255, 255, 0.1)" }}>
                            <StorefrontIcon sx={{ color: "#fff" }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="900" sx={{ color: "#fff" }}>MERCHANT INTERFACE</Typography>
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", fontWeight: "700" }}>PROTOCOL: INTERNAL-SEC-9</Typography>
                        </Box>
                    </Stack>
                    
                    <Box sx={{ 
                        backgroundColor: "rgba(255,255,255,0.05)", 
                        borderRadius: "22px", 
                        p: 3, 
                        border: "1px solid rgba(255,255,255,0.1)",
                        position: "relative",
                        zIndex: 1
                    }}>
                        <Fade in={true}>
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                    <CampaignIcon sx={{ color: "#4318ff", fontSize: "20px" }} />
                                    <Typography variant="caption" fontWeight="900" sx={{ color: "#4318ff", letterSpacing: "2px" }}>ADMIN BULLET-DISPATCH</Typography>
                                </Stack>
                                
                                {imagePreview && (
                                <Box
                                    component="img"
                                    src={imagePreview}
                                    sx={{
                                    width: "100%",
                                    height: 140,
                                    objectFit: "cover",
                                    borderRadius: "14px",
                                    mb: 2,
                                    border: "1px solid rgba(255,255,255,0.1)"
                                    }}
                                />
                                )}
                                
                                <Typography variant="h6" fontWeight="800" sx={{ mb: 1, lineHeight: 1.2 }}>
                                    {formData.title || "Subject Memorandum"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.7", fontSize: "13px", fontWeight: "500" }}>
                                    {formData.message || "Enter internal memorandum content to simulate the Merchant Interface experience..."}
                                </Typography>
                                
                                <Divider sx={{ my: 3, opacity: 0.1, px: 2 }} />
                                
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", fontWeight: "700" }}>TARGET: {formData.selectStores.toUpperCase()}</Typography>
                                    <Chip label="ACK REQUIRED" size="small" sx={{ height: 20, fontSize: "9px", fontWeight: "900", bgcolor: "rgba(67, 24, 255, 0.2)", color: "#fff", border: "1px solid #4318ff" }} />
                                </Stack>
                            </Box>
                        </Fade>
                    </Box>

                    <Box sx={{ mt: 4, textAlign: "center", position: "relative", zIndex: 1 }}>
                        <Typography variant="caption" color="rgba(255,255,255,0.4)" fontWeight="600">
                            * Internal bulletins are cryptographically signed for partner verification.
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Grid>
      </Grid>
      
      {/* Alert System */}
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

export default SendNotificationStore;
