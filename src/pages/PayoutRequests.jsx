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
  Stack,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentsIcon from "@mui/icons-material/Payments";

import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const PayoutRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");


  // API Call (using JSONPlaceholder as fakeapi)
  useEffect(() => {
    fetchPayoutRequests();
  }, []);


  const fetchPayoutRequests = async () => {
    try {
      const response = await genericApi.getAll("payout requests");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        storeName: item.Store || "Direct Store",
        phone: item.Phone || item.Mobile || "N/A",
        address: item.Address || "N/A",
        totalRevenue: `₹${item["Total Revenue"] || 0}`,
        bankDetails: typeof item["Bank Account Details"] === "object" ? 
          `A/C: ${item["Bank Account Details"].accountNumber || "****"} | IFSC: ${item["Bank Account Details"].ifsc || "N/A"}` : 
          (item["Bank Account Details"] || "N/A"),
        alreadyPaid: `₹${item["Already Paid"] || 0}`,
        pendingBalance: `₹${item["Pending Balance"] || 0}`,
        amount: `₹${item.Amount || 0}`,
        status: item.Status || "Pending"
      }));

      setRequests(formattedData);
    } catch (error) {
      console.error("Error fetching payout requests:", error);
    }
  };

  const filteredRequests = React.useMemo(() => {
    return requests.filter((item) =>
      item.storeName?.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.phone?.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [requests, search]);

  const handleReject = (id, name) => {
    if (window.confirm(`Are you sure you want to reject the payout request for ${name}?`)) {
        setRequests(prev => prev.filter(item => item.id !== id));
        alert("Request rejected successfully.");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
            Hi, Day Catch Super Admin Panel.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Manage and process store payout requests.
            </Typography>
        </Box>
        <Paper sx={{ p: 2, borderRadius: "12px", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
            <Stack direction="row" spacing={3}>
                <Box>
                    <Typography variant="caption" color="textSecondary" fontWeight="600">MIN. AMOUNT</Typography>
                    <Typography variant="body2" fontWeight="700" color="#2b3674">₹500</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                    <Typography variant="caption" color="textSecondary" fontWeight="600">MIN. DAYS GAP</Typography>
                    <Typography variant="body2" fontWeight="700" color="#2b3674">7 Days</Typography>
                </Box>
            </Stack>
        </Paper>
      </Box>

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
            Store Payout Requests
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
            placeholder="Search by store name..."
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Total Revenue</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Bank Account Details</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Already Paid</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Pending Balance</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Amount</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    No payout requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="700" color="#1b2559">{item.storeName}</Typography>
                      <Typography variant="caption" color="textSecondary">{item.phone}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#475467", maxWidth: "150px" }}>{item.address}</TableCell>
                    <TableCell sx={{ color: "#2b3674", fontWeight: "700" }}>{item.totalRevenue}</TableCell>
                    <TableCell>
                        <Stack spacing={0.5}>
                            <Typography variant="caption" sx={{ color: "#1b2559", fontWeight: "600", backgroundColor: "#f4f7fe", px: 1, py: 0.5, borderRadius: "4px" }}>
                                {item.bankDetails}
                            </Typography>
                        </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#24d164", fontWeight: "700" }}>{item.alreadyPaid}</TableCell>
                    <TableCell sx={{ color: "#ff4d49", fontWeight: "700" }}>{item.pendingBalance}</TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "800", fontSize: "15px" }}>{item.amount}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Approve & Pay">
                            <IconButton 
                                onClick={() => {
                                    // This block is likely intended for a separate component (e.g., PayoutProcess)
                                    // but is included here as per the instruction's placement.
                                    // In a real application, this logic would be in the component
                                    // that handles the actual approval and payment process.
                                    // For now, we'll keep the navigation as the primary action.
                                    navigate(`/payout-requests/process/${item.id}`);
                                    /*
                                    try {
                                        await genericApi.update("payout requests", item.id, {
                                            Status: "Approved",
                                            "Payment Method": formData.paymentMethod, // formData would need to be defined
                                            "Reference ID": formData.referenceId,
                                            "Notes": formData.notes,
                                            "Paid Amount": Number(formData.amount)
                                        });
                                        alert(`Payout of ₹${formData.amount} approved and processed successfully!`);
                                        navigate("/payout-requests");
                                    } catch (error) {
                                        console.error("Error processing payout:", error);
                                        alert("Failed to process payout.");
                                    }
                                    */
                                }}
                                sx={{ 
                                    backgroundColor: "#e6f9ed", 
                                    color: "#24d164",
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#d1f5db" }
                                }}
                            >
                                <PaymentsIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                            <IconButton 
                                onClick={() => navigate(`/payout-requests/details/${item.id}`)}
                                sx={{ 
                                    backgroundColor: "#e0e7ff", 
                                    color: "#4318ff",
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#ced4ff" }
                                }}
                            >
                                <VisibilityIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reject Request">
                            <IconButton 
                                onClick={() => handleReject(item.id, item.storeName)}
                                sx={{ 
                                    backgroundColor: "#fff1f0", 
                                    color: "#ff4d49",
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#ffccc7" }
                                }}
                            >
                                <CancelIcon fontSize="small" />
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

export default PayoutRequests;
