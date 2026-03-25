import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { genericApi } from "../../api/genericApi";
import { subAdminApi } from "../../api/subAdminApi";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AddSubAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roleName: "",
    scope: "platform",
    storeId: "",
    status: "Active",
    password: "",
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [roles, setRoles] = useState([]);
  const [stores, setStores] = useState([]);

  const DEFAULT_ROLES = useCallback(() => ["Manager", "Delivery Manager", "Support", "Inventory Manager", "Store Manager"], []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await genericApi.getAll("roles");
      const results = response?.data?.results || response?.data?.data || response?.data || [];
      if (results.length > 0) {
        setRoles(
          results
            .filter((role) => role.name !== "Super Admin")
            .map((role) => ({ id: role._id, name: role.name }))
        );
      } else {
        setRoles(DEFAULT_ROLES().map(name => ({ id: name, name })));
      }
    } catch {
      setRoles(DEFAULT_ROLES().map(name => ({ id: name, name })));
    }
  }, [DEFAULT_ROLES]);

  useEffect(() => {
    fetchRoles();
    const fetchStores = async () => {
      try {
        const response = await genericApi.getAll("storeList");
        const results = response?.data?.results || response?.data?.data || response?.data || [];
        setStores(
          results.map((store) => ({
            id: store._id || store.id,
            name: store["Store Name"] || store.name || "Unnamed Store"
          }))
        );
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, [fetchRoles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
      ...(name === "scope" && value !== "store" ? { storeId: "" } : {}),
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        setFormData((current) => ({ ...current, image: file }));
        setImagePreview(dataUrl);
      } catch (error) {
        console.error("Unable to process image:", error);
        alert("Failed to read the image file.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.roleName || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.scope === "store" && !formData.storeId) {
      alert("Please assign a store for a store sub-admin.");
      return;
    }

    try {
      const assignedStore = stores.find((store) => store.id === formData.storeId);
      const payload = {
          "Name": formData.name,
          "Email": formData.email,
          "phone": formData.phone,
          "role Name": formData.roleName,
          "scope": formData.scope,
          "storeId": formData.scope === "store" ? formData.storeId : "",
          "storeName": formData.scope === "store" ? assignedStore?.name || "" : "",
          "status": formData.status,
          "password": formData.password,
          "Image": imagePreview || ""
      };

      await subAdminApi.create(payload);
      
      alert("Sub-Admin added successfully!");
      navigate("/sub-admin");
    } catch (error) {
      console.error("Error adding sub-admin:", error);
      alert("Failed to add sub-admin.");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton
          onClick={() => navigate("/sub-admin")}
          sx={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">Add Sub-Admin</Typography>
          <Typography variant="body2" color="textSecondary">
            Create a new administrative user with specific access roles.
          </Typography>
        </Box>
      </Box>

      <Paper
        sx={{
          p: 6,
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          maxWidth: "900px",
          mx: "auto",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle1" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            Account Information
          </Typography>
          <Grid container spacing={4}>
            {/* Image Upload Section */}
            <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                <Box sx={{ position: "relative" }}>
                    <Avatar 
                        src={imagePreview} 
                        sx={{ width: 120, height: 120, border: "4px solid #fff", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                    />
                    <IconButton 
                        color="primary" 
                        aria-label="upload picture" 
                        component="label"
                        sx={{ 
                            position: "absolute", 
                            bottom: 0, 
                            right: 0, 
                            backgroundColor: "#fff",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            "&:hover": { backgroundColor: "#f5f5f5" }
                        }}
                    >
                        <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                        <PhotoCamera />
                    </IconButton>
                </Box>
                <Typography variant="body2" sx={{ mt: 2, color: "textSecondary" }}>
                    {formData.image ? formData.image.name : "No file chosen"}
                </Typography>
            </Grid>

            {/* Name Field */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                Sub Admin Name
              </Typography>
              <TextField
                fullWidth
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                Email 
              </Typography>
              <TextField
                fullWidth
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                autoComplete="off"
                inputProps={{ autoComplete: "off" }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                Mobile Number
              </Typography>
              <TextField
                fullWidth
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </Grid>

            {/* Role Name Select */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                Role Name
              </Typography>
              <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
                <InputLabel id="role-select-label">Select Role Name</InputLabel>
                <Select
                  labelId="role-select-label"
                  name="roleName"
                  value={formData.roleName}
                  label="Select Role Name"
                  onChange={handleInputChange}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                Access Scope
              </Typography>
              <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
                <InputLabel id="scope-select-label">Select Scope</InputLabel>
                <Select
                  labelId="scope-select-label"
                  name="scope"
                  value={formData.scope}
                  label="Select Scope"
                  onChange={handleInputChange}
                >
                  <MenuItem value="platform">Platform</MenuItem>
                  <MenuItem value="store">Store</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.scope === "store" ? (
              <Grid item xs={12} md={6}>
                <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                  Assign Store
                </Typography>
                <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
                  <InputLabel id="store-select-label">Select Store</InputLabel>
                  <Select
                    labelId="store-select-label"
                    name="storeId"
                    value={formData.storeId}
                    label="Select Store"
                    onChange={handleInputChange}
                  >
                    {stores.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ) : null}

            {/* Password Field */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                variant="outlined"
                autoComplete="new-password"
                inputProps={{ autoComplete: "new-password" }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}

                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                Status
              </Typography>
              <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
                <InputLabel id="status-select-label">Select Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  name="status"
                  value={formData.status}
                  label="Select Status"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 6 }}>
            <Button
              variant="outlined"
              onClick={() => navigate("/sub-admin")}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "700",
                px: 4,
                borderColor: "#e0e5f2",
                color: "#1b2559",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "700",
                px: 5, py: 1.5,
                backgroundColor: "#4318ff",
                "&:hover": { backgroundColor: "#3311cc" },
                boxShadow: "0 4px 12px rgba(67, 24, 255, 0.3)"
              }}
            >
              Submit Admin
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddSubAdmin;


