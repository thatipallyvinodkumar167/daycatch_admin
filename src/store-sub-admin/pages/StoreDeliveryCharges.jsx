import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  ListItemText,
  MenuItem,
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
  Typography,
  alpha,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  DeleteOutline as DeleteIcon,
  EditOutlined as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const getChargeValue = (row) => {
  const charge = row?.["Delivery Charge"] ?? row?.deliveryCharge ?? row?.charge;
  if (charge === undefined || charge === null || charge === "") return null;
  const parsed = Number(charge);
  return Number.isFinite(parsed) ? parsed : null;
};

function StoreDeliveryCharges() {
  const { store } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editingArea, setEditingArea] = useState(null);
  const [editChargeValue, setEditChargeValue] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [selectOpen, setSelectOpen] = useState(false);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await genericApi.getAll("area");
        const rows = response?.data?.results || [];
        const normalizedStoreCity = String(store?.city || "").trim().toLowerCase();
        const scopedAreas = rows
          .filter((row) => {
            if (!normalizedStoreCity) return true;
            return String(row?.["City Name"] || row?.city || "")
              .trim()
              .toLowerCase() === normalizedStoreCity;
          })
          .map((row) => ({
            id: String(row._id ?? row.id ?? ""),
            society: row?.["Society Name"] || row?.society || "Unnamed Society",
            city: row?.["City Name"] || row?.city || "Unknown City",
            charge: getChargeValue(row),
          }));

        setTableData(scopedAreas);
      } catch (error) {
        console.error("Unable to load delivery areas:", error);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [store?.city]);

  const areaOptions = useMemo(
    () => [...new Set(tableData.map((row) => row.society))],
    [tableData]
  );

  const filteredData = useMemo(
    () =>
      tableData.filter((item) => {
        const matchesSearch =
          item.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.city.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSelection =
          selectedAreas.length === 0 || selectedAreas.includes(item.society);

        return matchesSearch && matchesSelection;
      }),
    [searchTerm, selectedAreas, tableData]
  );

  const isAllSelected = areaOptions.length > 0 && selectedAreas.length === areaOptions.length;

  const handleAreaChange = (event) => {
    const { value } = event.target;
    
    // Check if Select All was clicked
    if (value[value.length - 1] === "all") {
      setSelectedAreas(selectedAreas.length === areaOptions.length ? [] : areaOptions);
    } else {
      setSelectedAreas(typeof value === "string" ? value.split(",") : value);
    }
    // Auto-close on any interaction as requested
    setSelectOpen(false);
  };

  const handleOpenEdit = (row) => {
    setEditingArea(row);
    setEditChargeValue(row.charge ?? "");
  };

  const handleCloseEdit = () => {
    if (saving) return;
    setEditingArea(null);
    setEditChargeValue("");
  };

  const handleEditCharge = async () => {
    const parsedCharge = Number(editChargeValue);
    if (!Number.isFinite(parsedCharge) || parsedCharge < 0) {
      setSnackbar({ open: true, message: "Enter a valid delivery charge.", severity: "error" });
      return;
    }

    try {
      setSaving(true);
      await genericApi.update("area", editingArea.id, { "Delivery Charge": parsedCharge });
      setTableData((current) =>
        current.map((item) =>
          item.id === editingArea.id ? { ...item, charge: parsedCharge } : item
        )
      );
      setEditingArea(null);
      setEditChargeValue("");
      setSnackbar({ open: true, message: "Delivery charge updated.", severity: "success" });
    } catch (error) {
      console.error("Unable to update delivery charge:", error);
      setSnackbar({ open: true, message: "Failed to update delivery charge.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArea = async (row) => {
    if (!window.confirm(`Delete ${row.society} from delivery charges?`)) return;

    try {
      await genericApi.remove("area", row.id);
      setTableData((current) => current.filter((item) => item.id !== row.id));
      setSelectedAreas((current) => current.filter((area) => area !== row.society));
      setSnackbar({ open: true, message: "Area removed successfully.", severity: "success" });
    } catch (error) {
      console.error("Unable to delete area:", error);
      setSnackbar({ open: true, message: "Failed to remove area.", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#E53935" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>

        {/* Page Header */}
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Delivery Charges
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Manage serviceable zones for {store.name}
            </Typography>
          </Box>
        </Box>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "24px", boxShadow: "0 18px 40px rgba(15,23,42,0.04)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
          <Stack spacing={4}>
            {/* Area Selector */}
            <Stack direction="row" spacing={3} alignItems="flex-end" flexWrap="wrap" useFlexGap>
              <Box sx={{ minWidth: "300px", flex: 1 }}>
                <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ display: "block", mb: 1, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Select Your Serviceable Area
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    multiple
                    displayEmpty
                    open={selectOpen}
                    onOpen={() => setSelectOpen(true)}
                    onClose={() => setSelectOpen(false)}
                    value={selectedAreas}
                    onChange={handleAreaChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) return <em>All areas</em>;
                      if (selected.length === areaOptions.length) return <strong>All areas selected</strong>;
                      return selected.join(", ");
                    }}
                    sx={{
                      borderRadius: "14px",
                      bgcolor: "#f8f9fc",
                      "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                    }}
                  >
                    <MenuItem value="all" sx={{ borderBottom: "1px solid #eef2f6", mb: 0.5, py: 1.5 }}>
                      <Checkbox 
                        checked={isAllSelected} 
                        indeterminate={selectedAreas.length > 0 && selectedAreas.length < areaOptions.length}
                        sx={{ color: "#E53935", "&.Mui-checked": { color: "#E53935" } }} 
                      />
                      <ListItemText primary="Select All" primaryTypographyProps={{ fontWeight: 900, color: "#1b2559" }} />
                    </MenuItem>
                    {areaOptions.map((area) => (
                      <MenuItem key={area} value={area}>
                        <Checkbox checked={selectedAreas.indexOf(area) > -1} sx={{ color: "#E53935", "&.Mui-checked": { color: "#E53935" } }} />
                        <ListItemText primary={area} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            {/* Table Section */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
                <Typography variant="h5" sx={{ fontWeight: 900, color: "#1b2559", letterSpacing: "-1px" }}>
                  Society Wise Charges
                </Typography>
                <TextField
                  placeholder="Search society..."
                  size="small"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "#a3aed0" }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: "14px",
                      bgcolor: "#f8f9fc",
                      width: "300px",
                      fontWeight: 600,
                      "& fieldset": { borderColor: "rgba(224,229,242,0.8)" },
                    },
                  }}
                />
              </Stack>

              <TableContainer sx={{ borderRadius: "16px", border: "1px solid #eef2f6", overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#fafbfc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", px: 3, width: "80px" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Society Name</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>City Name</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Delivery Charge</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: "right", px: 3 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                          <Typography variant="h6" color="#a3aed0" fontWeight="800">No data found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row, index) => (
                        <TableRow key={row.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha("#1b2559", 0.02) } }}>
                          <TableCell sx={{ fontWeight: 800, color: "#1b2559", px: 3 }}>{index + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{row.society}</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#a3aed0" }}>{row.city}</TableCell>
                          <TableCell sx={{ fontWeight: 900, color: row.charge === null ? "#a3aed0" : "#1b2559" }}>
                            {row.charge === null ? "Not Set" : `Rs. ${row.charge}`}
                          </TableCell>
                          <TableCell sx={{ textAlign: "right", px: 3 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton className="action-edit" size="small" onClick={() => handleOpenEdit(row)} sx={{ color: "#1b2559", bgcolor: alpha("#1b2559", 0.06), borderRadius: "10px" }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton className="action-delete" size="small" onClick={() => handleDeleteArea(row)} sx={{ color: "#E53935", bgcolor: alpha("#E53935", 0.06), borderRadius: "10px" }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
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

      <Dialog
        open={Boolean(editingArea)}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
            border: "1px solid #e0e5f2",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: "#1b2559" }}>
            Edit Area
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="caption" sx={{ display: "block", mb: 1, color: "#a3aed0", fontWeight: 900, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                City
              </Typography>
              <TextField
                fullWidth
                value={editingArea?.city || ""}
                InputProps={{ readOnly: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ display: "block", mb: 1, color: "#a3aed0", fontWeight: 900, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Society
              </Typography>
              <TextField
                fullWidth
                value={editingArea?.society || ""}
                InputProps={{ readOnly: true }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ display: "block", mb: 1, color: "#a3aed0", fontWeight: 900, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Delivery Charge
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={editChargeValue}
                onChange={(event) => setEditChargeValue(event.target.value)}
                inputProps={{ min: 0 }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f8f9fc" } }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ width: "100%" }}>
            <Button
              onClick={handleCloseEdit}
              disabled={saving}
              sx={{
                borderRadius: "14px",
                bgcolor: "#f4f7fe",
                color: "#1b2559",
                fontWeight: 800,
                px: 2.5,
                py: 1.2,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleEditCharge}
              disabled={saving}
              sx={{
                borderRadius: "14px",
                bgcolor: "#E53935",
                color: "#fff",
                fontWeight: 900,
                px: 2.75,
                py: 1.2,
                textTransform: "none",
                boxShadow: "0 10px 25px rgba(229, 57, 53, 0.25)",
                "&:hover": { bgcolor: "#d32f2f" },
              }}
            >
              {saving ? "Saving..." : "Update Charge"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StoreDeliveryCharges;
