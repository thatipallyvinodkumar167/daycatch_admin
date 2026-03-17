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
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MapIcon from "@mui/icons-material/Map";
import axios from "axios";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  borderRadius: '20px',
  boxShadow: 24,
  p: 4,
};

const citiesList = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai"];

const AreaSociety = () => {
  const [areas, setAreas] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [newArea, setNewArea] = useState({ name: "", city: "" });

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users?_limit=8");
        const formattedData = response.data.map((user, index) => ({
          id: index + 1,
          name: `Society ${String.fromCharCode(65 + index)}`,
          city: citiesList[index % citiesList.length],
          status: "Active"
        }));
        setAreas(formattedData);
      } catch (error) {
        console.error("Error fetching areas:", error);
      }
    };

    fetchAreas();
  }, []);

  const handleAdd = () => {
    if (newArea.name && newArea.city) {
      setAreas([...areas, {
        id: areas.length + 1,
        ...newArea,
        status: "Active"
      }]);
      setNewArea({ name: "", city: "" });
      setOpen(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this society?")) {
      setAreas(areas.filter(a => a.id !== id));
    }
  };

  const filteredAreas = areas.filter((area) =>
    area.name.toLowerCase().includes(search.toLowerCase()) ||
    area.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            onClick={() => setOpen(true)}
            sx={{
                backgroundColor: "#2d60ff",
                "&:hover": { backgroundColor: "#2046cc" },
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: "700",
                px: 4,
                py: 1.2
            }}
        >
            Add Society
        </Button>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #4318ff", width: "fit-content", minWidth: 250 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#e0e7ff" }}>
                <MapIcon sx={{ color: "#4318ff" }} />
            </Box>
            <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">MAPPED SOCIETIES</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{areas.length}</Typography>
            </Box>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">Societies List</Typography>
          <TextField
            size="small"
            placeholder="Search by society or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, width: "350px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CITY</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>SOCIETY/AREA NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAreas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    No Societies Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAreas.map((area, index) => (
                    <TableRow key={area.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell>
                        <Chip 
                            label={area.city} 
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
                            backgroundColor: "#e6f9ed", 
                            color: "#24d164", 
                            fontWeight: "700" 
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                                <IconButton size="small" sx={{ 
                                    backgroundColor: "#00d26a", 
                                    color: "#fff", 
                                    borderRadius: "10px",
                                    "&:hover": { backgroundColor: "#00b85c" }
                                }}>
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton 
                                    size="small" 
                                    onClick={() => handleDelete(area.id)}
                                    sx={{ 
                                        backgroundColor: "#ff4d49", 
                                        color: "#fff", 
                                        borderRadius: "10px",
                                        "&:hover": { backgroundColor: "#e03e3e" }
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

      {/* Add Society Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }} color="#1b2559">Add New Society/Area</Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select City</InputLabel>
            <Select
                value={newArea.city}
                label="Select City"
                onChange={(e) => setNewArea({ ...newArea, city: e.target.value })}
                sx={{ borderRadius: "12px" }}
            >
                {citiesList.map(city => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Society Name"
            value={newArea.name}
            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
            sx={{ mb: 4, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setOpen(false)} sx={{ textTransform: "none", color: "#475467" }}>Cancel</Button>
            <Button 
                variant="contained" 
                onClick={handleAdd}
                sx={{ 
                    backgroundColor: "#2d60ff", 
                    borderRadius: "12px", 
                    textTransform: "none", 
                    px: 4,
                    py: 1,
                    fontWeight: "700"
                }}
            >
                Add Society
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default AreaSociety;