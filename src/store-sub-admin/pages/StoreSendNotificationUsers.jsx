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
  Fade,
} from "@mui/material";
import {
  Send as SendIcon,
  Campaign as CampaignIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreSendNotificationUsers = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  
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
      setSnackbar({ open: true, message: "Image size exceeds 1MB.", severity: "error" });
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
        storeId: store.id,
        storeName: store.name,
        image: imageFile ? imageFile.name : null,
      });
      setSnackbar({ open: true, message: "Notification sent successfully!", severity: "success" });
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
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        {/* Premium Header */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
                Send Notification
              </Typography>
              <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Propagate push notifications to {store.name} customers.
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ px: 2, py: 1, borderRadius: "12px", bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
              <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ display: "block", lineHeight: 1 }}>PROTOCOL</Typography>
              <Typography variant="subtitle2" fontWeight="800" color="#4318ff">FCM-LIVE</Typography>
            </Box>
          </Stack>
        </Box>

        <Grid container spacing={4}>
          {/* Creator Card */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: "12px", bgcolor: "rgba(67, 24, 255, 0.05)" }}>
                  <CampaignIcon sx={{ color: "#4318ff" }} />
                </Box>
                <Typography variant="h6" fontWeight="800" color="#1b2559">
                  Compose Message
                </Typography>
              </Stack>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Target Audience
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="selectUsers"
                        value={formData.selectUsers}
                        onChange={handleChange}
                        sx={{ borderRadius: "16px", bgcolor: "#fafbfc", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e5f2" } }}
                      >
                        <MenuItem value="all">All Store Customers</MenuItem>
                        <MenuItem value="active">Active Customers</MenuItem>
                        <MenuItem value="new">New Customers (Last 30 Days)</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Title
                    </Typography>
                    <TextField
                      fullWidth
                      name="title"
                      placeholder="e.g. Fresh Stock Arrived!"
                      value={formData.title}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Message Body
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      name="message"
                      placeholder="Write your announcement here..."
                      value={formData.message}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Attachment (Optional)
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
                      <Box sx={{ p: 1.5, borderRadius: "14px", backgroundColor: "rgba(67, 24, 255, 0.05)", display: "flex" }}>
                        <PhotoCameraIcon sx={{ color: "#4318ff" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="800" color="#1b2559">
                          {imageFile ? imageFile.name : "Select Notification Image"}
                        </Typography>
                        <Typography variant="caption" color="#a3aed0" fontWeight="600">
                          PNG, JPG • MAX 1MB
                        </Typography>
                      </Box>
                      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
                    </Box>

                    {imagePreview && (
                      <Fade in={true}>
                        <Box sx={{ mt: 2, position: "relative", width: "fit-content" }}>
                          <Box component="img" src={imagePreview} sx={{ height: 100, borderRadius: "16px", border: "2px solid #fff", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", objectFit: "cover" }} />
                          <IconButton size="small" onClick={removeImage} sx={{ position: "absolute", top: -10, right: -10, bgcolor: "#ff4d49", color: "#fff", "&:hover": { bgcolor: "#d32f2f" } }}>
                            <CloseIcon sx={{ fontSize: "16px" }} />
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
                      borderRadius: "18px",
                      py: 2,
                      textTransform: "none",
                      fontWeight: "800",
                      fontSize: "16px",
                      boxShadow: "0 10px 25px rgba(67, 24, 255, 0.25)",
                    }}
                  >
                    {isSubmitting ? "Dispatching..." : "Broadcast Notification"}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>

          {/* Live Preview Column */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: "sticky", top: 20 }}>
              <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 3, px: 1 }}>
                Mobile Dashboard Preview
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
                  boxShadow: "0 40px 100px rgba(27,37,89,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  borderBottom: "20px solid #1b2559"
                }}
              >
                <Box sx={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "120px", height: "25px", bgcolor: "#1b2559", borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px", zIndex: 10 }} />
                <Box sx={{ p: "35px 20px 10px", display: "flex", justifyContent: "space-between", color: "#1b2559" }}>
                  <Typography fontSize="12px" fontWeight="900">9:41</Typography>
                  <Typography fontSize="12px">🔋</Typography>
                </Box>
                <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #f4f7fe 0%, #ffffff 100%)", zIndex: 0 }} />
                <Box sx={{ position: "relative", zIndex: 1, p: 2, mt: 4 }}>
                  <Fade in={true}>
                    <Paper sx={{ p: 2, bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", borderRadius: "20px", border: "1px solid rgba(67, 24, 255, 0.1)", boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <Box sx={{ p: 0.5, borderRadius: "6px", bgcolor: "#4318ff", display: "flex" }}>
                          <CampaignIcon sx={{ fontSize: "14px", color: "#fff" }} />
                        </Box>
                        <Typography variant="caption" fontWeight="900" color="#4318ff" sx={{ fontSize: "10px", letterSpacing: "1px" }}>
                          {store.name.toUpperCase()} • NOW
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight="900" color="#1b2559" sx={{ fontSize: "14px", mb: 0.5 }}>{formData.title || "Notification Title"}</Typography>
                      <Typography variant="caption" color="#a3aed0" sx={{ fontSize: "11.5px", lineHeight: 1.4, fontWeight: "600", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {formData.message || "Enter your message to preview how it looks on customer devices."}
                      </Typography>
                      {imagePreview && (
                        <Box component="img" src={imagePreview} sx={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "14px", mt: 2, border: "1px solid #f4f7fe" }} />
                      )}
                    </Paper>
                  </Fade>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "14px", fontWeight: "700", bgcolor: snackbar.severity === "success" ? "#00d26a" : "#ff4d49" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreSendNotificationUsers;
