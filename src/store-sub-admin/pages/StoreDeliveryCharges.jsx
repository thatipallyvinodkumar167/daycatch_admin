import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  useTheme,
  alpha,
  Paper,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText
} from "@mui/material";
import {
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

function StoreDeliveryCharges() {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAreas, setSelectedAreas] = useState([]);
  
  // Mock data for Areas
  const [areas] = useState([
    { id: 1, name: "Lingampally" },
    { id: 2, name: "Miyapur" },
    { id: 3, name: "Kukatpally" },
    { id: 4, name: "Kondapur" },
    { id: 5, name: "Gachibowli" },
  ]);

  // Mock data for Table
  const [tableData] = useState([
    { id: 1, society: "Lingampally", city: "Hyderabad", charge: 40 },
  ]);

  const handleAreaChange = (event) => {
    const { value } = event.target;
    setSelectedAreas(typeof value === 'string' ? value.split(',') : value);
  };

  const filteredData = tableData.filter(item => 
    item.society.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1px" }}>
              Delivery Charges
            </Typography>
            <Typography variant="body2" fontWeight="700" color="#a3aed0">
              Manage serviceable zones for {store.name}
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: "28px", boxShadow: "0 18px 40px rgba(15,23,42,0.04)", border: "1px solid #e0e5f2" }}>
          
          <Stack spacing={4}>
            {/* Area Filter & Action */}
            <Stack direction="row" spacing={3} alignItems="flex-end" flexWrap="wrap" useFlexGap>
              <Box sx={{ minWidth: "300px", flex: 1 }}>
                <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ display: "block", mb: 1, textTransform: "uppercase" }}>
                  Select Your Serviceable area
                </Typography>
                <FormControl fullWidth variant="outlined">
                  <Select
                    multiple
                    displayEmpty
                    value={selectedAreas}
                    onChange={handleAreaChange}
                    renderValue={(selected) => {
                      if (selected.length === 0) return <em>All selected</em>;
                      return selected.join(', ');
                    }}
                    sx={{ 
                      borderRadius: "16px", 
                      bgcolor: "#f8f9fc",
                      "& fieldset": { borderColor: "rgba(224,229,242,0.8)" }
                    }}
                  >
                    {areas.map((area) => (
                      <MenuItem key={area.id} value={area.name}>
                        <Checkbox checked={selectedAreas.indexOf(area.name) > -1} sx={{ color: "#4318ff", '&.Mui-checked': { color: "#4318ff" } }} />
                        <ListItemText primary={area.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Button
                variant="contained"
                sx={{
                  borderRadius: "18px",
                  py: 1.8,
                  px: 4,
                  bgcolor: "#4318ff",
                  boxShadow: "0 10px 25px rgba(67,24,255,0.25)",
                  textTransform: "none",
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#3310cc" }
                }}
              >
                Update Delivery Charges
              </Button>
            </Stack>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }} flexWrap="wrap" useFlexGap>
                <Typography variant="h4" fontWeight="800" color="#1b2559">
                  Society Wise Charges
                </Typography>
                <TextField
                  placeholder="Search society..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    }
                  }}
                />
              </Stack>

              <TableContainer sx={{ borderRadius: "16px", border: "1px solid #e0e5f2", overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#f8f9fc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2", width: "80px" }}>#</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>Society Name</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>City Name</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2" }}>Delivery Charge</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#a3aed0", borderBottom: "1px solid #e0e5f2", textAlign: "right" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <Typography variant="h6" color="#a3aed0" fontWeight="800">No data found</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row, index) => (
                        <TableRow key={row.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha("#4318ff", 0.03) } }}>
                          <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{row.society}</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#707eae" }}>{row.city}</TableCell>
                          <TableCell sx={{ fontWeight: 900, color: "#4318ff" }}>₹{row.charge}</TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            <Button size="small" variant="text" sx={{ color: "#4318ff", fontWeight: 900, textTransform: "none" }}>Edit</Button>
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
    </Box>
  );
}

export default StoreDeliveryCharges;
