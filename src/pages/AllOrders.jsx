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
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import StoreIcon from "@mui/icons-material/Store";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users?_limit=10"
      );
      
      const statuses = ["Pending", "Completed", "Cancelled", "Ongoing", "Out for Delivery"];
      const formattedData = response.data.map((user, index) => ({
        id: index + 1,
        cartId: `ORD-${1000 + user.id}`,
        cartPrice: `₹${Math.floor(Math.random() * 5000) + 500}`,
        userName: user.name,
        userPhone: user.phone.split(" ")[0],
        deliveryDate: `2024-03-${20 + (index % 10)}`,
        status: statuses[index % statuses.length],
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return { bg: "#fff8e6", color: "#ffb800" };
      case "Completed": return { bg: "#e6f9ed", color: "#24d164" };
      case "Cancelled": return { bg: "#fff1f0", color: "#ff4d49" };
      case "Ongoing": return { bg: "#e0e7ff", color: "#4318ff" };
      case "Out for Delivery": return { bg: "#e6f9ed", color: "#24d164" };
      default: return { bg: "#f4f7fe", color: "#2b3674" };
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.cartId.toLowerCase().includes(search.toLowerCase()) ||
    order.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">
            Hi, Day Catch Super Admin Panel.
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            View and manage all customer orders in one place.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Button 
                variant="outlined" 
                startIcon={<PrintIcon />}
                sx={{ borderRadius: "10px", textTransform: "none", color: "#2b3674", borderColor: "#e0e5f2" }}
            >
                Print
            </Button>
            <Button 
                variant="outlined" 
                startIcon={<FileDownloadIcon />}
                sx={{ borderRadius: "10px", textTransform: "none", color: "#2b3674", borderColor: "#e0e5f2" }}
            >
                Export CSV
            </Button>
        </Stack>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #ff4d49" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#fff1f0" }}>
                <StoreIcon sx={{ color: "#ff4d49" }} />
            </Box>
            <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">All Orders BY STORE</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{orders.length}</Typography>
            </Box>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">All Orders List</Typography>
          <TextField
            size="small"
            placeholder="Search by Order ID or User..."
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Cart ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Cart price</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Delivery Date</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No Orders Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <TableRow key={order.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#2d60ff", fontWeight: "700" }}>{order.cartId}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{order.cartPrice}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#1b2559">{order.userName}</Typography>
                        <Typography variant="caption" color="textSecondary">{order.userPhone}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#475467" }}>{order.deliveryDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{ 
                            backgroundColor: statusStyle.bg, 
                            color: statusStyle.color, 
                            fontWeight: "700" 
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Tooltip title="View Order Details">
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AllOrders;