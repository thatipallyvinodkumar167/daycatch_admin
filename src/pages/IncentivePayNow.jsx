import React, { useState, useEffect } from "react";
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
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    notes: ""
  });

  useEffect(() => {
    const fetchBoy = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        setBoy({
          ...response.data,
          pendingAmount: Math.floor(Math.random() * 2000) + 500,
          bankDetails: `SBI - ****${4000 + response.data.id}`
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching boy data:", error);
        setLoading(false);
      }
    };
    fetchBoy();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.referenceId) {
      alert("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call
      await axios.post("https://jsonplaceholder.typicode.com/posts", {
        boyId: id,
        ...formData
      });
      alert(`Payout of ₹${formData.amount} successful!`);
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
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
          <Typography variant="h4" fontWeight="700" color="#2b3674">Process Payout</Typography>
          <Typography variant="body1" color="textSecondary">Incentive payout for {boy.name}</Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>Summary</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Pending Amount:</Typography>
                <Typography fontWeight="700" color="#ff4d49">₹{boy.pendingAmount}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Bank/UPI Info:</Typography>
                <Typography fontWeight="700">{boy.bankDetails}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="textSecondary">
                Ensure the payment details are verified before processing the transaction.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Amount to Pay (₹)</Typography>
                  <TextField
                    fullWidth
                    name="amount"
                    type="number"
                    placeholder="Enter amount..."
                    value={formData.amount}
                    onChange={handleChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Payment Method</Typography>
                  <FormControl fullWidth>
                    <Select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      sx={{ borderRadius: "8px" }}
                    >
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                      <MenuItem value="UPI">UPI</MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Transaction/Reference ID</Typography>
                  <TextField
                    fullWidth
                    name="referenceId"
                    placeholder="Enter reference ID..."
                    value={formData.referenceId}
                    onChange={handleChange}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Notes (Optional)</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    name="notes"
                    placeholder="Add any notes..."
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
                    fontWeight: "600"
                  }}
                >
                  {isSubmitting ? "Processing..." : "Confirm Payment"}
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
