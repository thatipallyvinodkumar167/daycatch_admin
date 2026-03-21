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
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { genericApi } from "../api/genericApi";

const WalletHistory = () => {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await genericApi.getAll("Wallet_Rechage_History");
      const results = response.data.results || response.data || [];

      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        userName: item["User Name"] || item.userName || "Unknown User",
        userPhone: item["User Phone"] || item.userPhone || "N/A",
        rechargeAmount: Number(item["Recharge Amount"] || item.rechargeAmount || 0),
        rechargeDate: item["Recharge Date"] ? new Date(item["Recharge Date"]).toLocaleDateString() : "N/A",
        status: item.Status || item.status || "Pending",
        medium: item.Medium || item.medium || "N/A",
        currentBalance: Number(item["Current Amount"] || item.currentBalance || 0),
        avatar: `https://ui-avatars.com/api/?name=${item["User Name"] || item.userName || "U"}&background=random&color=fff`,
      }));

      setRecords(formattedData);
    } catch (error) {
      console.error("Error fetching wallet history:", error);
    }
  };

  const filtered = records.filter(
    (r) =>
      r.userName.toLowerCase().includes(search.toLowerCase().trim()) ||
      r.userPhone.toLowerCase().includes(search.toLowerCase().trim())
  );

  const statusColor = (status) => {
    if (status === "Success") return { bg: "#e6f9ed", color: "#24d164" };
    if (status === "Failed") return { bg: "#fff1f0", color: "#ff4d49" };
    return { bg: "#fff8e6", color: "#ffb800" };
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Complete history of all wallet recharge transactions.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: "Total Recharges",
            value: records.length,
            color: "#2d60ff",
            bg: "#e0e7ff",
          },
          {
            label: "Successful",
            value: records.filter((r) => r.status === "Success").length,
            color: "#24d164",
            bg: "#e6f9ed",
          },
          {
            label: "Failed",
            value: records.filter((r) => r.status === "Failed").length,
            color: "#ff4d49",
            bg: "#fff1f0",
          },
          {
            label: "Total Recharged",
            value: `₹${records.reduce((sum, r) => sum + r.rechargeAmount, 0).toLocaleString()}`,
            color: "#ffb800",
            bg: "#fff8e6",
          },
        ].map((stat) => (
          <Paper
            key={stat.label}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{ p: 1.5, borderRadius: "12px", backgroundColor: stat.bg }}
              >
                <AccountBalanceWalletIcon sx={{ color: stat.color }} />
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  fontWeight="600"
                >
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">
                  {stat.value}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Table */}
      <Paper
        sx={{
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1",
          }}
        >
          <Typography variant="h6" fontWeight="700" color="#1b2559">
            Wallet Recharge History
          </Typography>
          <TextField
            size="small"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
              width: "300px",
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>USER NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>USER MOBILE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>RECHARGE AMOUNT</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>RECHARGE DATE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>MEDIUM</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>CURRENT BALANCE</TableCell>
                <TableCell align="center" sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>DETAILS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    No Records Found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    {/* # */}
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>
                      {index + 1}
                    </TableCell>

                    {/* User Name */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          src={item.avatar}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography
                          variant="body2"
                          fontWeight="700"
                          color="#1b2559"
                          noWrap
                          sx={{ maxWidth: 130 }}
                        >
                          {item.userName}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* User Mobile */}
                    <TableCell sx={{ color: "#475467", fontWeight: "500" }}>
                      {item.userPhone}
                    </TableCell>

                    {/* Recharge Amount */}
                    <TableCell
                      sx={{ color: "#24d164", fontWeight: "800", fontSize: "15px" }}
                    >
                      ₹{item.rechargeAmount.toLocaleString()}
                    </TableCell>

                    {/* Recharge Date */}
                    <TableCell sx={{ color: "#475467" }}>
                      {item.rechargeDate}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColor(item.status).bg,
                          color: statusColor(item.status).color,
                          fontWeight: "700",
                        }}
                      />
                    </TableCell>

                    {/* Medium */}
                    <TableCell>
                      <Chip
                        label={item.medium}
                        size="small"
                        variant="outlined"
                        sx={{
                          color: "#2d60ff",
                          borderColor: "#2d60ff",
                          fontWeight: "600",
                          fontSize: "11px",
                        }}
                      />
                    </TableCell>

                    {/* Current Balance */}
                    <TableCell
                      sx={{ color: "#1b2559", fontWeight: "700", fontSize: "15px" }}
                    >
                      ₹{item.currentBalance.toLocaleString()}
                    </TableCell>

                    {/* Details */}
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          sx={{
                            backgroundColor: "#2d60ff",
                            color: "#fff",
                            borderRadius: "10px",
                            "&:hover": { backgroundColor: "#2046cc" },
                          }}
                        >
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