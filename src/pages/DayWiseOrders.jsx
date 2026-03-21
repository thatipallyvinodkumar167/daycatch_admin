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
  Stack,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { genericApi } from "../api/genericApi";

const DayWiseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("All");
  const [fromDate, setFromDate] = useState(new Date().toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await genericApi.getAll("day wise orders");
        const results = response.data.results || response.data || [];
        
        const formattedData = results.map((order, index) => {
          const rawPrice = order["Cart price"] || order.cartPrice;
          const displayPrice = typeof rawPrice === "object" ? (rawPrice.value || rawPrice.amount || 0) : (rawPrice || 0);

          const rawPayment = order["Payment Type"] || order.payment;
          const displayPayment = typeof rawPayment === "object" ? (rawPayment.mode || rawPayment.type || JSON.stringify(rawPayment)) : (rawPayment || "COD");

          return {
            id: order._id || index + 1,
            cartId: order["Cart ID"] || `ORD-DAY-${index}`,
            cartPrice: `₹${displayPrice}`,
            userName: order["User"] || order.user || "Unknown",
            userPhone: order["User Phone"] || order.phone || order.Details?.phone || "N/A",
            deliveryDate: order["Delivery Date"] ? new Date(order["Delivery Date"]).toISOString().split("T")[0] : "N/A",
            deliveryBoy: order["Boy Name"] || order.deliveryBoy || "N/A",
            cartProducts: Array.isArray(order["Products"]) ? `${order["Products"].length} items` : "N/A",
            payment: displayPayment,
            status: order["Status"] || "Pending",
            store: order["Store Name"] || order.store || "N/A",
          };
        });

        setOrders(formattedData);
      } catch (error) {
        console.error("Error fetching day wise orders:", error);
      }
    };
    fetchOrders();
  }, [fromDate, toDate, paymentMethod]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.cartId.toLowerCase().includes(search.toLowerCase()) ||
                         order.userName.toLowerCase().includes(search.toLowerCase());
    const matchesPayment = paymentMethod === "All" || order.payment === paymentMethod;
    return matchesSearch && matchesPayment;
  });

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 3 }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Hi, Day Catch Super Admin Panel.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                View and track orders for specific date ranges and payment methods.
            </Typography>
        </Box>
        
        <Paper sx={{ p: 2, borderRadius: "16px", border: "1px solid #e0e5f2", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
            <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                <Box>
                    <Typography variant="caption" fontWeight="700" color="#a3aed0" sx={{ mb: 0.5, display: "block", ml: 1 }}>PAYMENT METHOD</Typography>
                    <TextField
                        select
                        size="small"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        sx={{ minWidth: "180px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    >
                        <MenuItem value="All">Select payment method</MenuItem>
                        <MenuItem value="COD">COD</MenuItem>
                        <MenuItem value="Online">Online</MenuItem>
                    </TextField>
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight="700" color="#a3aed0" sx={{ mb: 0.5, display: "block", ml: 1 }}>FROM DATE</Typography>
                    <TextField
                        type="date"
                        size="small"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                </Box>

                <Box>
                    <Typography variant="caption" fontWeight="700" color="#a3aed0" sx={{ mb: 0.5, display: "block", ml: 1 }}>TO DATE</Typography>
                    <TextField
                        type="date"
                        size="small"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                </Box>
            </Stack>
        </Paper>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">Daily Order Log</Typography>
          <TextField
            size="small"
            placeholder="Search Order ID or User..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#a3aed0" }} />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "320px" }}
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Delivery Boy</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Cart Products</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Order Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Store</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No Orders found for this date
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order, index) => (
                    <TableRow key={order.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#2d60ff", fontWeight: "700" }}>{order.cartId}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{order.cartPrice}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#1b2559">{order.userName}</Typography>
                        <Typography variant="caption" color="textSecondary">{order.userPhone}</Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "600" }}>{order.deliveryDate}</TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "600" }}>{order.deliveryBoy}</TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "600" }}>{order.cartProducts}</TableCell>
                      <TableCell sx={{ color: "#475467", fontWeight: "600" }}>{order.payment}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color={order.status === "Completed" ? "#24d164" : "#ffb800"}>
                          {order.status}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 4, fontWeight: "700", color: "#1b2559" }}>
                        {order.store}
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

export default DayWiseOrders;