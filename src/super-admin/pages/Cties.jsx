import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Paper,
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
import LocationCityIcon from "@mui/icons-material/LocationCity";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import {
  addCity,
  deleteCity,
  getAllCities,
  updateCity,
} from "../../api/areaManagementApi";
import {
  buildCityPayloads,
  extractCollection,
  getErrorMessage,
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

const initialFormState = { cityName: "" };

const Cities = () => {
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingCity, setEditingCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const fetchCities = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const response = await getAllCities();
        const records = extractCollection(response, ["cities", "cityList"]);
        setCities(records.map((city, index) => normalizeCityRecord(city, index)));
      } catch (error) {
        setCities([]);
        showSnackbar(
          getErrorMessage(error, "Unable to load city data."),
          "error"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [showSnackbar]
  );

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  const resetModalState = () => {
    setEditingCity(null);
    setFormData(initialFormState);
    setOpen(false);
  };

  const handleOpenAdd = () => {
    setEditingCity(null);
    setFormData(initialFormState);
    setOpen(true);
  };

  const handleOpenEdit = (city) => {
    setEditingCity(city);
    setFormData({ cityName: city.name });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.cityName.trim()) {
      showSnackbar("City name is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payloads = buildCityPayloads(formData.cityName);

      if (editingCity) {
        await runRequestWithPayloads(
          (payload) => updateCity(editingCity.backendId, payload),
          payloads
        );
        showSnackbar("City updated successfully.");
      } else {
        await runRequestWithPayloads((payload) => addCity(payload), payloads);
        showSnackbar("New city added.");
      }

      resetModalState();
      await fetchCities(true);
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Failed to sync."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (city) => {
    if (!window.confirm(`Permanently delete "${city.name}"?`)) {
      return;
    }

    try {
      await deleteCity(city.backendId);
      showSnackbar("City deleted.");
      await fetchCities(true);
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Failed to delete city."), "error");
    }
  };

  const filteredCities = cities.filter((city) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      city.name.toLowerCase().includes(query) ||
      city.code.toLowerCase().includes(query)
    );
  });

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Cities
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage the cities where Daycatch services are available.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh List">
                <IconButton 
                    onClick={() => fetchCities(true)} 
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
                Add City
            </Button>
        </Stack>
      </Box>

      {/* Analytics Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", width: "fit-content", minWidth: 280, bgcolor: "#fff" }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box sx={{ p: 2, borderRadius: "16px", backgroundColor: "#f4f7fe" }}>
            <LocationCityIcon sx={{ color: "#4318ff", fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase" }}>
              Total Cities
            </Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              {cities.length} Cities
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Directory Paper */}
      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
        
        {/* Search Toolbar */}
        <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
            <Typography variant="subtitle1" fontWeight="800" color="#1b2559">City List</Typography>
            <TextField
                size="small"
                placeholder="Search cities..."
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
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>City ID</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>City Name</TableCell>
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
              ) : filteredCities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <Typography color="#a3aed0" fontWeight="600">No cities found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCities.map((city, index) => (
                  <TableRow 
                    key={city.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", pl: 4 }}>#{index + 1}</TableCell>
                    <TableCell sx={{ color: "#4318ff", fontWeight: "800", fontSize: "14px" }}>{city.code}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "800", fontSize: "15px" }}>{city.name}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit City">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(city)}
                            sx={{ backgroundColor: "#f4f7fe", color: "#4318ff", borderRadius: "10px", "&:hover": { backgroundColor: "#e0e5f2" }, p: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete City">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(city)}
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

      {/* Premium Modal */}
      <Modal open={open} onClose={() => !submitting && resetModalState()}>
        <Box sx={modalStyle}>
          <Typography variant="h5" fontWeight="800" sx={{ mb: 1 }} color="#1b2559">
            {editingCity ? "Edit City" : "Add City"}
          </Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600" sx={{ mb: 4 }}>
            Enter city details to manage locations.
          </Typography>

          <Box sx={{ mb: 5 }}>
            <Typography variant="body2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>CITY NAME</Typography>
            <TextField
              fullWidth
              placeholder="e.g. Hyderabad, Mumbai..."
              value={formData.cityName}
              onChange={(e) => setFormData({ cityName: e.target.value })}
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
              disabled={submitting}
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
              {submitting ? "Saving..." : editingCity ? "Update City" : "Add City"}
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

export default Cities;


