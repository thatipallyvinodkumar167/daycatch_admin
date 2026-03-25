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
import { useNavigate, useParams } from "react-router-dom";
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

const EditSubAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roleName: "",
    scope: "platform",
    storeId: "",
    password: "",
    status: "",
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [roles, setRoles] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default roles to show when API is unavailable
  const DEFAULT_ROLES = useCallback(() => ["Manager", "Delivery Manager", "Support", "Inventory Manager", "Store Manager"], []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await genericApi.getAll("roles");
      const results = response?.data?.results || response?.data?.data || response?.data || [];
      if (results.length > 0) {
        setRoles(results.filter((role) => role.name !== "Super Admin").map(r => ({ id: r._id, name: r.name })));
      } else {
        setRoles(DEFAULT_ROLES().map(name => ({ id: name, name })));
      }
    } catch {
      // Fallback to default roles if API fails
      setRoles(DEFAULT_ROLES().map(name => ({ id: name, name })));
    }
  }, [DEFAULT_ROLES]);

  const fetchAdminDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await subAdminApi.getOne(id);
      const admin = response?.data?.data;
      
      if (admin) {
        setFormData(prev => ({
          ...prev,
          name: admin["Name"] || admin.name || "",
          email: admin["Email"] || admin["Email ID"] || admin.email || "",
          phone: admin.phone || admin["Mobile Number"] || admin.Phone || "",
          roleName: admin["role Name"] || admin.roleName || admin.role || "",
          scope: admin.scope || "platform",
          storeId: admin.storeId || "",
          status: admin.status || admin.Status || "Active",
        }));
        setImagePreview(admin.Image || admin.image || admin.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin["Name"] || "Admin")}&background=random`);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin details:", error);
      setLoading(false);
    }
  }, [id]);

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
    fetchAdminDetails();
  }, [fetchRoles, fetchAdminDetails]);

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
    
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in name, email, and phone.");
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
          "role Name": formData.roleName || "Manager",
          "scope": formData.scope,
          "storeId": formData.scope === "store" ? formData.storeId : "",
          "storeName": formData.scope === "store" ? assignedStore?.name || "" : "",
          "status": formData.status || "Active",
      };
      
      if (formData.password) {
          payload["password"] = formData.password;
      }

      if (imagePreview) {
          payload["Image"] = imagePreview;
      }

      await subAdminApi.update(id, payload);
      alert("Sub-Admin updated successfully!");
      navigate("/sub-admin");
    } catch (error) {
      console.error("Error updating sub-admin:", error);
      alert("Failed to update sub-admin.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading admin details...</Typography>
      </Box>
    );
  }

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
          <Typography variant="h4" fontWeight="700" color="#2b3674">Edit Sub-Admin</Typography>
          <Typography variant="body2" color="textSecondary">
            Update the profile and permissions for this administrative user.
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
                    {formData.image ? formData.image.name : "Change Profile Picture"}
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

            {/* Password Field (Optional on edit) */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                New Password (leave blank to keep current)
              </Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                variant="outlined"
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

            {/* Status Select */}
            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>
                Status
              </Typography>
              <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
                <InputLabel id="status-select-label">Select Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  name="status"
                  value={formData.status || "Active"}
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
              Update Admin
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default EditSubAdmin;


