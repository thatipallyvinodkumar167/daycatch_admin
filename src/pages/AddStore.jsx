import React, { useState, useEffect } from "react";
import {
  Box, Typography, Paper, TextField, Button, Stack,
  Grid, Avatar, IconButton, Divider, MenuItem,
  Select, FormControl, InputLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const ID_TYPES = ["Aadhar Card", "PAN Card", "Driving License", "Passport", "Voter ID"];

const sectionLabel = (text) => (
  <Typography variant="body2" fontWeight="700" color="#a3aed0"
    sx={{ textTransform: "uppercase", letterSpacing: 1, mb: 1.5, mt: 0.5 }}>
    {text}
  </Typography>
);

const field = { "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#fff" } };

const ImageUpload = ({ label, preview, onChange }) => (
  <Box>
    <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
      {label}
    </Typography>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Button
        component="label"
        variant="outlined"
        size="small"
        startIcon={<CloudUploadIcon fontSize="small" />}
        sx={{ borderRadius: "8px", textTransform: "none", borderColor: "#d1d5db", color: "#475467", fontWeight: "600" }}
      >
        Choose file
        <input type="file" accept="image/*" hidden onChange={onChange} />
      </Button>
      {preview
        ? <Avatar src={preview} sx={{ width: 52, height: 52, borderRadius: "10px", border: "2px solid #e0e5f2" }} />
        : <Typography variant="caption" color="#a3aed0">No file chosen</Typography>
      }
    </Stack>
  </Box>
);

const AddStore = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    storeImagePreview: null, storeImage: null,
    storeName: "", employeeName: "", storeNumber: "",
    adminShare: "", email: "", password: "",
    idType: "", idNumber: "",
    idImagePreview: null, idImage: null,
    selectedCity: "", deliveryRange: "",
    address: "", ordersPerSlot: "",
    startTime: "", endTime: "", slotInterval: "",
  });

  useEffect(() => {
    genericApi.getAll("cities").then(res => {
      const results = res.data?.results || res.data || [];
      setCities(results.map(c => c["City Name"] || c.name || c.Name || ""));
    }).catch(() => {});
  }, []);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleImage = (imageKey, previewKey) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1000 * 1024) { alert("Image size should be less than 1000 KB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, [imageKey]: file, [previewKey]: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.storeName.trim()) { alert("Store Name is required."); return; }
    try {
      const payload = {
        "Store Name": form.storeName,
        "Employee Name": form.employeeName,
        Mobile: form.storeNumber,
        "admin share": form.adminShare,
        Email: form.email,
        password: form.password,
        "ID Type": form.idType,
        "ID Number": form.idNumber,
        City: form.selectedCity,
        "Delivery Range": form.deliveryRange,
        address: form.address,
        "Orders Per Slot": form.ordersPerSlot,
        "Start Time": form.startTime,
        "End Time": form.endTime,
        "Slot Interval": form.slotInterval,
        ...(form.storeImagePreview && { "Profile Pic": form.storeImagePreview }),
        ...(form.idImagePreview && { "ID Image": form.idImagePreview }),
        status: "Pending",
      };
      await genericApi.create("storeList", payload);
      alert("Store added successfully! It is now pending approval.");
      navigate("/store-approval");
    } catch (error) {
      console.error("Error adding store:", error);
      alert("Failed to add store: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate("/stores")}
          sx={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">Add New Store</Typography>
          <Typography variant="body2" color="textSecondary">Fill in the details below to register a new store.</Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid item xs={12} md={6}>

          {/* Store Profile */}
          <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", mb: 3 }}>
            {sectionLabel("Store Profile")}
            <Stack spacing={2.5}>
              <ImageUpload
                label="Store Image (It Should Be Less Than 1000 KB)"
                preview={form.storeImagePreview}
                onChange={handleImage("storeImage", "storeImagePreview")}
              />
              <TextField fullWidth size="small" label="Store Name" value={form.storeName} onChange={set("storeName")} sx={field} />
              <TextField fullWidth size="small" label="Employee Name" value={form.employeeName} onChange={set("employeeName")} sx={field} />
              <TextField fullWidth size="small" label="Store Number" value={form.storeNumber} onChange={set("storeNumber")} sx={field} />
              <TextField fullWidth size="small" label="Admin Share (%)" type="number" value={form.adminShare} onChange={set("adminShare")} sx={field} />
              <TextField fullWidth size="small" label="Email" type="email" value={form.email} onChange={set("email")} sx={field} />
              <TextField fullWidth size="small" label="Password" type="password" value={form.password} onChange={set("password")} sx={field} />
            </Stack>
          </Paper>

          {/* ID Verification */}
          <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            {sectionLabel("ID Verification")}
            <Stack spacing={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Select ID</InputLabel>
                <Select value={form.idType} label="Select ID" onChange={set("idType")} sx={{ borderRadius: "10px", backgroundColor: "#fff" }}>
                  {ID_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField fullWidth size="small" label="ID Number" value={form.idNumber} onChange={set("idNumber")} sx={field} />
              <ImageUpload
                label="ID Image (It Should Be Less Than 1000 KB)"
                preview={form.idImagePreview}
                onChange={handleImage("idImage", "idImagePreview")}
              />
            </Stack>
          </Paper>
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid item xs={12} md={6}>

          {/* Location */}
          <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", mb: 3 }}>
            {sectionLabel("Location")}
            <Stack spacing={2.5}>
              <FormControl fullWidth size="small">
                <InputLabel>Select City</InputLabel>
                <Select value={form.selectedCity} label="Select City" onChange={set("selectedCity")} sx={{ borderRadius: "10px", backgroundColor: "#fff" }}>
                  {cities.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField fullWidth size="small" label="City" value={form.selectedCity}
                onChange={set("selectedCity")} placeholder="Or type city name" sx={field} />
              <TextField fullWidth size="small" label="Delivery Range (KM)" placeholder="Delivery Range in KM"
                type="number" value={form.deliveryRange} onChange={set("deliveryRange")} sx={field} />
              <TextField fullWidth size="small" label="Store Address" placeholder="Enter a location"
                value={form.address} onChange={set("address")} multiline rows={3} sx={field} />
            </Stack>
          </Paper>

          {/* Orders & Time Slot */}
          <Paper sx={{ p: 3, borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            {sectionLabel("Orders")}
            <Stack spacing={2.5}>
              <TextField fullWidth size="small" label="Order Per Time Slot" type="number"
                value={form.ordersPerSlot} onChange={set("ordersPerSlot")} sx={field} />

              <Divider />
              {sectionLabel("Time Slot")}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth size="small" label="Start Time" type="time"
                    value={form.startTime} onChange={set("startTime")}
                    InputLabelProps={{ shrink: true }} sx={field} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth size="small" label="End Time" type="time"
                    value={form.endTime} onChange={set("endTime")}
                    InputLabelProps={{ shrink: true }} sx={field} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth size="small" label="Time Slot Interval" type="number"
                    placeholder="e.g. 30 min" value={form.slotInterval} onChange={set("slotInterval")} sx={field} />
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          sx={{
            backgroundColor: "#4318ff",
            "&:hover": { backgroundColor: "#3311cc" },
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "700",
            px: 5, py: 1.5,
            boxShadow: "0 4px 12px rgba(67,24,255,0.3)",
          }}
        >
          Add Store
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/stores")}
          sx={{
            borderRadius: "12px", textTransform: "none",
            fontWeight: "700", px: 4,
            borderColor: "#e0e5f2", color: "#1b2559",
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

export default AddStore;
