import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
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
import {
  addCity,
  deleteCity,
  getAllCities,
  updateCity,
} from "../api/areaManagementApi";
import {
  buildCityPayloads,
  extractCollection,
  getErrorMessage,
  normalizeCityRecord,
  runRequestWithPayloads,
} from "../utils/areaManagement";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const fetchCities = useCallback(
    async ({ showLoader = true } = {}) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        const response = await getAllCities();
        const records = extractCollection(response, ["cities", "cityList"]);
        setCities(records.map((city, index) => normalizeCityRecord(city, index)));
      } catch (error) {
        setCities([]);
        showSnackbar(
          getErrorMessage(error, "Unable to load cities right now."),
          "error"
        );
      } finally {
        if (showLoader) {
          setLoading(false);
        }
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
        showSnackbar("City added successfully.");
      }

      resetModalState();
      await fetchCities({ showLoader: false });
    } catch (error) {
      showSnackbar(
        getErrorMessage(
          error,
          editingCity ? "Unable to update the city." : "Unable to add the city."
        ),
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (city) => {
    if (!window.confirm(`Delete "${city.name}" from the city list?`)) {
      return;
    }

    try {
      await deleteCity(city.backendId);
      showSnackbar("City deleted successfully.");
      await fetchCities({ showLoader: false });
    } catch (error) {
      showSnackbar(
        getErrorMessage(error, "Unable to delete the city."),
        "error"
      );
    }
  };

  const filteredCities = cities.filter((city) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      city.name.toLowerCase().includes(query) ||
      city.code.toLowerCase().includes(query) ||
      city.status.toLowerCase().includes(query)
    );
  });

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">
            Hi, Day Catch Super Admin Panel.
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Manage the cities where your services are available.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            backgroundColor: "#2d60ff",
            "&:hover": { backgroundColor: "#2046cc" },
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: "600",
            px: 3,
          }}
        >
          Add City
        </Button>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          borderLeft: "6px solid #2d60ff",
          width: "fit-content",
          minWidth: 200,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#e0e7ff" }}>
            <LocationCityIcon sx={{ color: "#2d60ff" }} />
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary" fontWeight="600">
              TOTAL CITIES
            </Typography>
            <Typography variant="h5" fontWeight="800" color="#1b2559">
              {cities.length}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        sx={{
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1",
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            City Directory
          </Typography>
          <TextField
            size="small"
            placeholder="Search by city name or ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "300px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CITY ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CITY NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Stack alignItems="center" spacing={1}>
                      <CircularProgress size={28} />
                      <Typography variant="body2" color="textSecondary">
                        Loading cities...
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : filteredCities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    {search.trim() ? "No matching cities found." : "No cities available yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCities.map((city, index) => (
                  <TableRow key={city.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "700" }}>{city.code}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{city.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={city.status}
                        size="small"
                        sx={{
                          backgroundColor:
                            city.status.toLowerCase() === "active" ? "#e6f9ed" : "#fff4e5",
                          color:
                            city.status.toLowerCase() === "active" ? "#24d164" : "#b54708",
                          fontWeight: "700",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(city)}
                            sx={{
                              backgroundColor: "#00d26a",
                              color: "#fff",
                              borderRadius: "10px",
                              "&:hover": { backgroundColor: "#00b85c" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(city)}
                            sx={{
                              backgroundColor: "#ff4d49",
                              color: "#fff",
                              borderRadius: "10px",
                              "&:hover": { backgroundColor: "#e03e3e" },
                            }}
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

      <Modal open={open} onClose={() => !submitting && resetModalState()}>
        <Box sx={modalStyle}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>
            {editingCity ? "Edit City" : "Add New City"}
          </Typography>
          <TextField
            fullWidth
            label="City Name"
            value={formData.cityName}
            onChange={(event) =>
              setFormData((currentValue) => ({
                ...currentValue,
                cityName: event.target.value,
              }))
            }
            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            disabled={submitting}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={resetModalState} sx={{ textTransform: "none" }} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                backgroundColor: "#2d60ff",
                borderRadius: "10px",
                textTransform: "none",
                px: 3,
              }}
            >
              {submitting ? "Saving..." : editingCity ? "Update City" : "Add City"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((currentValue) => ({ ...currentValue, open: false }))
        }
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((currentValue) => ({ ...currentValue, open: false }))
          }
          sx={{ borderRadius: "10px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Cities;
