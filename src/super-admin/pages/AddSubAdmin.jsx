import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { subAdminApi } from "../../api/subAdminApi";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const normalizeCollection = (response) => response?.data?.results || response?.data?.data || response?.data || [];

const normalizeCity = (city, index) => ({
  id: city.city_id || city.id || index + 1,
  name: city.city_name || city.name || "Unnamed City",
});

const normalizeStore = (store, index) => ({
  id: store.id || store._id || index + 1,
  name: store.store_name || store["Store Name"] || store.name || "Unnamed Store",
  cityId: store.city_id || store.cityId || "",
  cityName: store.city || store.city_name || store.City || "N/A",
});

const AddSubAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roleName: "",
    status: "Active",
    password: "",
    cityIds: [],
    image: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [roles, setRoles] = useState([]);
  const [cities, setCities] = useState([]);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse, citiesResponse, storesResponse] = await Promise.allSettled([
          genericApi.getAll("roles"),
          genericApi.getAll("cities"),
          genericApi.getAll("storeList"),
        ]);

        const roleRecords =
          rolesResponse.status === "fulfilled"
            ? normalizeCollection(rolesResponse.value).map((role, index) => ({
                id: role.role_id || role.id || index + 1,
                name: role.role_name || role.name || "Manager",
              }))
            : [];
        setRoles(roleRecords.length ? roleRecords.filter((role) => role.name !== "Super Admin") : [
          { id: 1, name: "Manager" },
          { id: 2, name: "Store Manager" },
          { id: 3, name: "Support" },
        ]);

        const cityRecords =
          citiesResponse.status === "fulfilled"
            ? normalizeCollection(citiesResponse.value).map(normalizeCity)
            : [];
        setCities(cityRecords);

        const storeRecords =
          storesResponse.status === "fulfilled"
            ? normalizeCollection(storesResponse.value).map(normalizeStore)
            : [];
        setStores(storeRecords);
      } catch (error) {
        console.error("Unable to load sub-admin setup data:", error);
      }
    };

    fetchData();
  }, []);

  const cityNameMap = useMemo(
    () => new Map(cities.map((city) => [String(city.id), city.name])),
    [cities]
  );

  const scopedStores = useMemo(() => {
    if (!formData.cityIds.length) return [];
    const selected = new Set(formData.cityIds.map(String));
    return stores.filter((store) => selected.has(String(store.cityId)));
  }, [formData.cityIds, stores]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleCityChange = (event) => {
    const value = event.target.value;
    setFormData((current) => ({
      ...current,
      cityIds: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormData((current) => ({ ...current, image: file }));
      setImagePreview(dataUrl);
    } catch (error) {
      console.error("Unable to read image:", error);
      alert("Failed to read the selected image.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.roleName || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!formData.cityIds.length) {
      alert("Please assign at least one city.");
      return;
    }

    const payload = {
      Name: formData.name,
      Email: formData.email,
      phone: formData.phone,
      "role Name": formData.roleName,
      status: formData.status,
      password: formData.password,
      Image: imagePreview || "",
      city_ids: formData.cityIds.map((value) => Number(value)),
    };

    try {
      await subAdminApi.create(payload);
      alert("Sub-admin created with city-based access.");
      navigate("/sub-admin");
    } catch (error) {
      console.error("Error creating sub-admin:", error);
      alert("Failed to create sub-admin.");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <IconButton onClick={() => navigate("/sub-admin")} sx={{ backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">Add Sub-Admin</Typography>
          <Typography variant="body2" color="textSecondary">
            Create a sub-admin and assign the cities whose stores they can access.
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 6, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", maxWidth: "980px", mx: "auto" }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle1" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            Account Information
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar src={imagePreview} sx={{ width: 120, height: 120, border: "4px solid #fff", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} />
                <IconButton
                  color="primary"
                  component="label"
                  sx={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", "&:hover": { backgroundColor: "#f5f5f5" } }}
                >
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                  <PhotoCamera />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ mt: 2, color: "textSecondary" }}>
                {formData.image ? formData.image.name : "No file chosen"}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Sub Admin Name</Typography>
              <TextField fullWidth name="name" placeholder="Enter full name" value={formData.name} onChange={handleInputChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Email</Typography>
              <TextField fullWidth name="email" type="email" placeholder="admin@example.com" value={formData.email} onChange={handleInputChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Mobile Number</Typography>
              <TextField fullWidth name="phone" placeholder="9876543210" value={formData.phone} onChange={handleInputChange} sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Role Name</Typography>
              <FormControl fullWidth>
                <InputLabel id="role-select-label">Select Role</InputLabel>
                <Select labelId="role-select-label" name="roleName" value={formData.roleName} label="Select Role" onChange={handleInputChange} sx={{ borderRadius: "12px" }}>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Assigned Cities</Typography>
              <FormControl fullWidth>
                <InputLabel id="city-select-label">Select Cities</InputLabel>
                <Select
                  labelId="city-select-label"
                  multiple
                  value={formData.cityIds}
                  onChange={handleCityChange}
                  input={<OutlinedInput label="Select Cities" />}
                  renderValue={(selected) => selected.map((value) => cityNameMap.get(String(value)) || value).join(", ")}
                  sx={{ borderRadius: "12px" }}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.id} value={String(city.id)}>
                      <Checkbox checked={formData.cityIds.map(String).includes(String(city.id))} />
                      <ListItemText primary={city.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Password</Typography>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((current) => !current)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Status</Typography>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Select Status</InputLabel>
                <Select labelId="status-select-label" name="status" value={formData.status} label="Select Status" onChange={handleInputChange} sx={{ borderRadius: "12px" }}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ borderRadius: "16px", borderColor: "#e0e5f2", p: 3, backgroundColor: "#fbfcff" }}>
                <Typography variant="body2" fontWeight="800" color="#1b2559" sx={{ mb: 1.5 }}>
                  Store Coverage Preview
                </Typography>
                <Typography variant="caption" color="#8f9bba" sx={{ display: "block", mb: 2 }}>
                  The sub-admin will automatically see stores from these assigned cities.
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {scopedStores.length ? scopedStores.map((store) => (
                    <Chip key={store.id} label={`${store.name} - ${store.cityName}`} sx={{ borderRadius: "10px", bgcolor: "#eef2ff", color: "#4318ff", fontWeight: 700 }} />
                  )) : (
                    <Typography variant="body2" color="#a3aed0">Select cities to preview accessible stores.</Typography>
                  )}
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 6 }}>
            <Button variant="outlined" onClick={() => navigate("/sub-admin")} sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "700", px: 4, borderColor: "#e0e5f2", color: "#1b2559" }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ borderRadius: "12px", textTransform: "none", fontWeight: "700", px: 5, py: 1.5, backgroundColor: "#4318ff", "&:hover": { backgroundColor: "#3311cc" }, boxShadow: "0 4px 12px rgba(67, 24, 255, 0.3)" }}
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
