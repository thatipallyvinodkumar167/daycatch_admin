import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
  InfoOutlined as InfoIcon,
  Payments as PaymentsIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { formatStoreDate, matchesStoreRecord } from "../utils/storeWorkspace";

const StorePayoutRequest = () => {
  const { store } = useOutletContext();
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchPayoutData = async () => {
    setLoading(true);
    try {
      const [balanceResponse, payoutResponse] = await Promise.all([
        genericApi.getAll("storepayments"),
        genericApi.getAll("payout requests"),
      ]);

      const payments = (balanceResponse?.data?.results || []).filter((row) =>
        matchesStoreRecord(row, store)
      );
      const payouts = (payoutResponse?.data?.results || []).filter((row) =>
        matchesStoreRecord(row, store)
      );

      const pendingBalance = payments.reduce(
        (sum, payment) => sum + Number(payment["Pending Balance"] || 0),
        0
      );

      setEarnings(pendingBalance);
      setHistory(payouts);
    } catch (error) {
      console.error("Payout Data Error:", error);
      setEarnings(0);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (store?.id || store?.name) {
      fetchPayoutData();
    }
  }, [store?.id, store?.name]);

  const handleRequestPayout = async () => {
    if (earnings < 100 || requesting) return;

    setRequesting(true);
    try {
      await genericApi.create("payout requests", {
        storeId: store.id,
        Store: store.name,
        Address: store.address || "N/A",
        Phone: store.phone || "",
        "Total Revenue": earnings,
        "Bank Account Details": store.bankDetails || { status: "Pending Store Setup" },
        "Already Paid": 0,
        "Pending Balance": earnings,
        Amount: earnings,
        Status: "Pending",
        "Requested At": new Date().toISOString(),
      });

      await fetchPayoutData();
    } catch (error) {
      console.error("Payout request failed:", error);
    } finally {
      setRequesting(false);
    }
  };

  const StatusChip = ({ status }) => {
    const normalizedStatus = String(status || "").toLowerCase();

    if (normalizedStatus === "approved" || normalizedStatus === "completed") {
      return (
        <Chip
          label="Approved"
          size="small"
          icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
          sx={{
            bgcolor: alpha("#05cd99", 0.1),
            color: "#05cd99",
            fontWeight: 800,
            borderRadius: "10px",
          }}
        />
      );
    }

    if (normalizedStatus === "rejected" || normalizedStatus === "failed") {
      return (
        <Chip
          label="Rejected"
          size="small"
          icon={<ErrorIcon sx={{ fontSize: "14px !important" }} />}
          sx={{
            bgcolor: alpha("#ee5d50", 0.1),
            color: "#ee5d50",
            fontWeight: 800,
            borderRadius: "10px",
          }}
        />
      );
    }

    return (
      <Chip
        label="Pending"
        size="small"
        icon={<ScheduleIcon sx={{ fontSize: "14px !important" }} />}
        sx={{
          bgcolor: alpha("#E53935", 0.1),
          color: "#E53935",
          fontWeight: 800,
          borderRadius: "10px",
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#E53935" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Send Payout Request
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Withdraw your store earnings to your bank account.
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper
              sx={{
                p: 4.5,
                borderRadius: "32px",
                border: "1px solid #e0e5f2",
                boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                background: earnings < 100 ? "#fdfdff" : "#fff",
              }}
            >
              <Stack spacing={3} alignItems="center" textAlign="center">
                <Box sx={{ p: 2, borderRadius: "20px", bgcolor: alpha("#E53935", 0.05), display: "flex" }}>
                  <PaymentsIcon sx={{ color: "#E53935", fontSize: 40 }} />
                </Box>

                <Box>
                  <Typography
                    variant="body1"
                    fontWeight="800"
                    color="#a3aed0"
                    sx={{ textTransform: "uppercase", letterSpacing: "1px" }}
                  >
                    Current Earning
                  </Typography>
                  <Typography variant="h1" fontWeight="900" color="#1b2559" sx={{ mt: 1, letterSpacing: "-2px" }}>
                    Rs. {earnings.toLocaleString()}
                  </Typography>
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
                      color: "#b08104",
                    }}
                  >
                    You cannot request for payout because your earning is less than Rs 100
                  </Alert>
                ) : (
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleRequestPayout}
                    disabled={requesting}
                    sx={{
                      py: 2,
                      borderRadius: "20px",
                      bgcolor: "#E53935",
                      fontWeight: 900,
                      textTransform: "none",
                      fontSize: "16px",
                      boxShadow: "0 14px 28px rgba(229, 57, 53,0.22)",
                    }}
                  >
                    {requesting ? "Submitting..." : "Request Payout Now"}
                  </Button>
                )}

                <Typography variant="caption" color="#a3aed0" sx={{ mt: 2, fontWeight: 600 }}>
                  Minimum payout limit is controlled by Super Admin settings.
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              sx={{
                p: 4,
                borderRadius: "32px",
                border: "1px solid #e0e5f2",
                boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
              }}
            >
              <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ mb: 4 }}>
                Recent History
              </Typography>

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
                        <TableCell colSpan={3} align="center" sx={{ py: 6, color: "#a3aed0", fontWeight: 700 }}>
                          No payout history found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      history.map((entry, index) => (
                        <TableRow key={entry._id || entry.id || index} hover sx={{ transition: "0.2s" }}>
                          <TableCell sx={{ fontWeight: 700, color: "#1b2559" }}>
                            {formatStoreDate(entry["Requested At"] || entry.createdAt || entry.Date)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 900, color: "#1b2559" }}>
                            Rs. {Number(entry.Amount || 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <StatusChip status={entry.Status || "Pending"} />
                          </TableCell>
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
