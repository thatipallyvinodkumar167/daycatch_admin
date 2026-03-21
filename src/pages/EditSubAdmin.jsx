import React, { useState, useEffect } from "react";
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
import { genericApi } from "../api/genericApi";

const EditSubAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleName: "",
    password: "",
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default roles to show when API is unavailable
  const DEFAULT_ROLES = ["Super Admin", "Manager", "Delivery Manager", "Support", "Inventory Manager"];

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await genericApi.getAll("roles");
        const results = response.data.results || response.data || [];
        if (results.length > 0) {
          setRoles(results.map(r => ({ id: r._id, name: r.name })));
        } else {
          setRoles(DEFAULT_ROLES.map(name => ({ id: name, name })));
        }
      } catch {
        // Fallback to default roles if API fails
        setRoles(DEFAULT_ROLES.map(name => ({ id: name, name })));
      }
    };

    const fetchAdminDetails = async () => {
      try {
        setLoading(true);
        const response = await genericApi.getOne("sub-admin", id);
        const admin = response.data;
        
        if (admin) {
          setFormData(prev => ({
            ...prev,
            name: admin["Name"] || admin.name || "",
            email: admin["Email"] || admin["Email ID"] || admin.email || "",
            roleName: admin["role Name"] || admin.roleName || admin.role || "",
          }));
          setImagePreview(admin.Image || admin.image || admin.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin["Name"] || "Admin")}&background=random`);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin details:", error);
        setLoading(false);
      }
    };

    fetchRoles();
    fetchAdminDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      alert("Please fill in name and email.");
      return;
    }

    try {
      const payload = {
          "Name": formData.name,
          "Email": formData.email,
          "role Name": formData.roleName || "Manager",
      };
      
      if (formData.password) {
          payload["password"] = formData.password;
      }

      await genericApi.update("sub-admin", id, payload);
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Edit Sub-Admin
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Update the profile and permissions for this administrative user.
        </Typography>
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
              sx={{
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "700",
                px: 6,
                backgroundColor: "#2d60ff",
                "&:hover": { backgroundColor: "#2046cc" },
                boxShadow: "0 4px 12px rgba(45, 96, 255, 0.3)"
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
