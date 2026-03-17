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
  Button,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Grid,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorIcon from "@mui/icons-material/Error";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import axios from "axios";

const PayoutValidation = () => {
  const [validations, setValidations] = useState([]);
  const [search, setSearch] = useState("");

  // API Call (using JSONPlaceholder as fakeapi)
  useEffect(() => {
    fetchPayoutValidations();
  }, []);

  const fetchPayoutValidations = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      
      // Map fake data to our validation columns
      const formattedData = response.data.map((item, index) => {
        const amount = Math.floor(Math.random() * 5000) + 1000;
        const methods = ["Bank Transfer", "UPI", "Cheque"];
        
        return {
          id: item.id,
          storeName: `${item.company.name} ${index % 2 === 0 ? "Outlet" : "Store"}`,
          phone: item.phone,
          amount: `₹${amount}`,
          method: methods[index % 3],
          referenceId: `REF${100000 + item.id}`,
          date: `2024-03-${10 + index}`,
          status: index % 4 === 0 ? "Flagged" : (index % 2 === 0 ? "Validated" : "Under Review")
        };
      });

      setValidations(formattedData);
    } catch (error) {
      console.error("Error fetching payout validations:", error);
    }
  };

  const filteredValidations = React.useMemo(() => {
    return validations.filter((item) =>
      item.storeName?.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.referenceId?.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [validations, search]);

  const getStatusChip = (status) => {
    switch (status) {
      case "Validated":
        return <Chip label={status} size="small" sx={{ backgroundColor: "#e6f9ed", color: "#24d164", fontWeight: "700" }} />;
      case "Flagged":
        return <Chip label={status} size="small" sx={{ backgroundColor: "#fff1f0", color: "#ff4d49", fontWeight: "700" }} />;
      case "Under Review":
        return <Chip label={status} size="small" sx={{ backgroundColor: "#fff8e6", color: "#ffb800", fontWeight: "700" }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };  const [payoutRules, setPayoutRules] = useState({
    minAmount: 500,
    minDays: 7
  });

  const handleRuleChange = (e) => {
    const { name, value } = e.target;
    setPayoutRules(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveRules = () => {
    alert(`Payout rules updated: Min Amount ₹${payoutRules.minAmount}, Min Days ${payoutRules.minDays}`);
    // In a real app, you'd save this to a database
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Payout Validation Audit
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Review and audit store payout history to ensure compliance.
        </Typography>
      </Box>

      {/* Rules Settings */}
      <Paper sx={{ p: 4, borderRadius: "20px", mb: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
          Payout Request Rules
        </Typography>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
              Minimum Payout Amount (₹)
            </Typography>
            <TextField
              fullWidth
              name="minAmount"
              type="number"
              value={payoutRules.minAmount}
              onChange={handleRuleChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
              Minimum Days Gap Between Payouts
            </Typography>
            <TextField
              fullWidth
              name="minDays"
              type="number"
              value={payoutRules.minDays}
              onChange={handleRuleChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSaveRules}
              sx={{
                backgroundColor: "#2d60ff",
                "&:hover": { backgroundColor: "#2046cc" },
                borderRadius: "10px",
                py: 1.5,
                fontWeight: "700",
                textTransform: "none"
              }}
            >
              Update Rules
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header */}
        <Box 
          sx={{ 
            p: 3, 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1"
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Payout Validation Audit
          </Typography>
        </Box>

        {/* Toolbar (Search) */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          sx={{ p: 3 }}
        >
          <Typography variant="body2" sx={{ mr: 1, fontWeight: "500" }}>Search:</Typography>
          <TextField
            size="small"
            placeholder="Search by store or REF ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              width: "280px"
            }}
          />
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Store</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Ref ID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Method</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredValidations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No audit records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredValidations.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="700" color="#1b2559">{item.storeName}</Typography>
                      <Typography variant="caption" color="textSecondary">{item.phone}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "600" }}>{item.referenceId}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{item.amount}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.method}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.date}</TableCell>
                    <TableCell>{getStatusChip(item.status)}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Verify Transaction">
                            <IconButton 
                                sx={{ 
                                    backgroundColor: "#e6f9ed", 
                                    color: "#24d164",
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#d1f5db" }
                                }}
                            >
                                <VerifiedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Receipt">
                            <IconButton 
                                sx={{ 
                                    backgroundColor: "#e0e7ff", 
                                    color: "#4318ff",
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#ced4ff" }
                                }}
                            >
                                <ReceiptLongIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Flag Issue">
                            <IconButton 
                                sx={{ 
                                    backgroundColor: "#fff1f0", 
                                    color: "#ff4d49",
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#ffccc7" }
                                }}
                            >
                                <ErrorIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
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
  );
};

export default PayoutValidation;
