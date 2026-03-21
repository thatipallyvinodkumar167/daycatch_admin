import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { genericApi } from "../api/genericApi";

const Taxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    rate: "",
    status: "Active",
  });

  useEffect(() => {
    fetchTaxes();
  }, []);

  const fetchTaxes = async () => {
    try {
      const response = await genericApi.getAll("tax");
      const results = response.data.results || response.data || [];
      const formattedTaxes = results.map((tax, index) => ({
        id: tax._id,
        name: tax.name || tax["Tax Name"] || "Unnamed Tax",
        rate: tax.rate || tax["Tax Rate"] || 0,
        status: tax.status || "Active",
      }));
      setTaxes(formattedTaxes);
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  };

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
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        rate: Number(formData.rate),
        status: formData.status
      };

      if (editMode) {
        await genericApi.update("tax", selectedTax.id, payload);
        alert("Tax updated successfully!");
      } else {
        await genericApi.create("tax", payload);
        alert("Tax added successfully!");
      }
      fetchTaxes();
      handleClose();
    } catch (error) {
      console.error("Error saving tax:", error);
      alert("Error saving tax details.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tax type?")) {
      try {
        await genericApi.delete("tax", id);
        fetchTaxes();
        alert("Tax deleted successfully!");
      } catch (error) {
        console.error("Error deleting tax:", error);
        alert("Error deleting tax.");
      }
    }
  };

  const filteredTaxes = taxes.filter((tax) =>
    tax.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Hi, Day Catch Super Admin Panel.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Configuration of different tax tiers for products and services.
            </Typography>
        </Box>
        <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            sx={{ 
                backgroundColor: "#2d60ff", 
                "&:hover": { backgroundColor: "#2046cc" },
                borderRadius: "12px",
                textTransform: "none",
                px: 3,
                fontWeight: "700"
            }}
        >
            Add Tax Type
        </Button>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #2d60ff", width: "fit-content", minWidth: 220 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#e0e7ff" }}>
                <ReceiptLongIcon sx={{ color: "#2d60ff" }} />
            </Box>
            <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">TAX CATEGORIES</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{taxes.length}</Typography>
            </Box>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559">Tax Management</Typography>
          <TextField
            size="small"
            placeholder="Search by tax name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "280px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>TAX TYPE NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PERCENTAGE RATE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTaxes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    No tax types found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTaxes.map((tax, index) => (
                  <TableRow key={tax.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", fontSize: "16px" }}>{tax.name}</TableCell>
                    <TableCell>
                        <Chip 
                            label={`${tax.rate}%`}
                            sx={{ bgcolor: "#f4f7fe", color: "#4318ff", fontWeight: "800", fontSize: "14px" }}
                        />
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={tax.status}
                            size="small"
                            sx={{ 
                                bgcolor: tax.status === "Active" ? "#e6f9ed" : "#fff1f0", 
                                color: tax.status === "Active" ? "#24d164" : "#ff4d49", 
                                fontWeight: "700" 
                            }}
                        />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Tax">
                            <IconButton 
                                onClick={() => handleOpen(tax)}
                                sx={{ backgroundColor: "#24d164", color: "#ffffff", borderRadius: "10px", "&:hover": { backgroundColor: "#1eb856" } }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Tax">
                            <IconButton 
                                onClick={() => handleDelete(tax.id)}
                                sx={{ backgroundColor: "#ff4d49", color: "#ffffff", borderRadius: "10px", "&:hover": { backgroundColor: "#e04340" } }}
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

      {/* Add/Edit Tax Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
            sx: { borderRadius: "20px", p: 2, width: "100%", maxWidth: "450px" }
        }}
      >
        <DialogTitle sx={{ fontWeight: "700", color: "#1b2559" }}>
            {editMode ? "Edit Tax Type" : "Add New Tax Type"}
        </DialogTitle>
        <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
                <Box>
                    <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Tax Name</Typography>
                    <TextField
                        fullWidth
                        name="name"
                        placeholder="e.g. GST 18%"
                        value={formData.name}
                        onChange={handleInputChange}
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                </Box>
                <Box>
                    <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Tax Rate (%)</Typography>
                    <TextField
                        fullWidth
                        name="rate"
                        type="number"
                        placeholder="e.g. 18"
                        value={formData.rate}
                        onChange={handleInputChange}
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                </Box>
                <Box>
                    <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>Status</Typography>
                    <FormControl fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}>
                        <Select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button 
                onClick={handleClose}
                sx={{ borderRadius: "10px", textTransform: "none", fontWeight: "600", color: "#475467" }}
            >
                Cancel
            </Button>
            <Button 
                onClick={handleSave}
                variant="contained"
                sx={{ 
                    borderRadius: "10px", 
                    textTransform: "none", 
                    fontWeight: "600", 
                    backgroundColor: "#2d60ff",
                    "&:hover": { backgroundColor: "#2046cc" },
                    px: 4
                }}
            >
                {editMode ? "Update" : "Save"}
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Taxes;