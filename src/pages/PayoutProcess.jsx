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

const PayoutProcess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [store, setStore] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    paymentMethod: "Bank Transfer",
    referenceId: "",
    notes: ""
  });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        setStore({
          ...response.data,
          requestedAmount: Math.floor(Math.random() * 5000) + 1000,
          bankDetails: `A/C: ****${5566 + response.data.id} | IFSC: VNAQ0001`
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching store data:", error);
        setLoading(false);
      }
    };
    fetchStore();
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
      await axios.post("https://jsonplaceholder.typicode.com/posts", {
        storeId: id,
        ...formData
      });
      alert(`Payout of ₹${formData.amount} approved and processed successfully!`);
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
          <Typography variant="h4" fontWeight="700" color="#2b3674">Process Store Payout</Typography>
          <Typography variant="body1" color="textSecondary">Approve and pay request for {store.company.name}</Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 4, borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>Request Summary</Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Requested Amount:</Typography>
                <Typography fontWeight="700" color="#2d60ff">₹{store.requestedAmount}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Bank Account:</Typography>
                <Typography fontWeight="700" sx={{ fontSize: "12px" }}>{store.bankDetails}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="textSecondary">Store Phone:</Typography>
                <Typography fontWeight="700">{store.phone}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="textSecondary">
                Confirming this action will mark the request as "Paid" in the system.
              </Typography>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Amount to Approve (₹)</Typography>
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
                      <MenuItem value="Cheque">Cheque</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Transaction Reference ID</Typography>
                  <TextField
                    fullWidth
                    name="referenceId"
                    placeholder="Enter TXN ID..."
                    value={formData.referenceId}
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
                  {isSubmitting ? "Processing..." : "Approve & Mark as Paid"}
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
