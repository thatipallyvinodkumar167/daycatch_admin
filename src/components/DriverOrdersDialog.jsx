import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { getAllOrders } from "../api/ordersApi";

const DriverOrdersDialog = ({ open, onClose, driverName }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDriverOrders = useCallback(async () => {
    if (!driverName) return;
    setLoading(true);
    try {
      const response = await getAllOrders({ limit: 1000 });
      const allOrders = response.data?.results || response.data?.data || response.data || [];
      
      const filtered = allOrders.filter(order => {
        const boyName = (order["Boy Name"] || order.Assign || order.deliveryBoy?.name || "").toString().toLowerCase();
        return boyName === driverName.toLowerCase();
      }).map((order, index) => ({
        id: order._id || index + 1,
        cartId: order["Cart ID"] || order.cartId || order._id,
        price: parseFloat(order["Cart price"] || order.cartPrice || 0),
        customer: order["User"] || order.user || "N/A",
        date: order["Delivery Date"] ? new Date(order["Delivery Date"]).toLocaleDateString() : "N/A",
        status: order["Status"] || order.status || "N/A"
      }));

      setOrders(filtered);
    } catch (error) {
      console.error("Error fetching driver orders:", error);
    } finally {
      setLoading(false);
    }
  }, [driverName]);

  useEffect(() => {
    if (open) fetchDriverOrders();
  }, [open, fetchDriverOrders]);

  const getStatusChip = (status) => {
    const s = (status || "").toLowerCase();
    let color = "#1b2559";
    let bg = "#f4f7fe";
    
    if (s.includes("complete") || s.includes("deliver")) { color = "#24d164"; bg = "#e6f9ed"; }
    else if (s.includes("cancel") || s.includes("fail")) { color = "#ff4d49"; bg = "#fff1f0"; }
    else if (s.includes("ongoing") || s.includes("ship")) { color = "#4318ff"; bg = "#eef2ff"; }
    
    return (
      <Chip 
        label={status.toUpperCase()} 
        size="small" 
        sx={{ bgcolor: bg, color: color, fontWeight: "900", fontSize: "10px", borderRadius: "8px" }} 
      />
    );
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: "24px" } }}
    >
      <DialogTitle sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1, bgcolor: "#eef2ff", borderRadius: "12px", color: "#4318ff", display: "flex" }}>
            <ShoppingBagIcon />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="900" color="#1b2559">Assignments: {driverName}</Typography>
            <Typography variant="caption" color="#a3aed0" fontWeight="700">Audit of all jobs assigned to this fleet member.</Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ bgcolor: "#fff1f0", color: "#ff4d49", borderRadius: "12px" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ py: 10, textAlign: "center" }}>
            <CircularProgress sx={{ color: "#4318ff" }} />
            <Typography sx={{ mt: 2, color: "#a3aed0", fontWeight: "600" }}>Fetching job records...</Typography>
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ py: 10, textAlign: "center" }}>
             <Typography variant="body1" color="#a3aed0" fontWeight="700">No active or past jobs found for this driver.</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: "16px", border: "1px solid #e0e5f2", boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f4f7fe" }}>
                  <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>ORDER ID</TableCell>
                  <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>CUSTOMER</TableCell>
                  <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>DATE</TableCell>
                  <TableCell sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>STATUS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px" }}>AMOUNT</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "800", color: "#a3aed0", fontSize: "11px", pr: 3 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} sx={{ "&:hover": { bgcolor: "#f9fbff" } }}>
                    <TableCell sx={{ fontWeight: "800", color: "#4318ff" }}>{order.cartId}</TableCell>
                    <TableCell sx={{ fontWeight: "700", color: "#1b2559" }}>{order.customer}</TableCell>
                    <TableCell sx={{ fontWeight: "600", color: "#475467" }}>{order.date}</TableCell>
                    <TableCell>{getStatusChip(order.status)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "900", color: "#1b2559" }}>₹{order.price.toLocaleString()}</TableCell>
                    <TableCell align="center" sx={{ pr: 3 }}>
                       <Button 
                        size="small" 
                        variant="text" 
                        onClick={() => {
                          onClose(); 
                          navigate(`/all-orders/details/${order.id}?collection=orders`);
                        }}
                        sx={{ fontWeight: "800", textTransform: "none", color: "#4318ff" }}
                       >
                         Track Order Record
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DriverOrdersDialog;
