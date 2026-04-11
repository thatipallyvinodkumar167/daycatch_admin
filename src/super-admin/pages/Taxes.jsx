import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Divider,
  LinearProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { genericApi } from "../../api/genericApi";

const Taxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    status: "Active",
  });

  const fetchTaxes = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("tax");
      const results = response.data.results || response.data || [];
      const formattedTaxes = results.map((tax, index) => ({
        id: tax._id,
        name: tax.name || tax["Tax Type name"] || tax["Tax Name"] || "Unnamed Tax",
        rate: tax.rate || tax["Tax percentage"] || tax["Tax Rate"] || 0,
        status: tax.status === 1 ? "Active" : tax.status === 0 ? "Inactive" : typeof tax.status === 'string' ? tax.status : "Active",
      }));
      setTaxes(formattedTaxes);
    } catch (error) {
      console.error("Error fetching taxes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  const handleOpen = (tax = null) => {
    if (tax) {
      setEditMode(true);
      setSelectedTax(tax);
      setFormData({
        name: tax.name,
        rate: tax.rate,
        status: tax.status,
      });
    } else {
      setEditMode(false);
      setFormData({
        name: "",
        rate: "",
        status: "Active",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTax(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.name || formData.rate === "") {
      return;
    }

    try {
      const payload = {
        "Tax Type name": formData.name,
        "Tax percentage": Number(formData.rate),
        status: formData.status
      };

      if (editMode) {
        await genericApi.update("tax", selectedTax.id, payload);
      } else {
        await genericApi.create("tax", payload);
      }
      fetchTaxes();
      handleClose();
    } catch (error) {
      console.error("Error saving tax:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tax?")) {
      try {
        await genericApi.remove("tax", id);
        fetchTaxes();
      } catch (error) {
        console.error("Error deleting tax:", error);
      }
    }
  };

  const filteredTaxes = useMemo(() => {
      const q = search.toLowerCase().trim();
      if (!q) return taxes;
      return taxes.filter((tax) =>
        tax.name.toLowerCase().includes(q)
      );
  }, [taxes, search]);

  const stats = useMemo(() => [
    { label: "Total Taxes", value: taxes.length, icon: <AccountBalanceIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Status", value: "Verified", icon: <CurrencyRupeeIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [taxes]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Tax Management
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage tax rates for products and services.
            </Typography>
        </Box>
        <Stack direction="row" spacing={3} alignItems="center">
            {stats.map((stat) => (
                <Stack key={stat.label} direction="row" spacing={1} alignItems="center">
                    <Box sx={{ color: stat.color, display: "flex" }}>{stat.icon}</Box>
                    <Box>
                        <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase", display: "block", lineHeight: 1 }}>{stat.label}</Typography>
                        <Typography variant="subtitle2" fontWeight="800" color="#1b2559">{stat.value}</Typography>
                    </Box>
                </Stack>
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpen()}
                sx={{ 
                    backgroundColor: "#4318ff", 
                    borderRadius: "14px",
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    fontWeight: "800",
                    boxShadow: "0 10px 25px rgba(67, 24, 255, 0.2)",
                    "&:hover": { backgroundColor: "#3310cc" }
                }}
            >
                Add Tax
            </Button>
        </Stack>
      </Box>

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {(loading || refreshing) && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, bgcolor: "#f4f7fe", "& .MuiLinearProgress-bar": { bgcolor: "#4318ff" } }} />
          )}
          
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Tax List</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                      size="small"
                      placeholder="Search Taxes..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      InputProps={{
                          startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#fff", width: "320px" } }}
                  />
                  <Tooltip title="Refresh">
                      <IconButton onClick={() => fetchTaxes(true)} disabled={refreshing} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
                          <RefreshIcon sx={{ color: "#4318ff", fontSize: 20 }} className={refreshing ? "spin-animation" : ""} />
                      </IconButton>
                  </Tooltip>
              </Stack>
          </Box>

          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
              <Table stickyHeader>
                  <TableHead>
                      <TableRow>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pl: 4, bgcolor: "#f4f7fe" }}>#</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Tax Name</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Percentage (%)</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredTaxes.length === 0 && !loading ? (
                          <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10, color: "#a3aed0", fontWeight: "800" }}>No taxes found.</TableCell></TableRow>
                      ) : (
                          filteredTaxes.map((tax, index) => (
                              <TableRow key={tax.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                          <Box sx={{ p: 1, borderRadius: "10px", bgcolor: "rgba(67, 24, 255, 0.05)" }}>
                                              <ReceiptLongIcon sx={{ color: "#4318ff", fontSize: 18 }} />
                                          </Box>
                                          <Typography variant="body2" fontWeight="800" color="#1b2559">{tax.name}</Typography>
                                      </Stack>
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={`${tax.rate}%`}
                                          sx={{ fontWeight: "900", bgcolor: "rgba(67, 24, 255, 0.05)", color: "#4318ff", borderRadius: "8px", fontSize: "13px", border: "1px solid rgba(67, 24, 255, 0.1)" }}
                                      />
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={tax.status.toUpperCase()} 
                                          size="small" 
                                          sx={{ 
                                              fontWeight: "900", 
                                              bgcolor: tax.status === "Active" ? "rgba(0, 210, 106, 0.1)" : "rgba(163, 174, 208, 0.1)", 
                                              color: tax.status === "Active" ? "#00d26a" : "#a3aed0", 
                                              borderRadius: "8px",
                                              fontSize: "10px",
                                              border: `1px solid ${tax.status === "Active" ? "rgba(0, 210, 106, 0.2)" : "rgba(163, 174, 208, 0.2)"}`
                                          }} 
                                      />
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                      <Tooltip title="Edit Tax">
                                          <IconButton className="action-edit" 
                                              onClick={() => handleOpen(tax)}
                                              sx={{ backgroundColor: "#00d26a", color: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 210, 106, 0.2)", "&:hover": { backgroundColor: "#00b85c" } }}
                                          >
                                              <EditIcon sx={{ fontSize: 18 }} />
                                          </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Delete Tax">
                                          <IconButton className="action-delete" 
                                              onClick={() => handleDelete(tax.id)}
                                              sx={{ backgroundColor: "#ff4d49", color: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(255, 77, 73, 0.2)", "&:hover": { backgroundColor: "#d32f2f" } }}
                                          >
                                              <DeleteIcon sx={{ fontSize: 18 }} />
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

      {/* Add/Edit Tax Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
            sx: { borderRadius: "24px", p: 1, width: "100%", maxWidth: "450px", border: "1px solid #e0e5f2", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }
        }}
      >
        <DialogTitle sx={{ fontWeight: "800", color: "#1b2559", pt: 3, pb: 1, letterSpacing: "-1px" }}>
            {editMode ? "Edit Tax" : "Add Tax"}
        </DialogTitle>
        <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
                <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Tax Name</Typography>
                    <TextField
                        fullWidth
                        name="name"
                        placeholder="e.g. GST Standard 18%"
                        value={formData.name}
                        onChange={handleInputChange}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                </Box>
                <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Rate (%)</Typography>
                    <TextField
                        fullWidth
                        name="rate"
                        type="number"
                        placeholder="e.g. 18"
                        value={formData.rate}
                        onChange={handleInputChange}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: "#fafbfc" } }}
                    />
                </Box>
                <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Status</Typography>
                    <FormControl fullWidth>
                        <Select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            sx={{ borderRadius: "16px", bgcolor: "#fafbfc", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e5f2" } }}
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 4 }}>
            <Button 
                onClick={handleClose}
                sx={{ borderRadius: "14px", textTransform: "none", fontWeight: "800", color: "#a3aed0" }}
            >
                Cancel
            </Button>
            <Button 
                onClick={handleSave}
                variant="contained"
                sx={{ 
                    borderRadius: "14px", 
                    textTransform: "none", 
                    fontWeight: "800", 
                    backgroundColor: "#4318ff",
                    "&:hover": { backgroundColor: "#3310cc" },
                    px: 4,
                    py: 1.5,
                    boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                }}
            >
                {editMode ? "Save Changes" : "Add Tax"}
            </Button>
        </DialogActions>
      </Dialog>

      <style>
          {`
          @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
          .spin-animation {
              animation: spin 1s linear infinite;
          }
          `}
      </style>
    </Box>
  );
};

export default Taxes;


