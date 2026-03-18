import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
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
import {
  addArea,
  deleteArea,
  getAllAreas,
  getAllCities,
  updateArea,
} from "../api/areaManagementApi";
import {
  buildAreaPayloads,
  extractCollection,
  getErrorMessage,
  normalizeAreaRecord,
  normalizeCityRecord,
  runRequestWithPayloads,
} from "../utils/areaManagement";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const enrichAreasWithCities = (areaRecords, cityRecords) =>
    areaRecords.map((area) => {
      const matchedCity = cityRecords.find(
        (city) =>
          city.id === area.cityId ||
          city.code === area.cityId ||
          city.name.toLowerCase() === area.cityName.toLowerCase()
      );

      return {
        ...area,
        cityId: area.cityId || matchedCity?.id || "",
        cityName: area.cityName || matchedCity?.name || "Unassigned",
      };
    });

  useEffect(() => {
    const fetchAreaManagementData = async () => {
      setLoading(true);

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
          showSnackbar(
            getErrorMessage(
              citiesResult.reason,
              "Unable to load city options for areas."
            ),
            "error"
          );
        }

        if (areasResult.status === "rejected") {
          showSnackbar(
            getErrorMessage(areasResult.reason, "Unable to load areas right now."),
            "error"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAreaManagementData();
  }, []);

  const resetModalState = () => {
    setEditingArea(null);
    setFormData(initialFormState);
    setOpen(false);
  };

  const fetchAreasOnly = async () => {
    try {
      const response = await getAllAreas();
      const records = extractCollection(response, ["areas", "areaList"]).map(
        (area, index) => normalizeAreaRecord(area, index)
      );
      setAreas(enrichAreasWithCities(records, cities));
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Unable to refresh areas."), "error");
    }
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
        city.name.toLowerCase() === area.cityName.toLowerCase()
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
      showSnackbar("Please select a city for this area.", "error");
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
        showSnackbar("Area added successfully.");
      }

      resetModalState();
      await fetchAreasOnly();
    } catch (error) {
      showSnackbar(
        getErrorMessage(
          error,
          editingArea ? "Unable to update the area." : "Unable to add the area."
        ),
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (area) => {
    if (!window.confirm(`Delete "${area.name}" from the area list?`)) {
      return;
    }

    try {
      await deleteArea(area.backendId);
      showSnackbar("Area deleted successfully.");
      await fetchAreasOnly();
    } catch (error) {
      showSnackbar(getErrorMessage(error, "Unable to delete the area."), "error");
    }
  };

  const filteredAreas = areas.filter((area) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      area.name.toLowerCase().includes(query) ||
      area.cityName.toLowerCase().includes(query) ||
      area.status.toLowerCase().includes(query)
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
            Manage residential areas and societies for delivery mapping.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          disabled={!cities.length && !loading}
          sx={{
            backgroundColor: "#2d60ff",
            "&:hover": { backgroundColor: "#2046cc" },
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "700",
            px: 4,
            py: 1.2,
          }}
        >
          Add Area
        </Button>
      </Box>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          borderLeft: "6px solid #4318ff",
          width: "fit-content",
          minWidth: 250,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#e0e7ff" }}>
            <MapIcon sx={{ color: "#4318ff" }} />
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary" fontWeight="600">
              MAPPED AREAS
            </Typography>
            <Typography variant="h5" fontWeight="800" color="#1b2559">
              {areas.length}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper
        sx={{
          borderRadius: "20px",
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
            Areas Directory
          </Typography>
          <TextField
            size="small"
            placeholder="Search by area or city..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, width: "350px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CITY</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>AREA NAME</TableCell>
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
                        Loading areas...
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : filteredAreas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    {search.trim() ? "No matching areas found." : "No areas available yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAreas.map((area, index) => (
                  <TableRow key={area.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={area.cityName}
                        size="small"
                        variant="outlined"
                        sx={{ color: "#2d60ff", borderColor: "#2d60ff", fontWeight: "600" }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{area.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={area.status}
                        size="small"
                        sx={{
                          backgroundColor:
                            area.status.toLowerCase() === "active" ? "#e6f9ed" : "#fff4e5",
                          color:
                            area.status.toLowerCase() === "active" ? "#24d164" : "#b54708",
                          fontWeight: "700",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(area)}
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
                            onClick={() => handleDelete(area)}
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

      {!loading && !cities.length && (
        <Alert severity="warning" sx={{ mt: 2, borderRadius: "12px" }}>
          Add a city first to create mapped areas.
        </Alert>
      )}

      <Modal open={open} onClose={() => !submitting && resetModalState()}>
        <Box sx={modalStyle}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }} color="#1b2559">
            {editingArea ? "Edit Area" : "Add New Area"}
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select City</InputLabel>
            <Select
              value={formData.cityId}
              label="Select City"
              onChange={handleCityChange}
              sx={{ borderRadius: "12px" }}
              disabled={submitting || !cities.length}
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Area Name"
            value={formData.areaName}
            onChange={(event) =>
              setFormData((currentValue) => ({
                ...currentValue,
                areaName: event.target.value,
              }))
            }
            sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            disabled={submitting}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              onClick={resetModalState}
              sx={{ textTransform: "none", color: "#475467" }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || !cities.length}
              sx={{
                backgroundColor: "#2d60ff",
                borderRadius: "12px",
                textTransform: "none",
                px: 4,
                py: 1,
                fontWeight: "700",
              }}
            >
              {submitting ? "Saving..." : editingArea ? "Update Area" : "Add Area"}
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

export default AreaSociety;
