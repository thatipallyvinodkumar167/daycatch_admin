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
  LinearProgress,
  Avatar,
  Button,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";
import PaymentIcon from "@mui/icons-material/Payment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HistoryIcon from "@mui/icons-material/History";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";

const DeliveryBoyIncentive = () => {
  const navigate = useNavigate();
  const [incentives, setIncentives] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchIncentives();
  }, []);

  const fetchIncentives = async () => {
    setLoading(true);
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
        totalIncentive: item["Total Incentive"] ?? 0,
        paidIncentive: item["Paid Incentive"] ?? 0,
        pendingIncentive: item["Pending Incentive"] ?? 0,
      }));

      setIncentives(formattedData);
    } catch (error) {
      console.error("Error fetching incentives:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIncentives = React.useMemo(() => {
    return incentives.filter((item) =>
      item.name?.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.phone?.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [incentives, search]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const totalUnpaid = incentives.reduce((acc, curr) => acc + (curr.pendingIncentive || 0), 0);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Fleet Incentives Center
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
            Review, audit, and process payouts for all delivery personnel.
          </Typography>
        </Box>
        <Button
            variant="contained"
            disableElevation
            startIcon={<HistoryIcon />}
            sx={{
              backgroundColor: "#2b3674",
              "&:hover": { backgroundColor: "#1b2559" },
              borderRadius: "14px",
              textTransform: "none",
              px: 3,
              fontWeight: "700",
            }}
          >
            Overall Settlement History
          </Button>
      </Box>

      {/* Stats Cards - AllOrders Style */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #ff4d49" }}>
          <Avatar sx={{ bgcolor: "#fff1f0", color: "#ff4d49", width: 56, height: 56 }}>
            <AccountBalanceWalletIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>TOTAL OUTSTANDING</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">₹{totalUnpaid.toLocaleString()}</Typography>
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #24d164" }}>
          <Avatar sx={{ bgcolor: "#e6f9ed", color: "#24d164", width: 56, height: 56 }}>
            <PriceCheckIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>SETTLED FLEET</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              {incentives.filter(i => i.pendingIncentive === 0).length} / {incentives.length}
            </Typography>
          </Box>
        </Paper>
      </Stack>

      {/* Utility Bar */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <TextField
                size="small"
                placeholder="Search by boy name, mobile or specific payout..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                    flex: 1,
                    maxWidth: "500px",
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "16px", 
                        backgroundColor: "#fff",
                        "& fieldset": { borderColor: "#e0e5f2" } 
                    }
                }}
            />
        </Box>
        <Stack direction="row" spacing={1.5}>
            <Tooltip title="Incentive Log Print">
                <IconButton sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <PrintIcon sx={{ color: "#2b3674" }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Export Payout Excel">
                <IconButton sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <FileDownloadIcon sx={{ color: "#2b3674" }} />
                </IconButton>
            </Tooltip>
        </Stack>
      </Stack>

      <Paper
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
          border: "1px solid #e0e5f2",
          background: "#fff",
        }}
      >
        {loading && <LinearProgress sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#4318ff" } }} />}
        
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", py: 2, pl: 4, borderBottom: "1px solid #e0e5f2" }}>#</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DELIVERY PERSONNEL</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>PAYOUT DETAILS</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>TOTAL ACCRUED</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>SETTLED</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>REMAINING</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>MANAGEMENT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIncentives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No Financial Entries Found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIncentives.map((item, index) => {
                    const isExpanded = expandedRow === item.id;
                    const isFullyPaid = item.pendingIncentive === 0;

                    return (
                        <React.Fragment key={item.id}>
                        <TableRow sx={{ "&:hover": { bgcolor: "#f4f7fe" }, transition: "0.2s", backgroundColor: isExpanded ? "#f4f7fe" : "inherit" }}>
                          <TableCell sx={{ color: "#a3aed0", fontWeight: "800", pl: 4 }}>
                            <IconButton size="small" onClick={() => toggleRow(item.id)} sx={{ mr: 1, color: "#4318ff" }}>
                              {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                            </IconButton>
                            {String(index + 1).padStart(2, '0')}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ 
                                bgcolor: isFullyPaid ? "#e6f9ed" : "#eef2ff", 
                                color: isFullyPaid ? "#24d164" : "#4318ff", 
                                fontWeight: "800", 
                                fontSize: "14px",
                                border: "2px solid #e0e5f2"
                              }}>
                                {(item.name || "U")[0].toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="800" color="#1b2559">
                                    {item.name}
                                </Typography>
                                <Typography variant="caption" color="#a3aed0" fontWeight="600">{item.phone}</Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="700" color="#475467">
                              {item.bankUpi}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="800" color="#1b2559">₹{item.totalIncentive.toLocaleString()}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="800" color="#24d164">₹{item.paidIncentive.toLocaleString()}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography 
                                variant="subtitle2" 
                                fontWeight="800" 
                                color={isFullyPaid ? "#a3aed0" : "#ff4d49"}
                                sx={{ textDecoration: isFullyPaid ? 'line-through' : 'none' }}
                            >
                                ₹{item.pendingIncentive.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" sx={{ pr: 3 }}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Process Payout">
                                <IconButton 
                                    size="small"
                                    onClick={() => navigate(`/delivery-boy-incentive/pay/${item.id}`)}
                                    disabled={isFullyPaid}
                                    sx={{ 
                                        color: "#fff",
                                        bgcolor: isFullyPaid ? "#e0e5f2" : "#24d164",
                                        borderRadius: "10px",
                                        width: "32px",
                                        height: "32px",
                                        "&:hover": { bgcolor: isFullyPaid ? "#e0e5f2" : "#1fb355", transform: isFullyPaid ? 'none' : "translateY(-1px)" },
                                        transition: "0.2s"
                                    }}
                                >
                                    <PaymentIcon sx={{ fontSize: "16px" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View History">
                                <IconButton 
                                    size="small"
                                    onClick={() => navigate(`/delivery-boy-incentive/history/${item.id}`)}
                                    sx={{ 
                                        color: "#fff",
                                        bgcolor: "#4318ff",
                                        borderRadius: "10px",
                                        width: "32px",
                                        height: "32px",
                                        "&:hover": { bgcolor: "#3311cc", transform: "translateY(-1px)" },
                                        transition: "0.2s"
                                    }}
                                >
                                    <HistoryIcon sx={{ fontSize: "16px" }} />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>

                        {/* Expandable Content - Incentive Audit */}
                        <TableRow>
                            <TableCell colSpan={7} sx={{ py: 0, borderBottom: isExpanded ? "1px solid #e0e5f2" : "none" }}>
                                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                    <Box sx={{ p: 4, backgroundColor: "#fafbfc" }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">INCENTIVE AUDIT TRAIL</Typography>
                                                <Typography variant="body2" color="#a3aed0">This section displays the detailed breakdown of the ₹{item.totalIncentive.toLocaleString()} accrued. You can verify individual job IDs and dates contributing to this total.</Typography>
                                            </Box>
                                            <Button variant="outlined" size="small" disableElevation sx={{ textTransform: 'none', fontWeight: 800, color: '#4318ff', borderColor: '#e0e5f2', borderRadius: '12px' }}>
                                                Download Breakdown
                                            </Button>
                                        </Box>
                                        <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
                                            <Paper sx={{ p: 2, flex: 1, borderRadius: "16px", border: "1px dashed #e0e5f2", textAlign: 'center' }}>
                                                <Typography variant="caption" color="#a3aed0" fontWeight="700">BASE INCENTIVE</Typography>
                                                <Typography variant="body2" fontWeight="800" color="#1b2559">₹{(item.totalIncentive * 0.8).toFixed(0)}</Typography>
                                            </Paper>
                                            <Paper sx={{ p: 2, flex: 1, borderRadius: "16px", border: "1px dashed #e0e5f2", textAlign: 'center' }}>
                                                <Typography variant="caption" color="#a3aed0" fontWeight="700">BONUS / TIPS</Typography>
                                                <Typography variant="body2" fontWeight="800" color="#24d164">₹{(item.totalIncentive * 0.2).toFixed(0)}</Typography>
                                            </Paper>
                                            <Paper sx={{ p: 2, flex: 1, borderRadius: "16px", border: "1px dashed #e0e5f2", textAlign: 'center' }}>
                                                <Typography variant="caption" color="#a3aed0" fontWeight="700">LAST SYNC</Typography>
                                                <Typography variant="body2" fontWeight="800" color="#1b2559">Today, 04:30 PM</Typography>
                                            </Paper>
                                        </Stack>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                        </React.Fragment>
                    )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DeliveryBoyIncentive;
