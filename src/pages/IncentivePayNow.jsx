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
  Avatar,
  IconButton,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InfoIcon from "@mui/icons-material/Info";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { genericApi } from "../api/genericApi";
import {
  formatCurrency,
  normalizeIncentiveRecord,
} from "../utils/deliveryIncentiveUtils";

const IncentivePayNow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boy, setBoy] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "Bank Transfer",
    referenceId: "",
    notes: "",
  });

  useEffect(() => {
    const fetchBoy = async () => {
      try {
        setLoading(true);
        const response = await genericApi.getOne("deliveryboy_incentives", id);
        const record = response.data?.data || response.data?.results || response.data;
        setBoy(normalizeIncentiveRecord(record));
      } catch (error) {
        console.error("Error fetching incentive record:", error);
        setBoy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBoy();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!boy?.id) {
      alert("Unable to find this incentive record.");
      return;
    }

    if (!formData.amount || !formData.referenceId) {
      alert("Please fill in the required fields.");
      return;
    }

    const amount = Number(formData.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Please enter a valid payout amount.");
      return;
    }

    if (amount > boy.pendingIncentive) {
      alert("Payout amount cannot be greater than the pending incentive.");
      return;
    }

    setIsSubmitting(true);
    try {
      const historyEntry = {
        id: `drv-inc-${Date.now()}`,
        date: new Date().toISOString(),
        amount,
        method: formData.paymentMethod,
        ref: formData.referenceId,
        referenceId: formData.referenceId,
        notes: formData.notes,
        status: "Success",
      };

      await genericApi.update("deliveryboy_incentives", boy.id, {
        "Paid Incentive": boy.paidIncentive + amount,
        "Pending Incentive": Math.max(boy.pendingIncentive - amount, 0),
        History: [...(boy.history || []), historyEntry],
      });

      alert(`Payout of ${formatCurrency(amount)} processed successfully.`);
      navigate("/delivery-boy-incentive");
    } catch (error) {
      console.error("Payout error:", error);
      alert("Failed to process payout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress sx={{ color: "#4318ff" }} />
      </Box>
    );
  }

  if (!boy) {
    return (
      <Box sx={{ p: 4, textAlign: "center", mt: 10 }}>
        <Typography variant="h5" color="error" gutterBottom fontWeight="800">
          Incentive Record Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          The selected driver incentive entry could not be loaded.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/delivery-boy-incentive")} sx={{ bgcolor: "#1b2559", borderRadius: "10px" }}>
          Back to Incentives
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title="Cancel and Return">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "#fff",
              color: "#4318ff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              "&:hover": { bgcolor: "#4318ff", color: "#fff" },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Process Settlement
          </Typography>
          <Typography variant="body2" color="#a3aed0" fontWeight="600">
            Finalizing incentive distribution for <span style={{ color: "#1b2559", fontWeight: "800" }}>{boy.name}</span>
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Avatar sx={{ bgcolor: "#eef2ff", color: "#4318ff", width: 48, height: 48 }}>
                <AccountBalanceWalletIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="800" color="#1b2559">Payout Snapshot</Typography>
                <Typography variant="caption" color="#a3aed0" fontWeight="600">Verified Personnel</Typography>
              </Box>
            </Box>

            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>PENDING BALANCE</Typography>
                <Typography variant="h4" fontWeight="900" color="#ff4d49">{formatCurrency(boy.pendingIncentive)}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>ALREADY SETTLED</Typography>
                <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mt: 0.5 }}>{formatCurrency(boy.paidIncentive)}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>SETTLEMENT CHANNEL</Typography>
                <Typography variant="body2" fontWeight="700" color="#1b2559" sx={{ mt: 0.5 }}>{boy.bankDetailsLabel || "N/A"}</Typography>
              </Box>

              <Divider sx={{ my: 1, borderStyle: "dashed" }} />

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <InfoIcon sx={{ color: "#4318ff", fontSize: "16px", mt: 0.2 }} />
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: "500", lineHeight: 1.4 }}>
                  This updates the live incentive ledger for the selected delivery boy and appends a payout history entry for audit.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2" }}>
            <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 4 }}>Settle Incentive Entry</Typography>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3.5}>
                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>AMOUNT TO DISBURSE (Rs)</Typography>
                  <TextField
                    fullWidth
                    name="amount"
                    type="number"
                    placeholder="Enter amount in Rs..."
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PaymentIcon sx={{ color: "#a3aed0", fontSize: "18px" }} /></InputAdornment>,
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>PAYMENT INSTRUMENT</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      sx={{ borderRadius: "14px", bgcolor: "#f4f7fe" }}
                    >
                      <MenuItem value="Bank Transfer">Bank Transfer (IMPS/NEFT)</MenuItem>
                      <MenuItem value="UPI">UPI (GPay/PhonePe)</MenuItem>
                      <MenuItem value="Cash">Direct Cash</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>TRANSACTION / REFERENCE ID</Typography>
                  <TextField
                    fullWidth
                    name="referenceId"
                    placeholder="Enter TXN or UTR number..."
                    required
                    value={formData.referenceId}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><ReceiptLongIcon sx={{ color: "#a3aed0", fontSize: "18px" }} /></InputAdornment>,
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" fontWeight="800" color="#2b3674" sx={{ mb: 1, ml: 0.5 }}>AUDIT REMARKS (OPTIONAL)</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="notes"
                    placeholder="Add settlement notes for history..."
                    value={formData.notes}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}><AssignmentIcon sx={{ color: "#a3aed0", fontSize: "18px" }} /></InputAdornment>,
                    }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe" } }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting || boy.pendingIncentive <= 0}
                  sx={{
                    backgroundColor: "#24d164",
                    "&:hover": { backgroundColor: "#1fb355" },
                    borderRadius: "16px",
                    textTransform: "none",
                    py: 2,
                    fontSize: "16px",
                    fontWeight: "800",
                    boxShadow: "0 10px 20px rgba(36, 209, 100, 0.2)",
                  }}
                >
                  {isSubmitting ? "Finalizing Settlement..." : boy.pendingIncentive <= 0 ? "No Pending Incentive" : "Confirm Payout Settlement"}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IncentivePayNow;
