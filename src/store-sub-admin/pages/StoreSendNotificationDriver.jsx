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
  Fade,
} from "@mui/material";
import {
  Send as SendIcon,
  DeliveryDining as DeliveryDiningIcon,
  Campaign as CampaignIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreSendNotificationDriver = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  
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
      setSnackbar({ open: true, message: "Subject and Message are required.", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.create("driver_notifications", {
        ...formData,
        storeId: store.id,
        storeName: store.name,
        image: imageFile ? imageFile.name : null,
      });
      setSnackbar({ open: true, message: "Notification sent successfully!", severity: "success" });
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
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        {/* Premium Header */}
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
                Driver Notifications
              </Typography>
              <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
                Communicate with {store.name} delivery fleet members.
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ px: 2, py: 1, borderRadius: "12px", bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ display: "block", lineHeight: 1 }}>FLEET ROLE</Typography>
            <Typography variant="subtitle2" fontWeight="800" color="#E53935">Store Admin</Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Creator Module */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: "12px", bgcolor: "rgba(229, 57, 53, 0.05)" }}>
                  <SpeedIcon sx={{ color: "#E53935" }} />
                </Box>
                <Typography variant="h6" fontWeight="800" color="#1b2559">
                  Fleet Broadcast
                </Typography>
              </Stack>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Target Partners
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        name="selectDeliveryBoys"
                        value={formData.selectDeliveryBoys}
                        onChange={handleChange}
                        sx={{ borderRadius: "16px", bgcolor: "#fafbfc", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e5f2" } }}
                      >
                        <MenuItem value="all">All Store Drivers</MenuItem>
                        <MenuItem value="active">Active/On-Duty Only</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Headline
                    </Typography>
                    <TextField
                      fullWidth
                      name="title"
                      placeholder="e.g. Important Zone Update..."
                      value={formData.title}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Dispatch Message
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      name="message"
                      placeholder="Enter your instructions for the drivers..."
                      value={formData.message}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>
                      Fleet Asset (Optional)
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
                        "&:hover": { borderColor: "#E53935", backgroundColor: "rgba(229, 57, 53, 0.02)" },
                        transition: "0.2s",
                      }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Box sx={{ p: 1.5, borderRadius: "14px", backgroundColor: "rgba(229, 57, 53, 0.05)", display: "flex" }}>
                        <PhotoCameraIcon sx={{ color: "#E53935" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight="800" color="#1b2559">
                          {imageFile ? imageFile.name : "Select Image Asset"}
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
                          <Box component="img" src={imagePreview} sx={{ height: 90, borderRadius: "16px", border: "2px solid #fff", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", objectFit: "cover" }} />
                          <IconButton size="small" onClick={removeImage} sx={{ position: "absolute", top: -8, right: -8, bgcolor: "#ff4d49", color: "#fff", "&:hover": { bgcolor: "#d32f2f" } }}>
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
                      backgroundColor: "#E53935",
                      borderRadius: "18px",
                      py: 2,
                      textTransform: "none",
                      fontWeight: "800",
                      fontSize: "16px",
                      boxShadow: "0 10px 25px rgba(229, 57, 53, 0.25)",
                    }}
                  >
                    {isSubmitting ? "Dispatching..." : "Send Fleet Message"}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>

          {/* Driver App Simulator */}
          <Grid item xs={12} md={5}>
            <Box sx={{ position: "sticky", top: 20 }}>
              <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 3, px: 1 }}>
                Driver App Interface (Live)
              </Typography>
              <Paper sx={{ p: 4, borderRadius: "24px", backgroundColor: "#000", color: "#fff", position: "relative", overflow: "hidden", minHeight: "520px" }}>
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, bgcolor: "#E53935" }} />

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
                  <Box sx={{ p: 1, borderRadius: "12px", bgcolor: "rgba(229, 57, 53, 0.2)" }}>
                    <DeliveryDiningIcon sx={{ color: "#E53935" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: "#fff" }}>{store.name.toUpperCase()} DRIVER</Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>TYPE: OPERATIONAL ALERT</Typography>
                  </Box>
                </Stack>
                
                <Box sx={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "22px", p: 3, border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                  <Fade in={true}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <CampaignIcon sx={{ color: "#ff4d49", fontSize: "20px" }} />
                        <Typography variant="caption" fontWeight="900" sx={{ color: "#ff4d49", letterSpacing: "2px" }}>CRITICAL UPDATE</Typography>
                      </Stack>
                      
                      {imagePreview && (
                        <Box component="img" src={imagePreview} sx={{ width: "100%", height: 120, objectFit: "cover", borderRadius: "14px", mb: 2, border: "1px solid rgba(255,255,255,0.1)" }} />
                      )}
                      
                      <Typography variant="h6" fontWeight="800" sx={{ mb: 1, color: "#fff" }}>{formData.title || "Subject Header"}</Typography>
                      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.7)", lineHeight: "1.6", fontSize: "14px", fontWeight: "500" }}>
                        {formData.message || "Message draft will appear here..."}
                      </Typography>
                    </Box>
                  </Fade>
                </Box>

                <Box sx={{ mt: 5, textAlign: "center" }}>
                  <Button variant="outlined" sx={{ borderRadius: "30px", borderColor: "rgba(255,255,255,0.1)", color: "#fff", px: 4, py: 1, textTransform: "none", fontWeight: "800", fontSize: "12px", pointerEvents: "none" }}>
                    ACKNOWLEDGE DISPATCH
                  </Button>
                </Box>
              </Paper>
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

export default StoreSendNotificationDriver;
