import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  Select,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { formatCurrency, normalizePayoutRequest } from "../../utils/payoutUtils";

const PayoutProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [request, setRequest] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "Bank Transfer",
    referenceId: "",
    notes: "",
  });

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await genericApi.getOne("payout requests", id);
        const normalizedRequest = normalizePayoutRequest(response.data);

        setRequest(normalizedRequest);
        setFormData((currentValue) => ({
          ...currentValue,
          amount: String(
            normalizedRequest.requestedAmount || normalizedRequest.pendingBalance || 0
          ),
          paymentMethod:
            normalizedRequest.paymentMethod !== "N/A"
              ? normalizedRequest.paymentMethod
              : "Bank Transfer",
          referenceId:
            normalizedRequest.referenceId !== "N/A"
              ? normalizedRequest.referenceId
              : "",
          notes: normalizedRequest.notes || "",
        }));
      } catch (error) {
        console.error("Error fetching payout request:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentValue) => ({ ...currentValue, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const approvedAmount = Number(formData.amount);

    if (!approvedAmount || approvedAmount <= 0 || !formData.referenceId.trim()) {
      alert("Please enter a valid amount and transaction reference ID.");
      return;
    }

    if (request?.pendingBalance && approvedAmount > request.pendingBalance) {
      alert("Approved amount cannot exceed the pending balance.");
      return;
    }

    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const nextAlreadyPaid = request.alreadyPaid + approvedAmount;
      const nextPendingBalance = Math.max(request.pendingBalance - approvedAmount, 0);

      await genericApi.update("payout requests", id, {
        Status: "Approved",
        "Payment Method": formData.paymentMethod,
        "Reference ID": formData.referenceId.trim(),
        Notes: formData.notes.trim(),
        "Paid Amount": approvedAmount,
        "Already Paid": nextAlreadyPaid,
        "Pending Balance": nextPendingBalance,
        "Approved At": timestamp,
        "Approved By": "Super Admin",
        "Last Payout Date": timestamp,
        "Audit Status": "Pending Verification",
        "Audit Updated At": timestamp,
      });

      alert(
        `Payout of ${formatCurrency(
          approvedAmount
        )} processed successfully. Review it in Payout Audit for final verification.`
      );
      navigate("/payout-requests");
    } catch (error) {
      console.error("Payout error:", error);
      alert("Failed to process payout.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Typography color="error">Unable to load this payout request.</Typography>
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
            Process Store Payout
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Approve and pay request for {request.storeName}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper
            sx={{
              p: 4,
              borderRadius: "15px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
              Request Summary
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Requested Amount:</Typography>
                <Typography fontWeight="700" color="#2d60ff">
                  {formatCurrency(request.requestedAmount)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Pending Balance:</Typography>
                <Typography fontWeight="700" color="#ff4d49">
                  {formatCurrency(request.pendingBalance)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Already Paid:</Typography>
                <Typography fontWeight="700" color="#24d164">
                  {formatCurrency(request.alreadyPaid)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Bank Account:</Typography>
                <Typography fontWeight="700" sx={{ fontSize: "12px", maxWidth: "58%" }}>
                  {request.bankDetails.summary}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Store Phone:</Typography>
                <Typography fontWeight="700">{request.phone}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="textSecondary">
                Confirming this action will move the request into payout audit and mark
                it ready for financial verification.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              p: 4,
              borderRadius: "15px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                    Amount to Approve (₹)
                  </Typography>
                  <TextField
                    fullWidth
                    name="amount"
                    type="number"
                    value={formData.amount}
                    placeholder="Enter final amount..."
                    onChange={handleChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                    Payment Method
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      sx={{ borderRadius: "8px" }}
                    >
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Cheque">Cheque</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                    Transaction Reference ID
                  </Typography>
                  <TextField
                    fullWidth
                    name="referenceId"
                    placeholder="Enter TXN ID..."
                    value={formData.referenceId}
                    onChange={handleChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
                    Notes
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    name="notes"
                    placeholder="Add internal finance notes..."
                    value={formData.notes}
                    onChange={handleChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#24d164",
                    "&:hover": { backgroundColor: "#1fa951" },
                    borderRadius: "8px",
                    textTransform: "none",
                    py: 1.5,
                    fontWeight: "600",
                  }}
                >
                  {isSubmitting ? "Processing..." : "Approve & Send to Audit"}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PayoutProcess;


