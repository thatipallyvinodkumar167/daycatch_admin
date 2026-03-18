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
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StorefrontIcon from "@mui/icons-material/Storefront";
import axios from "axios";

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const handleOpenDetails = (store) => {
    setSelectedStore(store);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStore(null);
  };

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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PROFILE PIC</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STORE NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CITY</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>MOBILE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>EMAIL</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ORDERS</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>DETAILS</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTION</TableCell>
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
                      <Avatar src={store.logo} sx={{ borderRadius: "10px", width: 40, height: 40, border: "2px solid #f4f7fe" }} />
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{store.name}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{store.city}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{store.phone}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{store.email}</TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "700" }}>{store.totalOrders.toLocaleString()}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => handleOpenDetails(store)}
                        sx={{ 
                          backgroundColor: "#4318ff", 
                          color: "#fff", 
                          fontSize: "12px", 
                          borderRadius: "6px",
                          px: 2,
                          py: 0.5,
                          "&:hover": { backgroundColor: "#3a15dc" }
                        }}
                      >
                        Details
                      </IconButton>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Chip
                        label={store.status}
                        size="small"
                        sx={{ 
                          backgroundColor: store.status === "Active" ? "#e6f9ed" : "#fff8e6", 
                          color: store.status === "Active" ? "#24d164" : "#ffb800", 
                          fontWeight: "700",
                          borderRadius: "10px"
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Store Details Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: "16px" } }}>
        <DialogTitle sx={{ m: 0, p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", color: "#1b2559" }}>
          Store Details
          <IconButton onClick={handleClose} size="small" sx={{ color: "#a3aed0" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 3 }}>
          {selectedStore && (
            <Box>
              <Stack direction="row" spacing={3} sx={{ mb: 4, alignItems: "center" }}>
                <Avatar src={selectedStore.logo} sx={{ width: 100, height: 100, borderRadius: "20px", border: "4px solid #f4f7fe" }} />
                <Box>
                  <Typography variant="h5" fontWeight="800" color="#1b2559">{selectedStore.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{selectedStore.city} • {selectedStore.status}</Typography>
                  <Chip 
                    label={selectedStore.status} 
                    size="small" 
                    sx={{ mt: 1, backgroundColor: selectedStore.status === "Active" ? "#e6f9ed" : "#fff8e6", color: selectedStore.status === "Active" ? "#24d164" : "#ffb800", fontWeight: "700" }} 
                  />
                </Box>
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" fontWeight="600">EMAIL ADDRESS</Typography>
                  <Typography variant="body1" fontWeight="700" color="#1b2559">{selectedStore.email}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" fontWeight="600">PHONE NUMBER</Typography>
                  <Typography variant="body1" fontWeight="700" color="#1b2559">{selectedStore.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" fontWeight="600">CITY</Typography>
                  <Typography variant="body1" fontWeight="700" color="#1b2559">{selectedStore.city}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary" fontWeight="600">TOTAL ORDERS</Typography>
                  <Typography variant="body1" fontWeight="700" color="#1b2559">{selectedStore.totalOrders}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #f1f1f1", display: "flex", justifyContent: "flex-end" }}>
                <IconButton onClick={handleClose} sx={{ backgroundColor: "#ff4d49", color: "#fff", borderRadius: "8px", px: 3, py: 1, fontSize: "14px", fontWeight: "700", "&:hover": { backgroundColor: "#e64440" } }}>
                  Close
                </IconButton>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StoresList;