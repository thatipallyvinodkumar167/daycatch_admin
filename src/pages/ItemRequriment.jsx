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
  Button,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Fade,
  Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssessmentIcon from "@mui/icons-material/Assessment";
import StorefrontIcon from "@mui/icons-material/Storefront";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const ItemRequirement = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("list"); // 'list' or 'detail'
  const [requirements, setRequirements] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const selectedStore = null;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const detailItems = [];

  const fetchRequirements = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("item_requirement");
      const results = response.data.results || response.data || [];
      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        storeName: item["Store Name"] || item.storeName || "Unknown Store",
        city: item["City"] || item.city || "City",
        mobile: item["Mobile"] || item.mobile || "N/A",
        email: item["Email"] || item.email || "N/A",
      }));
      setRequirements(formattedData);
    } catch (error) {
      console.error("Error fetching requirements:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequirements();
  }, [fetchRequirements]);

  const filteredRequirements = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return requirements;
    return requirements.filter((item) =>
      item.storeName.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q)
    );
  }, [requirements, search]);

  const stats = useMemo(() => [
    { label: "Total Stores", value: requirements.length, icon: <StorefrontIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Sync Type", value: "Daily Sync", icon: <EventNoteIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [requirements]);

  const handleExport = () => {
    if (filteredRequirements.length === 0) {
      alert("No data available to export.");
      return;
    }

    // CSV Header
    const csvRows = [];
    const headers = ["#", "Store Name", "City", "Mobile", "Email"];
    csvRows.push(headers.join(","));

    // CSV Data Rows
    filteredRequirements.forEach((item, index) => {
      const row = [
        index + 1,
        `"${(item.storeName || "").replace(/"/g, '""')}"`,
        `"${(item.city || "").replace(/"/g, '""')}"`,
        `"${(item.mobile || "").replace(/"/g, '""')}"`,
        `"${(item.email || "").replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Item_Requirements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderListView = () => (
    <Fade in={true}>
      <Box>
        {/* Premium Header Container */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
              <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                  Item Requirements
              </Typography>
              <Typography variant="body2" color="#a3aed0" fontWeight="600">
                  View and manage item requirement reports based on store orders.
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
              <Button 
                  variant="contained" 
                  startIcon={<FileDownloadIcon />}
                  onClick={handleExport}
                  sx={{ 
                      backgroundColor: "#4318ff", 
                      borderRadius: "14px",
                      textTransform: "none",
                      px: 3,
                      py: 1.2,
                      fontWeight: "800",
                      boxShadow: "0 10px 25px rgba(67, 24, 255, 0.2)",
                      "&:hover": { backgroundColor: "#3310cc" }
                  }}
              >
                  Export Data
              </Button>
          </Stack>
        </Box>

        {/* Full Width Matrix Container */}
        <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
            {loading && (
                <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
            )}
            
            <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
                <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Store Requirements List</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Search Store..."
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
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => fetchRequirements(true)} disabled={refreshing} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
                            <RefreshIcon sx={{ color: "#4318ff", fontSize: 20 }} className={refreshing ? "spin-animation" : ""} />
                        </IconButton>
                    </Tooltip>
                </Stack>
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
                            <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Store Name</TableCell>
                            <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>City</TableCell>
                            <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Mobile</TableCell>
                            <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Email</TableCell>
                            <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRequirements.length === 0 && !loading ? (
                            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 10, color: "#a3aed0", fontWeight: "600" }}>No requirements found.</TableCell></TableRow>
                        ) : (
                            filteredRequirements.map((item, index) => (
                                <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                    <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ bgcolor: "rgba(67, 24, 255, 0.05)", color: "#4318ff", borderRadius: "12px", width: 40, height: 40, fontWeight: "800" }}>{item.storeName.charAt(0)}</Avatar>
                                            <Typography variant="body2" fontWeight="800" color="#1b2559">{item.storeName}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ color: "#4318ff", fontWeight: "800" }}>{item.city}</TableCell>
                                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{item.mobile}</TableCell>
                                    <TableCell sx={{ color: "#a3aed0", fontWeight: "600" }}>{item.email}</TableCell>
                                    <TableCell align="right" sx={{ pr: 3 }}>
                                        <Button 
                                            size="small" 
                                            variant="text" 
                                            startIcon={<AssessmentIcon sx={{ fontSize: 16 }} />}
                                            onClick={() => navigate("/sales-report")}
                                            sx={{ color: "#4318ff", fontWeight: "800", textTransform: "none", py: 1, px: 2, borderRadius: "10px", "&:hover": { bgcolor: "rgba(67, 24, 255, 0.05)" } }}
                                        >
                                            View Report
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
      </Box>
    </Fade>
  );

  const renderDetailView = () => (
    <Fade in={true}>
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <IconButton onClick={() => setView("list")} sx={{ bgcolor: "#fff", boxShadow: "0 10px 20px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2" }}>
                <ArrowBackIcon sx={{ color: "#4318ff" }} />
            </IconButton>
            <Box>
                <Typography variant="h4" fontWeight="800" color="#1b2559" sx={{ letterSpacing: "-1px" }}>
                    Requirement Report: {selectedDate}
                </Typography>
                <Typography variant="body2" color="#a3aed0" fontWeight="600">Item requirements for store: {selectedStore?.storeName}</Typography>
            </Box>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "28px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", mb: 4, border: "1px solid #e0e5f2" }}>
            <Stack direction="row" spacing={3} alignItems="flex-end" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0" sx={{ mb: 1, display: "block", textTransform: "uppercase" }}>Date Select</Typography>
                    <TextField
                        type="date"
                        size="small"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#fafbfc", "& fieldset": { borderColor: "#e0e5f2" } } }}
                    />
                </Box>
            </Stack>

            <TableContainer sx={{ borderRadius: "20px", border: "1px solid #f1f1f1", overflow: "hidden" }}>
                <Table>
                    <TableHead sx={{ bgcolor: "#f4f7fe" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", py: 2 }}>#</TableCell>
                            <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", py: 2 }}>Item Name</TableCell>
                            <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", py: 2 }}>Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {detailItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 10 }}>
                                    <Box sx={{ opacity: 0.1, mb: 1 }}>
                                        <EventNoteIcon sx={{ fontSize: 60, color: "#4318ff" }} />
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="800" color="#a3aed0">No requirements found for this store.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            detailItems.map((item, index) => (
                                <TableRow key={index} sx={{ "&:hover": { backgroundColor: "#f9fbff" } }}>
                                    <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>{index + 1}</TableCell>
                                    <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{item.name}</TableCell>
                                    <TableCell sx={{ color: "#4318ff", fontWeight: "900" }}>{item.quantity}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
      </Box>
    </Fade>
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
        {view === "list" ? renderListView() : renderDetailView()}
        <style>
            {`
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .spin-animation {
                animation: spin 1s linear infinite;
            }
            `}
        </style>
    </Box>
  );
};

export default ItemRequirement;