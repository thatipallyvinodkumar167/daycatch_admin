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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";
import PaymentIcon from "@mui/icons-material/Payment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";

const DeliveryBoyIncentive = () => {
  const navigate = useNavigate();
  const [incentives, setIncentives] = useState([]);
  const [search, setSearch] = useState("");

  // API Call (using JSONPlaceholder as fakeapi)
  useEffect(() => {
    fetchIncentives();
  }, []);

  const fetchIncentives = async () => {
    try {
      const response = await genericApi.getAll("deliveryboy_incentives");
      const list = response.data.results || response.data || [];

      const formattedData = list.map((item, index) => ({
        id: item._id || index + 1,
        name: item["Delivery Boy"] || "—",
        phone: item.Phone || item.Mobile || "—",
        address: item.Address || "—",
        bankUpi: typeof item["Bank/UPI"] === "object" ? 
          `UPI: ${item["Bank/UPI"].upi || "N/A"}` : 
          (item["Bank/UPI"] || "—"),
        totalIncentive: `₹${item["Total Incentive"] ?? 0}`,
        paidIncentive: `₹${item["Paid Incentive"] ?? 0}`,
        pendingIncentive: `₹${item["Pending Incentive"] ?? 0}`,
      }));

      setIncentives(formattedData);
    } catch (error) {
      console.error("Error fetching incentives:", error);
    }
  };

  const filteredIncentives = React.useMemo(() => {
    return incentives.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.phone?.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [incentives, search]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Manage incentive payouts for your delivery fleet.
        </Typography>
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
            Incentive Payouts
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
            placeholder="Search by boy name..."
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Delivery Boy</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Bank/UPI</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Total Incentive</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Paid Incentive</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Pending Incentive</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIncentives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredIncentives.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="700" color="#1b2559">{item.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{item.phone}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#475467", maxWidth: "150px" }}>{item.address}</TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "400" }}>{item.bankUpi}</TableCell>
                    <TableCell sx={{ color: "#2b3674", fontWeight: "700" }}>{item.totalIncentive}</TableCell>
                    <TableCell sx={{ color: "#24d164", fontWeight: "700" }}>{item.paidIncentive}</TableCell>
                    <TableCell sx={{ color: "#ff4d49", fontWeight: "700" }}>{item.pendingIncentive}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Pay Now">
                            <IconButton 
                                onClick={() => navigate(`/delivery-boy-incentive/pay/${item.id}`)}
                                sx={{ 
                                    backgroundColor: "#e6f9ed", 
                                    color: "#24d164",
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#d1f5db" }
                                }}
                            >
                                <PaymentIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                            <IconButton 
                                onClick={() => navigate(`/delivery-boy-list/details/${item.id}`)}
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
                        <Tooltip title="History">
                            <IconButton 
                                onClick={() => navigate(`/delivery-boy-incentive/history/${item.id}`)}
                                sx={{ 
                                    backgroundColor: "#fff1f0", 
                                    color: "#ff4d49",
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#ffccc7" }
                                }}
                            >
                                <HistoryIcon fontSize="small" />
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

export default DeliveryBoyIncentive;
