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
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const DayWiseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchOrders();
  }, [selectedDate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users?_limit=9"
      );
      
      const formattedData = response.data.map((user, index) => ({
        id: index + 1,
        cartId: `ORD-DAY-${8000 + user.id}`,
        cartPrice: `₹${Math.floor(Math.random() * 3000) + 400}`,
        userName: user.name,
        userPhone: user.phone.split(" ")[0],
        deliveryDate: selectedDate,
        status: index % 4 === 0 ? "Pending" : "Completed",
      }));

      setOrders(formattedData);
    } catch (error) {
      console.error("Error fetching day wise orders:", error);
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
                View and track orders for a specific date.
            </Typography>
        </Box>
        <Paper sx={{ p: 2, borderRadius: "12px", border: "1px solid #e0e5f2" }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <CalendarMonthIcon sx={{ color: "#2d60ff" }} />
                <TextField
                    type="date"
                    size="small"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                />
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ORDER ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PRICE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>USER</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>DATE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
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
                      <TableCell sx={{ color: "#475467" }}>{order.deliveryDate}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color={order.status === "Completed" ? "#24d164" : "#ffb800"}>
                          {order.status}
                        </Typography>
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