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
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { genericApi } from "../api/genericApi";

const Id = () => {
  const [ids, setIds] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "Active",
  });

  useEffect(() => {
    fetchIds();
  }, []);

  const fetchIds = async () => {
    try {
      const response = await genericApi.getAll("id");
      const results = response.data.results || response.data || [];
      const formattedIds = results.map((item, index) => ({
        id: item._id,
        name: item.name || item["ID Name"] || "Unnamed ID",
        status: item.status || "Active",
      }));
      setIds(formattedIds);
    } catch (error) {
      console.error("Error fetching ID configurations:", error);
    }
  };

  const handleOpen = (idItem = null) => {
    if (idItem) {
      setEditMode(true);
      setSelectedId(idItem);
      setFormData({
        name: idItem.name,
        status: idItem.status,
      });
    } else {
      setEditMode(false);
      setFormData({
        name: "",
        status: "Active",
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("Please enter ID Name.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        status: formData.status
      };

      if (editMode) {
        await genericApi.update("id", selectedId.id, payload);
        alert("ID updated successfully!");
      } else {
        await genericApi.create("id", payload);
        alert("ID added successfully!");
      }
      fetchIds();
      handleClose();
    } catch (error) {
      console.error("Error saving ID:", error);
      alert("Error saving ID configuration.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ID configuration?")) {
      try {
        await genericApi.delete("id", id);
        fetchIds();
        alert("ID deleted successfully!");
      } catch (error) {
        console.error("Error deleting ID:", error);
        alert("Error deleting ID configuration.");
      }
    }
  };

  const filteredIds = ids.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Hi, Day Catch Super Admin Panel.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Configure ID types and identity document requirements.
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
                fontWeight: "700",
                boxShadow: "0 4px 12px rgba(45, 96, 255, 0.3)"
            }}
        >
            Add
        </Button>
      </Box>

      {/* Summary Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #2d60ff", width: "fit-content", minWidth: 220 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#e0e7ff" }}>
                <FingerprintIcon sx={{ color: "#2d60ff" }} />
            </Box>
            <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">ID CATEGORIES</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{ids.length}</Typography>
            </Box>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559">ID Management</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
                size="small"
                placeholder="Search by id name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "240px" }}
            />
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ID NAME</TableCell>
                <TableCell align="center" sx={{ fontWeight: "700", color: "#a3aed0" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    No ID configurations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredIds.map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{item.id}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", fontSize: "16px" }}>{item.name}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit Config">
                            <IconButton 
                                onClick={() => handleOpen(item)}
                                sx={{ backgroundColor: "#24d164", color: "#ffffff", borderRadius: "10px", "&:hover": { backgroundColor: "#1eb856" } }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Config">
                            <IconButton 
                                onClick={() => handleDelete(item.id)}
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

      {/* Add/Edit ID Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
            sx: { borderRadius: "20px", p: 2, width: "100%", maxWidth: "450px" }
        }}
      >
        <DialogTitle sx={{ fontWeight: "700", color: "#1b2559" }}>
            {editMode ? "Edit ID Configuration" : "Add New ID Configuration"}
        </DialogTitle>
        <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
                <Box>
                    <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mb: 1 }}>ID Name</Typography>
                    <TextField
                        fullWidth
                        name="name"
                        placeholder="e.g. Aadhar Card"
                        value={formData.name}
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

export default Id;