import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha,
  CircularProgress
} from "@mui/material";
import {
  Payments as PaymentsIcon,
  InfoOutlined as InfoIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StorePayoutRequest = () => {
  const { store } = useOutletContext();
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchPayoutData = async () => {
      try {
        // Fetch store info again or use generic stats to get current balance
        const balanceRes = await genericApi.getAll("payments"); // Simplified
        const myPayments = (balanceRes.data || []).filter(p => 
           String(p.Store || p.storeName || "").toLowerCase().includes(store.name.toLowerCase())
        );
        const totalEarned = myPayments.reduce((sum, p) => sum + Number(p["Total Revenue"] || 0), 0);
        
        // Fetch payout history
        const payoutRes = await genericApi.getAll("payout_requests");
        const myPayouts = (payoutRes.data || []).filter(p => 
          String(p.Store || p.storeName || "").toLowerCase().includes(store.name.toLowerCase())
        );

        setEarnings(totalEarned);
        setHistory(myPayouts);
      } catch (err) {
        console.error("Payout Data Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayoutData();
  }, [store.name]);

  const StatusChip = ({ status }) => {
    const s = String(status).toLowerCase();
    if (s === "approved" || s === "completed") return <Chip label="Approved" size="small" icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />} sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", fontWeight: 800, borderRadius: "10px" }} />;
    if (s === "rejected" || s === "failed") return <Chip label="Rejected" size="small" icon={<ErrorIcon sx={{ fontSize: "14px !important" }} />} sx={{ bgcolor: alpha("#ee5d50", 0.1), color: "#ee5d50", fontWeight: 800, borderRadius: "10px" }} />;
    return <Chip label="Pending" size="small" icon={<ScheduleIcon sx={{ fontSize: "14px !important" }} />} sx={{ bgcolor: alpha("#4318ff", 0.1), color: "#4318ff", fontWeight: 800, borderRadius: "10px" }} />;
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#4318ff" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Send Payout Request
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
              Withdraw your store earnings to your bank account.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4.5, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", background: earnings < 100 ? "#fdfdff" : "#fff" }}>
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Box sx={{ p: 2, borderRadius: "20px", bgcolor: alpha("#4318ff", 0.05), display: "flex" }}>
                  <PaymentsIcon sx={{ color: "#4318ff", fontSize: 40 }} />
                </Box>
                
                <Box>
                  <Typography variant="body1" fontWeight="800" color="#a3aed0" sx={{ textTransform: "uppercase", letterSpacing: "1px" }}>Current Earning</Typography>
                  <Typography variant="h1" fontWeight="900" color="#1b2559" sx={{ mt: 1, letterSpacing: "-2px" }}>₹{earnings.toLocaleString()}</Typography>
                </Box>

                {earnings < 100 ? (
                  <Alert 
                    severity="warning" 
                    icon={<InfoIcon />}
                    sx={{ 
                      borderRadius: "20px", 
                      width: "100%", 
                      bgcolor: alpha("#ffb800", 0.08), 
                      border: "1px solid rgba(255, 184, 0, 0.2)",
                      fontWeight: 700,
                      color: "#b08104"
                    }}
                  >
                    You cannot request for payout because your earning is less than Rs 100
                  </Alert>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 2,
                      borderRadius: "20px",
                      bgcolor: "#4318ff",
                      fontWeight: 900,
                      textTransform: "none",
                      fontSize: "16px",
                      boxShadow: "0 14px 28px rgba(67,24,255,0.22)"
                    }}
                  >
                    Request Payout Now
                  </Button>
                )}
                
                <Typography variant="caption" color="#a3aed0" sx={{ mt: 2, fontWeight: 600 }}>
                  Minimum payout limit is controlled by Super Admin settings.
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
              <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ mb: 4 }}>Recent History</Typography>
              
              <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ bgcolor: "#fafbfc" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800, color: "#a3aed0" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#a3aed0" }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#a3aed0" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {history.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 6, color: "#a3aed0", fontWeight: 700 }}>No payout history found.</TableCell>
                      </TableRow>
                    ) : (
                      history.map((h, i) => (
                        <TableRow key={i} hover sx={{ transition: "0.2s" }}>
                          <TableCell sx={{ fontWeight: 700, color: "#1b2559" }}>{h.Date || "24-Mar-2024"}</TableCell>
                          <TableCell sx={{ fontWeight: 900, color: "#1b2559" }}>₹{h.Amount || 0}</TableCell>
                          <TableCell><StatusChip status={h.Status || "Pending"} /></TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default StorePayoutRequest;
