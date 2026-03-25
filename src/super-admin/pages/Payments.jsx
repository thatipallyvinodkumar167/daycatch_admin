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
  Chip,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import axios from "axios";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      const methods = ["UPI", "Credit Card", "Debit Card", "COD", "Net Banking"];
      const statuses = ["Success", "Success", "Success", "Failed", "Pending"];
      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        txnId: `TXN${(100000 + item.id * 37).toString()}`,
        customerName: item.name,
        amount: `₹${Math.floor(Math.random() * 2000) + 100}`,
        method: methods[index % methods.length],
        status: statuses[index % statuses.length],
        date: `2024-03-${10 + (index % 19)}`,
        time: `${10 + (index % 12)}:${(index % 59).toString().padStart(2, "0")} AM`,
      }));
      setPayments(formattedData);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const filtered = payments.filter(item =>
    item.txnId.toLowerCase().includes(search.toLowerCase().trim()) ||
    item.customerName.toLowerCase().includes(search.toLowerCase().trim()) ||
    item.method.toLowerCase().includes(search.toLowerCase().trim())
  );

  const totalSuccess = payments.filter(p => p.status === "Success").reduce((sum, p) => sum + parseInt(p.amount.replace("₹", "")), 0);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Monitor all payment transactions.
        </Typography>
      </Box>

      {/* Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Transactions", value: payments.length, color: "#2d60ff", bg: "#e0e7ff" },
          { label: "Total Revenue", value: `₹${totalSuccess.toLocaleString()}`, color: "#24d164", bg: "#e6f9ed" },
          { label: "Failed", value: payments.filter(p => p.status === "Failed").length, color: "#ff4d49", bg: "#fff1f0" },
          { label: "Pending", value: payments.filter(p => p.status === "Pending").length, color: "#ffb800", bg: "#fff8e6" },
        ].map((s) => (
          <Paper key={s.label} sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: s.bg }}>
                <AccountBalanceWalletIcon sx={{ color: s.color }} />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">{s.label}</Typography>
                <Typography variant="h6" fontWeight="800" color={s.color}>{s.value}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">All Transactions</Typography>
          <TextField
            size="small"
            placeholder="Search by TXN, customer, or method..."
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>TXN ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Method</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>No transactions found</TableCell></TableRow>
              ) : (
                filtered.map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "700", fontFamily: "monospace" }}>{item.txnId}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{item.customerName}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>{item.amount}</TableCell>
                    <TableCell>
                      <Chip label={item.method} size="small" sx={{ backgroundColor: "#f4f7fe", color: "#2b3674", fontWeight: "600" }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600" color="#1b2559">{item.date}</Typography>
                      <Typography variant="caption" color="textSecondary">{item.time}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          backgroundColor: item.status === "Success" ? "#e6f9ed" : item.status === "Failed" ? "#fff1f0" : "#fff8e6",
                          color: item.status === "Success" ? "#24d164" : item.status === "Failed" ? "#ff4d49" : "#ffb800",
                          fontWeight: "700"
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
    </Box>
  );
};

export default Payments;

