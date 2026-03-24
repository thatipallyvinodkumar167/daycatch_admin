import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { genericApi } from "../api/genericApi";
import {
  formatCurrency,
  formatDate,
  normalizePayoutRequest,
} from "../utils/payoutUtils";

const getStatusStyles = (status) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "approved") {
    return { backgroundColor: "#e6f9ed", color: "#24d164" };
  }

  if (normalizedStatus === "rejected") {
    return { backgroundColor: "#fff1f0", color: "#ff4d49" };
  }

  if (normalizedStatus === "flagged") {
    return { backgroundColor: "#fff8e6", color: "#ffb800" };
  }

  return { backgroundColor: "#eef2ff", color: "#4318ff" };
};

const PayoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await genericApi.getOne("payout requests", id);
        setRequest(normalizePayoutRequest(response.data));
      } catch (error) {
        console.error("Error fetching payout details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!request) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error">Payout request details could not be loaded.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Button onClick={() => navigate(-1)} sx={{ minWidth: "auto", color: "#2b3674" }}>
          <ArrowBackIcon />
        </Button>
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">
            Payout Request Details
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Detailed breakdown for {request.storeName}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              borderRadius: "15px",
              p: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1b2559" gutterBottom>
              Status Summary
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip
                label={request.status}
                sx={{
                  ...getStatusStyles(request.status),
                  fontWeight: "700",
                  mb: 2,
                }}
              />
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="textSecondary">Requested On:</Typography>
                  <Typography fontWeight="600">{formatDate(request.requestDate)}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="textSecondary">Request Amount:</Typography>
                  <Typography fontWeight="700" color="#2d60ff">
                    {formatCurrency(request.requestedAmount)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="textSecondary">Audit Status:</Typography>
                  <Typography fontWeight="700">{request.auditStatus}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography color="textSecondary">Reference ID:</Typography>
                  <Typography fontWeight="700">{request.referenceId}</Typography>
                </Box>
              </Stack>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Button
              fullWidth
              variant="contained"
              onClick={() =>
                request.status.toLowerCase() === "approved"
                  ? navigate("/payout-validation")
                  : navigate(`/payout-requests/process/${id}`)
              }
              sx={{
                backgroundColor: "#24d164",
                "&:hover": { backgroundColor: "#1fa951" },
                borderRadius: "8px",
                textTransform: "none",
              }}
            >
              {request.status.toLowerCase() === "approved"
                ? "Open Payout Audit"
                : "Proceed to Payment"}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              borderRadius: "15px",
              p: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
              Financial Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="textSecondary">
                  TOTAL REVENUE
                </Typography>
                <Typography variant="h6" fontWeight="700" color="#1b2559">
                  {formatCurrency(request.totalRevenue)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="textSecondary">
                  ALREADY PAID
                </Typography>
                <Typography variant="h6" fontWeight="700" color="#24d164">
                  {formatCurrency(request.alreadyPaid)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="textSecondary">
                  PENDING BALANCE
                </Typography>
                <Typography variant="h6" fontWeight="700" color="#ff4d49">
                  {formatCurrency(request.pendingBalance)}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
              Beneficiary & Bank Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  STORE
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {request.storeName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  PHONE
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {request.phone}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="textSecondary">
                  ADDRESS
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {request.address}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  ACCOUNT NUMBER
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {request.bankDetails.accountNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  IFSC / UPI
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {request.bankDetails.ifsc !== "N/A"
                    ? request.bankDetails.ifsc
                    : request.bankDetails.upi}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  BRANCH
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {request.bankDetails.branch}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="textSecondary">
                  LAST UPDATED
                </Typography>
                <Typography variant="body1" fontWeight="600">
                  {formatDate(request.updatedAt, true)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PayoutDetails;
