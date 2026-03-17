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
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import axios from "axios";

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      
      const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai"];
      const formattedData = response.data.map((user, index) => ({
        id: user.id,
        name: user.company.name,
        email: user.email,
        phone: user.phone.split(" ")[0],
        city: cities[index % cities.length],
        totalOrders: Math.floor(Math.random() * 500) + 50,
        status: index % 4 === 0 ? "Pending" : "Active",
        logo: `https://ui-avatars.com/api/?name=${user.company.name}&background=random&color=fff`,
      }));

      setStores(formattedData);
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    store.city.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Manage and monitor all registered vendors and stores.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Stores", value: stores.length, color: "#2d60ff", bg: "#e0e7ff" },
          { label: "Active Stores", value: stores.filter(s => s.status === "Active").length, color: "#24d164", bg: "#e6f9ed" },
          { label: "Pending Approval", value: stores.filter(s => s.status === "Pending").length, color: "#ffb800", bg: "#fff8e6" },
        ].map((stat) => (
          <Paper key={stat.label} sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: stat.bg }}>
                <StorefrontIcon sx={{ color: stat.color }} />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">{stat.label}</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{stat.value}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">Stores Directory</Typography>
          <TextField
            size="small"
            placeholder="Search by store name or city..."
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STORE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>LOCATION</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CONTACT</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ORDERS</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No Stores Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((store, index) => (
                  <TableRow key={store.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={store.logo} sx={{ borderRadius: "10px", width: 40, height: 40 }} />
                        <Typography variant="body2" fontWeight="700" color="#1b2559">{store.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocationOnIcon sx={{ fontSize: "16px", color: "#a3aed0" }} />
                        <Typography variant="body2" sx={{ color: "#475467" }}>{store.city}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600" color="#1b2559">{store.phone}</Typography>
                      <Typography variant="caption" color="textSecondary">{store.email}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "700" }}>{store.totalOrders.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={store.status}
                        size="small"
                        sx={{ 
                          backgroundColor: store.status === "Active" ? "#e6f9ed" : "#fff8e6", 
                          color: store.status === "Active" ? "#24d164" : "#ffb800", 
                          fontWeight: "700" 
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Tooltip title="View Store Details">
                        <IconButton 
                          sx={{ 
                              backgroundColor: "#f4f7fe", 
                              color: "#4318ff", 
                              borderRadius: "8px",
                              "&:hover": { backgroundColor: "#e0e7ff" }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default StoresList;