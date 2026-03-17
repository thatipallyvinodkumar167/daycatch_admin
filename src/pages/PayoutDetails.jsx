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
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const PayoutDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        const total = 45000;
        const paid = 30000;
        setStore({
          ...response.data,
          totalRevenue: `₹${total}`,
          alreadyPaid: `₹${paid}`,
          pendingBalance: `₹${total - paid}`,
          requestedAmount: "₹5,000",
          requestDate: "2024-03-15",
          status: "Pending",
          bankAccount: `A/C: ****${5566 + response.data.id}`,
          ifsc: "VNAQ0001",
          branch: "Main Branch",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payout details:", error);
        setLoading(false);
      }
    };
    fetchStore();
  }, [id]);

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
          <Typography variant="h4" fontWeight="700" color="#2b3674">Payout Request Details</Typography>
          <Typography variant="body1" color="textSecondary">Detailed breakdown for {store.company.name}</Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ borderRadius: "15px", p: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Typography variant="h6" fontWeight="700" color="#1b2559" gutterBottom>Status Summary</Typography>
            <Box sx={{ mt: 2 }}>
                <Chip label={store.status} sx={{ backgroundColor: "#fff8e6", color: "#ffb800", fontWeight: "700", mb: 2 }} />
                <Stack spacing={2}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography color="textSecondary">Requested On:</Typography>
                        <Typography fontWeight="600">{store.requestDate}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography color="textSecondary">Request Amount:</Typography>
                        <Typography fontWeight="700" color="#2d60ff">{store.requestedAmount}</Typography>
                    </Box>
                </Stack>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Button 
                fullWidth 
                variant="contained" 
                onClick={() => navigate(`/payout-requests/process/${id}`)}
                sx={{ backgroundColor: "#24d164", "&:hover": { backgroundColor: "#1fa951" }, borderRadius: "8px", textTransform: "none" }}
            >
                Proceed to Payment
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ borderRadius: "15px", p: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>Financial Overview</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="textSecondary">TOTAL REVENUE</Typography>
                    <Typography variant="h6" fontWeight="700" color="#1b2559">{store.totalRevenue}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="textSecondary">ALREADY PAID</Typography>
                    <Typography variant="h6" fontWeight="700" color="#24d164">{store.alreadyPaid}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="caption" color="textSecondary">PENDING BALANCE</Typography>
                    <Typography variant="h6" fontWeight="700" color="#ff4d49">{store.pendingBalance}</Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>Bank Account Details</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">ACCOUNT NUMBER</Typography>
                    <Typography variant="body1" fontWeight="600">{store.bankAccount}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">IFSC CODE</Typography>
                    <Typography variant="body1" fontWeight="600">{store.ifsc}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="textSecondary">BRANCH</Typography>
                    <Typography variant="body1" fontWeight="600">{store.branch}</Typography>
                </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PayoutDetails;
