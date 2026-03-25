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
  IconButton,
  Snackbar,
  Alert,
  Fade,
  InputAdornment,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  PhotoCamera as PhotoCameraIcon,
  Close as CloseIcon,
  AutoFixHigh as AutoFixHighIcon,
  LocalOffer as LocalOfferIcon
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreAddCoupon = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    couponType: "regular",
    useLimit: "",
    couponName: "",
    couponCode: "",
    description: "",
    fromDate: "",
    toDate: "",
    discount: "percentage",
    discountValue: "",
    minCartValue: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateCode = () => {
    const code = "STORE-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({ ...formData, couponCode: code });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1000 * 1024) {
      setSnackbar({ open: true, message: "Image size must be less than 1MB", severity: "error" });
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
    if (!formData.couponName || !formData.couponCode) {
      setSnackbar({ open: true, message: "Coupon Name and Code are required", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.create("coupons", {
        ...formData,
        storeId: store.id,
        imageUrl: imageFile ? imageFile.name : null
      });
      setSnackbar({ open: true, message: "Coupon added successfully!", severity: "success" });
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error("Error creating coupon:", error);
      setSnackbar({ open: true, message: "Failed to create coupon", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", color: "#4318ff", boxShadow: "0 6px 18px rgba(15,23,42,0.06)", "&:hover": { bgcolor: "#f4f7fe" } }}>
             <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Add Coupon
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
               Configure a new promotion for {store.name}
            </Typography>
          </Box>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column: Basic Info */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
                  <Box sx={{ p: 1, borderRadius: "12px", bgcolor: "rgba(67, 24, 255, 0.05)" }}>
                    <LocalOfferIcon sx={{ color: "#4318ff" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="800" color="#1b2559">Coupon Identity</Typography>
                </Stack>

                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Coupon Type</Typography>
                      <FormControl fullWidth>
                        <Select
                          name="couponType"
                          value={formData.couponType}
                          onChange={handleChange}
                          sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}
                        >
                          <MenuItem value="regular">Regular Coupon</MenuItem>
                          <MenuItem value="first_order">First Order Only</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Uses Restriction</Typography>
                      <TextField
                        fullWidth
                        name="useLimit"
                        type="number"
                        placeholder="Limit per user"
                        value={formData.useLimit}
                        onChange={handleChange}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                      />
                    </Grid>
                  </Grid>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Coupon Name</Typography>
                    <TextField
                      fullWidth
                      name="couponName"
                      placeholder="Insert the name of the coupon"
                      value={formData.couponName}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Coupon Code</Typography>
                    <TextField
                      fullWidth
                      name="couponCode"
                      placeholder="INSERT_CODE"
                      value={formData.couponCode}
                      onChange={handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              onClick={generateCode}
                              startIcon={<AutoFixHighIcon />}
                              sx={{ fontWeight: 800, textTransform: "none", color: "#4318ff" }}
                            >
                              Generate
                            </Button>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "16px", bgcolor: "#fafbfc" }
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Description</Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      name="description"
                      placeholder="A brief description of coupon..."
                      value={formData.description}
                      onChange={handleChange}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            {/* Right Column: Constraints & Media */}
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
                  <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 2, display: "block", textTransform: "uppercase" }}>Coupon Image</Typography>
                  <Box
                    sx={{
                      border: "2px dashed #e0e5f2",
                      borderRadius: "20px",
                      p: 2,
                      textAlign: "center",
                      bgcolor: "#fafbfc",
                      cursor: "pointer",
                      "&:hover": { borderColor: "#4318ff", bgcolor: "rgba(67, 24, 255, 0.02)" }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {!imagePreview ? (
                      <Stack spacing={1} alignItems="center" sx={{ py: 2 }}>
                        <PhotoCameraIcon sx={{ color: "#a3aed0", fontSize: 40 }} />
                        <Typography variant="body2" fontWeight="700" color="#707eae">keywords.Choose_File</Typography>
                        <Typography variant="caption" color="#a3aed0">Less than 1000 KB</Typography>
                      </Stack>
                    ) : (
                      <Box sx={{ position: "relative" }}>
                        <Box component="img" src={imagePreview} sx={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "14px" }} />
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeImage(); }} sx={{ position: "absolute", top: -10, right: -10, bgcolor: "#ff4d49", color: "#fff" }}>
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    )}
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                  </Box>
                </Paper>

                <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
                   <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 3 }}>Validity & Value</Typography>
                   <Stack spacing={3}>
                      <Box>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>From Date</Typography>
                        <TextField
                          fullWidth
                          type="datetime-local"
                          name="fromDate"
                          value={formData.fromDate}
                          onChange={handleChange}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>To Date</Typography>
                        <TextField
                          fullWidth
                          type="datetime-local"
                          name="toDate"
                          value={formData.toDate}
                          onChange={handleChange}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                        />
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>Discount</Typography>
                          <Select
                            fullWidth
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            sx={{ borderRadius: "16px", bgcolor: "#fafbfc" }}
                          >
                            <MenuItem value="percentage">Percentage</MenuItem>
                            <MenuItem value="fixed">Fixed Amount</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>Value</Typography>
                          <TextField
                            fullWidth
                            name="discountValue"
                            placeholder="Value"
                            value={formData.discountValue}
                            onChange={handleChange}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                          />
                        </Grid>
                      </Grid>
                      <Box>
                        <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block" }}>Minimum Cart Value</Typography>
                        <TextField
                          fullWidth
                          name="minCartValue"
                          placeholder="Min amount to apply discount"
                          value={formData.minCartValue}
                          onChange={handleChange}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                        />
                      </Box>
                   </Stack>
                </Paper>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    py: 2,
                    borderRadius: "18px",
                    bgcolor: "#4318ff",
                    boxShadow: "0 10px 25px rgba(67,24,255,0.25)",
                    textTransform: "none",
                    fontWeight: 900,
                    fontSize: "16px",
                    "&:hover": { bgcolor: "#3310cc" }
                  }}
                >
                  {isSubmitting ? "Creating..." : "Save Coupon"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "14px", fontWeight: "700" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreAddCoupon;
