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
  InputAdornment,
  alpha,
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

  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

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
        storeId: store.id,
        Store: store.name,
        "Coupon Type": formData.couponType,
        "Use Limit": Number(formData.useLimit) || 0,
        "Coupon Name": formData.couponName,
        "Coupon Code": formData.couponCode,
        Description: formData.description,
        "From Date": formData.fromDate,
        "To Date": formData.toDate,
        "Discount Type": formData.discount,
        "Discount Value": Number(formData.discountValue) || 0,
        "Minimum Cart Value": Number(formData.minCartValue) || 0,
        Status: "Active",
        imageUrl: imagePreview || null,
        couponType: formData.couponType,
        useLimit: Number(formData.useLimit) || 0,
        couponName: formData.couponName,
        couponCode: formData.couponCode,
        description: formData.description,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        discount: formData.discount,
        discountValue: Number(formData.discountValue) || 0,
        minCartValue: Number(formData.minCartValue) || 0,
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
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", color: "#1b2559", border: "1px solid #e0e5f2", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", "&:hover": { bgcolor: "#f4f7fe" } }}>
               <ArrowBackIcon fontSize="small" />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
                Add Coupon
              </Typography>
              <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
                 Campaign configuration for {store.name}.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Left Column: Basic Info */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 4, ...orderPanelSx }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
                  <Box sx={{ p: 1, borderRadius: "12px", bgcolor: alpha("#E53935", 0.05) }}>
                    <LocalOfferIcon sx={{ color: "#E53935" }} />
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
                    <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block" }}>Coupon Code</Typography>
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
                              sx={{ fontWeight: 800, textTransform: "none", color: "#E53935" }}
                            >
                              Generate
                            </Button>
                          </InputAdornment>
                        ),
                        sx: { borderRadius: "12px", bgcolor: "#fafbff" }
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
                      "&:hover": { borderColor: "#E53935", bgcolor: "rgba(229, 57, 53, 0.02)" }
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

                <Paper sx={{ p: 4, ...orderPanelSx }}>
                   <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 3 }}>Validity & Value</Typography>
                   <Stack spacing={3}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>From Date</Typography>
                        <TextField
                          fullWidth
                          type="datetime-local"
                          name="fromDate"
                          value={formData.fromDate}
                          onChange={handleChange}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>To Date</Typography>
                        <TextField
                          fullWidth
                          type="datetime-local"
                          name="toDate"
                          value={formData.toDate}
                          onChange={handleChange}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }}
                        />
                      </Box>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Discount</Typography>
                          <Select
                            fullWidth
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            sx={{ borderRadius: "12px", bgcolor: "#fafbff" }}
                          >
                            <MenuItem value="percentage">Percentage</MenuItem>
                            <MenuItem value="fixed">Fixed Amount</MenuItem>
                          </Select>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Value</Typography>
                          <TextField
                            fullWidth
                            name="discountValue"
                            placeholder="Value"
                            value={formData.discountValue}
                            onChange={handleChange}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }}
                          />
                        </Grid>
                      </Grid>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1 }}>Minimum Cart Value</Typography>
                        <TextField
                          fullWidth
                          name="minCartValue"
                          placeholder="Min amount (Rs.) to apply discount"
                          value={formData.minCartValue}
                          onChange={handleChange}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fafbff" } }}
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
                    borderRadius: "12px",
                    bgcolor: "#1b2559",
                    boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "16px",
                    "&:hover": { bgcolor: "#111c44" }
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
