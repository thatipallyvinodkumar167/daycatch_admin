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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import axios from "axios";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '16px',
  boxShadow: 24,
  p: 4,
};

const Cities = () => {
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem("daycatch_cities");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    if (cities.length === 0) {
      fetchCities();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("daycatch_cities", JSON.stringify(cities));
  }, [cities]);

  const fetchCities = async () => {
    try {
      // Using users as a source for dummy names
      const response = await axios.get("https://jsonplaceholder.typicode.com/users");
      const cityList = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"];
      const formattedData = cityList.map((city, index) => ({
        id: index + 1,
        cityId: `CTY-${100 + index}`,
        name: city,
        status: "Active"
      }));
      setCities(formattedData);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleAdd = () => {
    if (newCity.trim()) {
      setCities([...cities, {
        id: cities.length + 1,
        cityId: `CTY-${100 + cities.length}`,
        name: newCity,
        status: "Active"
      }]);
      setNewCity("");
      setOpen(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      setCities(cities.filter(c => c.id !== id));
    }
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase()) ||
    city.cityId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
            onClick={() => setOpen(true)}
            sx={{
                backgroundColor: "#2d60ff",
                "&:hover": { backgroundColor: "#2046cc" },
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: "600",
                px: 3
            }}
        >
            Add City
        </Button>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #2d60ff", width: "fit-content", minWidth: 200 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#e0e7ff" }}>
                <LocationCityIcon sx={{ color: "#2d60ff" }} />
            </Box>
            <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">TOTAL CITIES</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{cities.length}</Typography>
            </Box>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">City Directory</Typography>
          <TextField
            size="small"
            placeholder="Search by city name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    No Cities Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCities.map((city, index) => (
                    <TableRow key={city.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#2d60ff", fontWeight: "700" }}>{city.cityId}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{city.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={city.status}
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
                                    onClick={() => handleDelete(city.id)}
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

      {/* Add City Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>Add New City</Typography>
          <TextField
            fullWidth
            label="City Name"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
            <Button 
                variant="contained" 
                onClick={handleAdd}
                sx={{ 
                    backgroundColor: "#2d60ff", 
                    borderRadius: "10px", 
                    textTransform: "none", 
                    px: 3 
                }}
            >
                Add City
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default Cities;