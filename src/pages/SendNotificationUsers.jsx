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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import CampaignIcon from "@mui/icons-material/Campaign";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
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
      await genericApi.create("user_notifications", {
        ...formData,
        image: imageFile ? imageFile.name : null,
      });
      setSnackbar({ open: true, message: "Notification sent to users successfully!", severity: "success" });
      setFormData({ selectUsers: "all", title: "", message: "" });
      removeImage();
    } catch (error) {
      console.error("Error sending notification:", error);
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
          Broadcast push notifications to your registered users.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Form */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
              Notification to Users
            </Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>

                {/* Select Users */}
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                    Select Users
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="selectUsers"
                      value={formData.selectUsers}
                      onChange={handleChange}
                      sx={{ borderRadius: "10px" }}
                    >
                      <MenuItem value="all">All Users</MenuItem>
                      <MenuItem value="active">Active Users Only</MenuItem>
                      <MenuItem value="verified">Verified Users Only</MenuItem>
                      <MenuItem value="new">New Registrations (Last 30 days)</MenuItem>
                      <MenuItem value="inactive">Inactive Users</MenuItem>
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
                    placeholder="e.g. Weekend Flash Sale! ⚡"
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
                    placeholder="Write your notification message here..."
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
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          backgroundColor: "#ff4d49",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <CloseIcon sx={{ fontSize: "14px", color: "#fff" }} />
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Submit Button */}
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
                    boxShadow: "0 4px 12px rgba(45, 96, 255, 0.3)",
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send Notification"}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>

        {/* Preview Panel */}
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
              height: "520px",
              backgroundColor: "#000",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Status Bar */}
            <Box sx={{ p: 1, display: "flex", justifyContent: "space-between", color: "#fff" }}>
              <Typography fontSize="10px">9:41</Typography>
              <Typography fontSize="10px">🔋 100%</Typography>
            </Box>

            {/* Wallpaper */}
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", zIndex: 0 }} />

            {/* Notification Card */}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                m: 2,
                p: 2,
                backgroundColor: "rgba(255,255,255,0.92)",
                borderRadius: "15px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <CampaignIcon sx={{ fontSize: "14px", color: "#2d60ff" }} />
                <Typography variant="caption" fontWeight="700" color="#2d60ff" sx={{ fontSize: "10px" }}>
                  DAY CATCH
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ ml: "auto !important", fontSize: "10px" }}>
                  now
                </Typography>
              </Stack>
              <Typography variant="body2" fontWeight="700" color="#1b2559" noWrap sx={{ fontSize: "13px" }}>
                {formData.title || "Your Title Here"}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  fontSize: "11px",
                }}
              >
                {formData.message || "Start typing to see the preview..."}
              </Typography>
              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  sx={{ width: "100%", height: "70px", objectFit: "cover", borderRadius: "8px", mt: 1 }}
                />
              )}
            </Box>

            {/* Audience Chip */}
            <Box sx={{ position: "relative", zIndex: 1, px: 2 }}>
              <Chip
                label={`→ ${
                  formData.selectUsers === "all" ? "All Users" :
                  formData.selectUsers === "active" ? "Active Users" :
                  formData.selectUsers === "verified" ? "Verified Users" :
                  formData.selectUsers === "new" ? "New Registrations" : "Inactive Users"
                }`}
                size="small"
                sx={{ backgroundColor: "rgba(45,96,255,0.8)", color: "#fff", fontWeight: "700", fontSize: "10px" }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ borderRadius: "10px" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SendNotificationUsers;