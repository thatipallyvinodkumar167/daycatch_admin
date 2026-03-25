import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Modal,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MapIcon from "@mui/icons-material/Map";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import {
  addArea,
  deleteArea,
  getAllAreas,
  getAllCities,
  updateArea,
} from "../../api/areaManagementApi";
import {
  buildAreaPayloads,
  extractCollection,
  getErrorMessage,
  normalizeAreaRecord,
  normalizeCityRecord,
  runRequestWithPayloads,
} from "../../utils/areaManagement";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  bgcolor: "#fff",
  borderRadius: "24px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  p: 4,
  outline: "none",
  border: "1px solid #e0e5f2"
};

const initialFormState = {
  areaName: "",
  cityId: "",
  cityName: "",
};

const AreaSociety = () => {
  const [areas, setAreas] = useState([]);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingArea, setEditingArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const enrichAreasWithCities = useCallback((areaRecords, cityRecords) =>
    areaRecords.map((area) => {
      const matchedCity = cityRecords.find(
        (city) =>
          city.id === area.cityId ||
          city.code === area.cityId ||
          (city.name && area.cityName && city.name.toLowerCase() === area.cityName.toLowerCase())
      );

      return {
        ...area,
        cityId: area.cityId || matchedCity?.id || "",
        cityName: area.cityName || matchedCity?.name || "Unassigned",
      };
    }), []);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [areasResult, citiesResult] = await Promise.allSettled([
        getAllAreas(),
        getAllCities(),
      ]);

      const normalizedCities =
        citiesResult.status === "fulfilled"
          ? extractCollection(citiesResult.value, ["cities", "cityList"]).map(
              (city, index) => normalizeCityRecord(city, index)
            )
          : [];

      const normalizedAreas =
        areasResult.status === "fulfilled"
          ? extractCollection(areasResult.value, ["areas", "areaList"]).map(
              (area, index) => normalizeAreaRecord(area, index)
            )
          : [];

      setCities(normalizedCities);
      setAreas(enrichAreasWithCities(normalizedAreas, normalizedCities));

      if (citiesResult.status === "rejected") {
        showSnackbar(getErrorMessage(citiesResult.reason, "Unable to load cities."), "error");
      }
      if (areasResult.status === "rejected") {
        showSnackbar(getErrorMessage(areasResult.reason, "Unable to load areas."), "error");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [enrichAreasWithCities]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetModalState = () => {
    setEditingArea(null);
    setFormData(initialFormState);
    setOpen(false);
  };

  const handleOpenAdd = () => {
    setEditingArea(null);
    setFormData(initialFormState);
    setOpen(true);
  };

  const handleOpenEdit = (area) => {
    const matchedCity = cities.find(
        (city) =>
          city.id === area.cityId ||
          city.code === area.cityId ||
          (city.name && area.cityName && city.name.toLowerCase() === area.cityName.toLowerCase())
    );

    setEditingArea(area);
    setFormData({
      areaName: area.name,
      cityId: matchedCity?.id || area.cityId || "",
      cityName: matchedCity?.name || area.cityName || "",
    });
    setOpen(true);
  };

  const handleCityChange = (event) => {
    const selectedCity = cities.find((city) => city.id === event.target.value);
    setFormData((currentValue) => ({
      ...currentValue,
      cityId: selectedCity?.id || "",
      cityName: selectedCity?.name || "",
    }));
  };

  const handleSubmit = async () => {
    if (!formData.cityId || !formData.cityName) {
      showSnackbar("Please select a city.", "error");
      return;
    }

    if (!formData.areaName.trim()) {
      showSnackbar("Area name is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payloads = buildAreaPayloads({
        name: formData.areaName,
        cityId: formData.cityId,
        cityName: formData.cityName,
      });

      if (editingArea) {
        await runRequestWithPayloads(
          (payload) => updateArea(editingArea.backendId, payload),
          payloads
        );
        showSnackbar("Area updated successfully.");
      } else {
        await runRequestWithPayloads((payload) => addArea(payload), payloads);
        showSnackbar("New area added.");
      }

      resetModalState();
      await fetchData(true);
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Failed to sync."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (area) => {
    if (!window.confirm(`Permanently delete "${area.name}"?`)) {
      return;
    }

    try {
      await deleteArea(area.backendId);
      showSnackbar("Area deleted successfully.");
      await fetchData(true);
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Failed to delete area."), "error");
    }
  };

  const filteredAreas = areas.filter((area) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      area.name.toLowerCase().includes(query) ||
      area.cityName.toLowerCase().includes(query)
    );
  });

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Society / Areas
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage residential areas and societies for delivery locations.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh List">
                <IconButton 
                    onClick={() => fetchData(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleOpenAdd}
                disabled={!cities.length && !loading}
                sx={{ 
                    backgroundColor: "#4318ff", 
                    "&:hover": { backgroundColor: "#3311cc" },
                    borderRadius: "14px",
                    textTransform: "none",
                    px: 4,
                    fontWeight: "800",
                    boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                }}
            >
                Add Area
            </Button>
        </Stack>
      </Box>

      {/* Analytics Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", width: "fit-content", minWidth: 280, bgcolor: "#fff" }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box sx={{ p: 2, borderRadius: "16px", backgroundColor: "#f4f7fe" }}>
            <MapIcon sx={{ color: "#4318ff", fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase" }}>
              Total Areas
            </Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              {areas.length}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Directory Paper */}
      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
        
        {/* Search Toolbar */}
        <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
            <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Area List</Typography>
            <TextField
                size="small"
                placeholder="Search areas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                }}
                sx={{ 
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "12px", 
                        backgroundColor: "#fff",
                        width: "360px"
                    } 
                }}
            />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f4f7fe" }}>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pl: 4 }}>#</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>City</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>Area Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pr: 4 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <CircularProgress sx={{ color: "#4318ff" }} />
                  </TableCell>
                </TableRow>
              ) : filteredAreas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <Typography color="#a3aed0" fontWeight="600">No areas found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAreas.map((area, index) => (
                  <TableRow 
                    key={area.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", pl: 4 }}>#{index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={area.cityName}
                        size="small"
                        sx={{ bgcolor: "#f4f7fe", color: "#4318ff", fontWeight: "800", borderRadius: "8px" }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "800", fontSize: "15px" }}>{area.name}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Area">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(area)}
                            sx={{ backgroundColor: "#f4f7fe", color: "#4318ff", borderRadius: "10px", "&:hover": { backgroundColor: "#e0e5f2" }, p: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Area">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(area)}
                            sx={{ backgroundColor: "#fff5f5", color: "#ff4d49", borderRadius: "10px", "&:hover": { backgroundColor: "#ffebeb" }, p: 1 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {!loading && !cities.length && (
        <Alert severity="warning" sx={{ mt: 3, borderRadius: "14px", fontWeight: "600" }}>
          Please add cities before adding areas.
        </Alert>
      )}

      {/* Premium Modal */}
      <Modal open={open} onClose={() => !submitting && resetModalState()}>
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight="800" sx={{ mb: 1 }} color="#1b2559">
            {editingArea ? "Edit Area" : "Add Area"}
          </Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600" sx={{ mb: 4 }}>
            Enter area details for delivery locations.
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>CITY</Typography>
            <Select
              value={formData.cityId}
              onChange={handleCityChange}
              displayEmpty
              sx={{ borderRadius: "14px", backgroundColor: "#f4f7fe", "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
              disabled={submitting}
            >
              <MenuItem value="" disabled><Typography variant="body2" color="#a3aed0">Select City</Typography></MenuItem>
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                    <Typography variant="body2" fontWeight="700">{city.name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 5 }}>
            <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>AREA NAME</Typography>
            <TextField
              fullWidth
              placeholder="e.g. Jubilee Hills Sector 1"
              value={formData.areaName}
              onChange={(e) => setFormData(prev => ({ ...prev, areaName: e.target.value }))}
              sx={{ 
                "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" }
              }}
              disabled={submitting}
            />
          </Box>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={resetModalState}
              sx={{ textTransform: "none", color: "#a3aed0", fontWeight: "800" }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !cities.length}
              sx={{
                backgroundColor: "#4318ff",
                "&:hover": { backgroundColor: "#3311cc" },
                borderRadius: "14px",
                textTransform: "none",
                px: 4,
                py: 1.5,
                fontWeight: "800",
                boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
              }}
            >
              {submitting ? "Saving..." : editingArea ? "Update Area" : "Add Area"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          sx={{ borderRadius: "14px", fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AreaSociety;


