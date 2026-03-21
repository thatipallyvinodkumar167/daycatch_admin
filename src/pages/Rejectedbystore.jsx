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
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StoreIcon from "@mui/icons-material/Store";
import { genericApi } from "../api/genericApi";

const Rejectedbystore = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await genericApi.getAll("rejectedbystore");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || `ORD-REJ-${index}`,
        cartPrice: typeof order["Cart price"] === "number" ? `₹${order["Cart price"]}` : (order["Cart price"] || `₹0`),
        userName: order["User"] || order.user || "Unknown",
        userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
        deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toISOString().split("T")[0] : "N/A",
        status: order["Status"] || "Rejected by Store",
        store: order["Store Name"] || order.store || "N/A",
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Error fetching rejected orders:", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.cartId.toLowerCase().includes(search.toLowerCase()) ||
    order.userName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Orders that were declined by specific vendors or stores.
        </Typography>
      </Box>

      {/* Stats Summary */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", borderLeft: "6px solid #ff4d49" }}>
        <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#fff1f0" }}>
                <StoreIcon sx={{ color: "#ff4d49" }} />
            </Box>
            <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">REJECTED BY STORE</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{orders.length}</Typography>
            </Box>
        </Stack>
      </Paper>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">Store Rejection Log</Typography>
          <TextField
            size="small"
            placeholder="Search Order ID or User..."
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
                    No Rejected Orders Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                    <TableRow key={order.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#ff4d49", fontWeight: "700" }}>{order.cartId}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{order.cartPrice}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#1b2559">{order.userName}</Typography>
                        <Typography variant="caption" color="textSecondary">{order.userPhone}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "600" }}>{order.deliveryDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={order.status}
                          size="small"
                          sx={{ 
                            backgroundColor: "#fff1f0", 
                            color: "#ff4d49", 
                            fontWeight: "700" 
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                          <Tooltip title="View Details">
                            <IconButton 
                              sx={{ 
                                  backgroundColor: "#2d60ff", 
                                  color: "#fff", 
                                  borderRadius: "8px",
                                  "&:hover": { backgroundColor: "#2046cc" }
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
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
    </Box>
  );
};

export default Rejectedbystore;