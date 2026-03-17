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
  Stack,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        city: item.address.city,
        totalOrders: Math.floor(Math.random() * 30) + 1,
        walletBalance: `₹${Math.floor(Math.random() * 500)}`,
        status: index % 5 === 0 ? "Blocked" : "Active",
        avatar: `https://ui-avatars.com/api/?name=${item.name}&background=random`,
      }));
      setCustomers(formattedData);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleToggleStatus = (id) => {
    setCustomers(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Blocked" : "Active" }
          : item
      )
    );
  };

  const filtered = customers.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    item.email.toLowerCase().includes(search.toLowerCase().trim()) ||
    item.phone.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Manage your registered customers.
        </Typography>
      </Box>

      {/* Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Customers", value: customers.length, color: "#2d60ff" },
          { label: "Active", value: customers.filter(c => c.status === "Active").length, color: "#24d164" },
          { label: "Blocked", value: customers.filter(c => c.status === "Blocked").length, color: "#ff4d49" },
        ].map((s) => (
          <Paper key={s.label} sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Typography variant="caption" color="textSecondary" fontWeight="600">{s.label}</Typography>
            <Typography variant="h4" fontWeight="800" color={s.color}>{s.value}</Typography>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">Customers List</Typography>
          <TextField
            size="small"
            placeholder="Search by name, email, phone..."
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>City</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Orders</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Wallet</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>No customers found</TableCell>
                </TableRow>
              ) : (
                filtered.map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={item.avatar} sx={{ width: 36, height: 36 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="700" color="#1b2559">{item.name}</Typography>
                          <Typography variant="caption" color="textSecondary">{item.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.phone}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.city}</TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "700" }}>{item.totalOrders}</TableCell>
                    <TableCell sx={{ color: "#24d164", fontWeight: "700" }}>{item.walletBalance}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          backgroundColor: item.status === "Active" ? "#e6f9ed" : "#fff1f0",
                          color: item.status === "Active" ? "#24d164" : "#ff4d49",
                          fontWeight: "700"
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Profile">
                          <IconButton sx={{ backgroundColor: "#e0e7ff", color: "#4318ff", borderRadius: "8px" }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={item.status === "Active" ? "Block Customer" : "Unblock Customer"}>
                          <IconButton
                            onClick={() => handleToggleStatus(item.id)}
                            sx={{
                              backgroundColor: item.status === "Active" ? "#fff1f0" : "#e6f9ed",
                              color: item.status === "Active" ? "#ff4d49" : "#24d164",
                              borderRadius: "8px"
                            }}
                          >
                            {item.status === "Active" ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
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

export default Customers;