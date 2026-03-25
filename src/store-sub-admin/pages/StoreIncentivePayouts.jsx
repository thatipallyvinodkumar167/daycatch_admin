import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  alpha,
  CircularProgress,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  MonetizationOn as IncentiveIcon,
  PaymentsOutlined as PaymentIcon,
  AccountBalanceWallet as WalletIcon,
  Person as PersonIcon,
  History as HistoryIcon
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

const StoreIncentivePayouts = () => {
  const { store } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [incentives] = useState([]); // Default empty for "No data found"

  useEffect(() => {
    // Simulating loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#E53935" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box sx={{ p: 2, borderRadius: "18px", bgcolor: alpha("#E53935", 0.08) }}>
             <IncentiveIcon sx={{ color: "#E53935", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Incentive Payouts
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
               Manage and track payouts for delivery personnel at {store.name}.
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder="Search Delivery Boy..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#a3aed0" }} /></InputAdornment>,
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: "320px" }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Delivery Boy</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Bank/UPI</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Total Incentive</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Paid Incentive</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Pending Incentive</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incentives.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 12 }}>
                      <Stack alignItems="center" spacing={2.5}>
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#E53935", 0.05) }}>
                          <WalletIcon sx={{ color: "#E53935", fontSize: 56, opacity: 0.3 }} />
                        </Box>
                        <Box>
                           <Typography variant="h5" color="#1b2559" fontWeight="900" gutterBottom>No data found</Typography>
                           <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>No incentive payouts recorded yet.</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  incentives.map((row, index) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: alpha("#E53935", 0.1), color: "#E53935" }}><PersonIcon /></Avatar>
                          <Typography variant="body1" fontWeight="800" color="#1b2559">{row.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#707eae">{row.address}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ bgcolor: alpha("#05cd99", 0.08), px: 1.5, py: 0.5, borderRadius: "8px", color: "#05cd99" }}>{row.upi}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#1b2559" }}>₹{row.total}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#05cd99" }}>₹{row.paid}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#ee5d50" }}>₹{row.pending}</TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<PaymentIcon />}
                            sx={{ borderRadius: "10px", bgcolor: "#E53935", fontWeight: 800, textTransform: "none" }}
                          >
                            Pay Now
                          </Button>
                          <IconButton size="small" sx={{ color: "#E53935" }}><HistoryIcon fontSize="small" /></IconButton>
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
    </Box>
  );
};

export default StoreIncentivePayouts;
