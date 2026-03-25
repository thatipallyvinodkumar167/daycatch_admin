import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreAddDeliveryBoy = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [cities, setCities] = useState([]);
  const [idTypes, setIdTypes] = useState([]);
  const [idFileName, setIdFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    city: store?.city || "",
    idType: "",
    idNumber: "",
    address: store?.address || "",
  });

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [cityResponse, idResponse] = await Promise.all([
          genericApi.getAll("cities"),
          genericApi.getAll("id"),
        ]);

        setCities(
          (cityResponse?.data?.results || []).map((city) => ({
            id: String(city._id ?? city.id ?? ""),
            name: city["City Name"] || city.name || "Unnamed City",
          }))
        );

        setIdTypes(
          (idResponse?.data?.results || []).map((idType) => ({
            id: String(idType._id ?? idType.id ?? ""),
            name: idType.name || idType.Title || "Untitled ID",
          }))
        );
      } catch (error) {
        console.error("Delivery boy lookup error:", error);
        setCities([]);
        setIdTypes([]);
      }
    };

    fetchLookupData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setIdFileName(file ? file.name : "");
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      setSnackbar({ open: true, message: "Name, phone, and password are required.", severity: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      await genericApi.create("deliveryboy", {
        "Boy Name": formData.name,
        "Boy Phone": formData.phone,
        "Boy Password": formData.password,
        Status: "Active",
        Orders: 0,
        "Total Earnings": 0,
        Rating: 0,
        Details: {
          Store: store?.name || "",
          City: formData.city,
          "ID Type": formData.idType,
          "ID Number": formData.idNumber,
          "ID Image": idFileName,
          Address: formData.address,
        },
      });

      setSnackbar({ open: true, message: "Delivery boy added successfully.", severity: "success" });
      setTimeout(() => navigate(-1), 1000);
    } catch (error) {
      console.error("Unable to create delivery boy:", error);
      setSnackbar({ open: true, message: "Failed to add delivery boy.", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1000px", mx: "auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2", borderRadius: "14px" }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Add Delivery Boy
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              Onboard a new delivery partner for {store.name}.
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: 5, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Boy Name</Typography>
                  <TextField fullWidth name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Boy Phone</Typography>
                  <TextField fullWidth name="phone" placeholder="Enter mobile number" value={formData.phone} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Password</Typography>
                  <TextField fullWidth type="password" name="password" placeholder="Create login password" value={formData.password} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Select City</Typography>
                  <TextField select fullWidth name="city" value={formData.city} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }}>
                    <MenuItem value="">Select City</MenuItem>
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.name}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Select ID</Typography>
                  <TextField select fullWidth name="idType" value={formData.idType} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }}>
                    <MenuItem value="">Select ID</MenuItem>
                    {idTypes.map((idType) => (
                      <MenuItem key={idType.id} value={idType.name}>
                        {idType.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>ID Number</Typography>
                  <TextField fullWidth name="idNumber" placeholder="Enter ID number" value={formData.idNumber} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>ID Image</Typography>
                  <Box sx={{ border: "2px dashed #e0e5f2", borderRadius: "16px", p: 3, textAlign: "center", bgcolor: "#fcfcfc" }}>
                    <UploadIcon sx={{ color: "#d1d9e2", mb: 1 }} />
                    <Typography variant="caption" sx={{ display: "block", mb: 1, color: "#a3aed0", fontWeight: 700 }}>
                      {idFileName || "No file chosen"}
                    </Typography>
                    <Button size="small" variant="outlined" sx={{ borderRadius: "10px", fontWeight: 800, textTransform: "none" }} onClick={() => fileInputRef.current?.click()}>
                      Choose file
                    </Button>
                    <input ref={fileInputRef} type="file" hidden onChange={handleFileChange} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5, ml: 1 }}>Boy Address</Typography>
                  <TextField fullWidth multiline rows={2} name="address" placeholder="Enter a location" value={formData.address} onChange={handleChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }} />
                </Box>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 5, borderColor: "#eef2f6" }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="text" onClick={() => navigate(-1)} sx={{ color: "#707eae", fontWeight: 800, px: 4 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{ borderRadius: "16px", py: 2, px: 6, bgcolor: "#E53935", fontWeight: 900, boxShadow: "0 10px 25px rgba(229, 57, 53,0.2)" }}
            >
              {isSubmitting ? "Registering..." : "Register Delivery Boy"}
            </Button>
          </Stack>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreAddDeliveryBoy;
