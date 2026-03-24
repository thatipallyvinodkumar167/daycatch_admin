import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  LinearProgress
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import { genericApi } from "../api/genericApi";

const WalletHistory = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecords = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("Wallet_Rechage_History");
      const results = response.data.results || response.data || [];

      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        userName: item["User Name"] || item.userName || "Unknown User",
        userPhone: item["User Phone"] || item.userPhone || "N/A",
        rechargeAmount: Number(item["Recharge Amount"] || item.rechargeAmount || 0),
        rechargeDate: item["Recharge Date"] ? new Date(item["Recharge Date"]).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }) : "N/A",
        status: item.Status || item.status || "Pending",
        medium: item.Medium || item.medium || "N/A",
        currentBalance: Number(item["Current Amount"] || item.currentBalance || 0),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item["User Name"] || item.userName || "U")}&background=random&color=fff`,
      }));

      setRecords(formattedData);
    } catch (error) {
      console.error("Error fetching wallet history:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const filteredRecords = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return records;
    return records.filter(
      (r) =>
        r.userName.toLowerCase().includes(query) ||
        r.userPhone.toLowerCase().includes(query)
    );
  }, [records, search]);

  const stats = useMemo(() => [
    { label: "Total Recharges", value: records.length, icon: <HistoryIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Success", value: records.filter((r) => r.status === "Success" || r.status === "Active").length, icon: <CheckCircleIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
    { label: "Total Amount", value: `₹${records.reduce((sum, r) => sum + r.rechargeAmount, 0).toLocaleString()}`, icon: <AccountBalanceWalletIcon sx={{ fontSize: 18 }} />, color: "#ffb800" },
  ], [records]);

  const getStatusChipStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === "success" || s === "active") return { bgcolor: "rgba(0, 210, 106, 0.08)", color: "#00d26a" };
    if (s === "failed") return { bgcolor: "rgba(255, 77, 73, 0.08)", color: "#ff4d49" };
    return { bgcolor: "rgba(255, 184, 0, 0.08)", color: "#ffb800" };
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Wallet Recharge History
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                View and manage all user wallet recharge transactions.
            </Typography>
        </Box>
        <Stack direction="row" spacing={3} alignItems="center">
            {stats.map((stat) => (
                <Stack key={stat.label} direction="row" spacing={1} alignItems="center">
                    <Box sx={{ color: stat.color, display: "flex" }}>{stat.icon}</Box>
                    <Box>
                        <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase", display: "block", lineHeight: 1 }}>{stat.label}</Typography>
                        <Typography variant="subtitle2" fontWeight="800" color="#1b2559">{stat.value}</Typography>
                    </Box>
                </Stack>
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24, alignSelf: "center" }} />
            <Tooltip title="Refresh List">
                <IconButton 
                    onClick={() => fetchRecords(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
        </Stack>
      </Box>

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          {/* Search Toolbar */}
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Recharge History</Typography>
              <TextField
                  size="small"
                  placeholder="Search history..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                      startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                  }}
                  sx={{ 
                      "& .MuiOutlinedInput-root": { 
                          borderRadius: "14px", 
                          backgroundColor: "#fff",
                          width: "320px"
                      } 
                  }}
              />
          </Box>

          <TableContainer sx={{ 
              maxHeight: "calc(100vh - 280px)",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" }
          }}>
              <Table stickyHeader>
                  <TableHead>
                      <TableRow>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pl: 4, bgcolor: "#f4f7fe" }}>#</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>User Info</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Date & Method</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>New Balance</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredRecords.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                  <Typography color="#a3aed0" fontWeight="600">No recharge history found.</Typography>
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredRecords.map((item, index) => (
                              <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                          <Avatar src={item.avatar} sx={{ width: 44, height: 44, borderRadius: "14px", border: "2px solid #f4f7fe" }} />
                                          <Box>
                                              <Typography variant="body2" fontWeight="800" color="#1b2559" noWrap sx={{ maxWidth: 140 }}>{item.userName}</Typography>
                                              <Typography variant="caption" color="#a3aed0" fontWeight="700">{item.userPhone}</Typography>
                                          </Box>
                                      </Stack>
                                  </TableCell>
                                  <TableCell>
                                      <Typography variant="body2" fontWeight="900" color="#00d26a">RS {item.rechargeAmount.toLocaleString()}</Typography>
                                      <Typography variant="caption" color="#a3aed0" fontWeight="700">Amount Added</Typography>
                                  </TableCell>
                                  <TableCell>
                                      <Typography variant="body2" fontWeight="800" color="#1b2559">{item.rechargeDate}</Typography>
                                      <Chip label={item.medium} size="small" variant="outlined" sx={{ border: "1px dashed", borderColor: "#4318ff", color: "#4318ff", fontWeight: "800", fontSize: "10px", height: "18px" }} />
                                  </TableCell>
                                  <TableCell>
                                      <Typography variant="body2" fontWeight="800" color="#1b2559">RS {item.currentBalance.toLocaleString()}</Typography>
                                      <Typography variant="caption" color="#a3aed0" fontWeight="700">Current Balance</Typography>
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={item.status} 
                                          size="small" 
                                          sx={{ ...getStatusChipStyle(item.status), fontWeight: "800", borderRadius: "8px" }} 
                                      />
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3 }}>
                                      <Tooltip title="View Details">
                                          <IconButton sx={{ bgcolor: "#f4f7fe", color: "#4318ff", borderRadius: "10px", "&:hover": { bgcolor: "#e0e5f2" } }}>
                                              <VisibilityIcon fontSize="small" />
                                          </IconButton>
                                      </Tooltip>
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

export default WalletHistory;