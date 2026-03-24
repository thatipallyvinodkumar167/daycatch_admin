import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Grid,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Fade,
  LinearProgress,
  Avatar
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { genericApi } from "../api/genericApi";


const Reports = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReportData = useCallback(async (isRefresh = false) => {
    if (activeTab === "main") return;
    
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      let collectionName = "";
      
      if (activeTab.startsWith("delivery")) collectionName = "deliveryboy";
      else if (activeTab.startsWith("users")) collectionName = "users";
      else if (activeTab.startsWith("store")) collectionName = "storeList";

      if (collectionName) {
        const response = await genericApi.getAll(collectionName);
        const results = response.data.results || response.data || [];
        
        let formatted = [];
        if (collectionName === "deliveryboy") {
          formatted = results.sort((a, b) => (b.Orders || 0) - (a.Orders || 0)).map((d, i) => ({
            id: i + 1,
            name: d["Boy Name"] || d.name || "Unknown Driver",
            mobile: d["Boy Phone"] || d.mobile || "N/A",
            orders: d.Orders || 0
          }));
        } else if (collectionName === "users") {
          formatted = results.map((u, i) => ({
            id: i + 1,
            name: u["User Name"] || u.name || "Unknown User",
            userMobile: u["User Phone"] || u.mobile || "N/A",
            currentMonth: u.ordersThisMonth || 0,
            previousMonth: u.ordersPrevMonth || 0,
            difference: (u.ordersThisMonth || 0) - (u.ordersPrevMonth || 0)
          }));
          if (activeTab === "users_top") formatted.sort((a, b) => b.currentMonth - a.currentMonth);
          else formatted.sort((a, b) => a.currentMonth - b.currentMonth);
        } else if (collectionName === "storeList") {
          formatted = results.map((s, i) => ({
            id: i + 1,
            name: s["Store Name"] || s.name || "Unknown Store",
            storeId: s.id || s._id || i + 1,
            orders: s.orders || 0
          }));
          formatted.sort((a, b) => b.orders - a.orders);
        }
        setData(formatted);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return data;
    return data.filter(row => 
        (row.name && row.name.toLowerCase().includes(q)) ||
        (row.mobile && row.mobile.toLowerCase().includes(q)) ||
        (row.userMobile && row.userMobile.toLowerCase().includes(q)) ||
        (row.storeId && String(row.storeId).toLowerCase().includes(q))
    );
  }, [data, search]);

  const mainCategories = [
    { 
        id: "delivery", 
        title: "Delivery Partner Reports", 
        icon: <DeliveryDiningIcon sx={{ fontSize: 32, color: "#4318ff" }} />,
        reports: [
            { id: "delivery_top", name: "Top Performers" },
            { id: "delivery_orders", name: "Delivery Volume" }
        ]
    },
    { 
        id: "users", 
        title: "User Reports", 
        icon: <PeopleIcon sx={{ fontSize: 32, color: "#4318ff" }} />,
        reports: [
            { id: "users_top", name: "Top Spenders" },
            { id: "users_worst", name: "Inactive Users" }
        ]
    },
    { 
        id: "stores", 
        title: "Store Reports", 
        icon: <StorefrontIcon sx={{ fontSize: 32, color: "#4318ff" }} />,
        reports: [
            { id: "store_top", name: "Top Selling Stores" },
            { id: "store_orders", name: "Store Sales Volume" }
        ]
    }
  ];

  const renderTable = (headers, title, isTopDelivery = false, isTopStore = false, isTopUser = false) => (
    <Fade in={true}>
    <Box>
        {/* Header Protocol */}
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Stack direction="row" spacing={2} alignItems="center">
              <IconButton 
                  onClick={() => setActiveTab("main")} 
                  sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}
              >
                  <ArrowBackIcon sx={{ color: "#4318ff" }} />
              </IconButton>
              <Box>
                  <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>{title}</Typography>
                  <Typography variant="body2" color="#a3aed0" fontWeight="600">Reports and Insights</Typography>
              </Box>
          </Stack>
          <Stack direction="row" spacing={3} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ color: "#4318ff", display: "flex" }}><AssessmentIcon sx={{ fontSize: 18 }} /></Box>
                    <Box>
                        <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase", display: "block", lineHeight: 1 }}>STATUS</Typography>
                        <Typography variant="subtitle2" fontWeight="800" color="#1b2559">Verified</Typography>
                    </Box>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: "center" }} />
                <Button 
                    variant="contained" 
                    startIcon={<TrendingUpIcon />} 
                    sx={{ backgroundColor: "#4318ff", borderRadius: "14px", textTransform: "none", fontWeight: "800", "&:hover": { backgroundColor: "#3310cc" } }}
                >
                    Export Report
                </Button>
          </Stack>
        </Box>

        {/* Full Width Ledger Hub */}
        <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
            {(loading || refreshing) && (
                <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, bgcolor: "#f4f7fe", "& .MuiLinearProgress-bar": { bgcolor: "#4318ff" } }} />
            )}
            
            <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
                <Typography variant="subtitle1" fontWeight="800" color="#1b2559">{title}</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Search Reports..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#fff", width: "320px" } }}
                    />
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => fetchReportData(true)} disabled={refreshing} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
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
                            {headers.map((h, i) => (
                                <TableCell key={i} sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe", pl: i === 0 ? 4 : 2 }}>
                                    {h}
                                </TableCell>
                            ))}
                            <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length === 0 && !loading ? (
                            <TableRow><TableCell colSpan={headers.length + 1} align="center" sx={{ py: 10, color: "#a3aed0", fontWeight: "800" }}>No records found.</TableCell></TableRow>
                        ) : (
                            filteredData.map((row, i) => (
                                <TableRow key={i} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                    {Object.entries(row).map(([key, val], j) => {
                                        if (isTopDelivery && key === "mobile") return null;
                                        if (isTopStore && key === "storeId") return null;
                                        if (isTopUser && key === "userMobile") return null;

                                        return (
                                            <TableCell key={j} sx={{ py: 2.5, pl: j === 0 ? 4 : 2 }}>
                                                {key === "id" ? (
                                                    <Typography variant="body2" fontWeight="800" color="#1b2559">#{val}</Typography>
                                                ) : (key === "name") ? (
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Avatar sx={{ bgcolor: "rgba(67, 24, 255, 0.05)", color: "#4318ff", borderRadius: "10px", width: 32, height: 32, fontSize: "14px", fontWeight: "900" }}>{String(val).charAt(0)}</Avatar>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="800" color="#1b2559">{val}</Typography>
                                                            <Typography variant="caption" color="#a3aed0" fontWeight="700">
                                                                {isTopDelivery ? row.mobile : isTopStore ? row.storeId : isTopUser ? row.userMobile : ""}
                                                            </Typography>
                                                        </Box>
                                                    </Stack>
                                                ) : key === "difference" ? (
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Typography variant="body2" fontWeight="900" color={val >= 0 ? "#00d26a" : "#ff4d49"}>{val > 0 ? `+${val}` : val}</Typography>
                                                        {val !== 0 && <TrendingUpIcon sx={{ fontSize: 14, color: val > 0 ? "#00d26a" : "#ff4d49", transform: val < 0 ? "rotate(180deg)" : "none" }} />}
                                                    </Box>
                                                ) : (
                                                    <Typography variant="body2" fontWeight={key.includes("current") || key === "orders" ? "900" : "600"} color={key.includes("current") || key === "orders" ? "#4318ff" : "#1b2559"}>
                                                        {val}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell align="right" sx={{ pr: 3 }}>
                                        <Button 
                                            variant="text" 
                                            size="small"
                                            startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                                            sx={{ borderRadius: "10px", color: "#4318ff", fontWeight: "800", textTransform: "none", "&:hover": { bgcolor: "rgba(67, 24, 255, 0.05)" } }}
                                        >
                                            Details
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

  const renderActiveReport = () => {
    switch (activeTab) {
        case "delivery_top":
            return renderTable(
                ["#", "Driver Name", "Volume (30D)"],
                "Top Performing Delivery Partners",
                true
            );
        case "delivery_orders":
            return renderTable(
                ["#", "Driver Name", "Total Orders"],
                "Delivery Volume Report",
                true
            );
        case "users_top":
            return renderTable(
                ["#", "User Name", "Curr. Month", "Prev. Month", "Change"],
                "Top User Spenders",
                false,
                false,
                true
            );
        case "users_worst":
            return renderTable(
                ["#", "User Name", "Curr. Month", "Prev. Month", "Change"],
                "Inactive User Report",
                false,
                false,
                true
            );
        case "store_top":
            return renderTable(
                ["#", "Store Name", "Total Orders"],
                "Top Selling Stores Report",
                false,
                true
            );
        case "store_orders":
            return renderTable(
                ["#", "Store Name", "Order Volume"],
                "Store Sales Volume Report",
                false,
                true
            );
        default:
            return (
                <Fade in={true}>
                <Box>
                    <Grid container spacing={4}>
                        {mainCategories.map((cat) => (
                            <Grid item xs={12} md={4} key={cat.id}>
                                <Card sx={{ borderRadius: "32px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", height: "100%", transition: "0.3s", "&:hover": { transform: "translateY(-10px)", boxShadow: "0 20px 60px rgba(67, 24, 255, 0.08)" } }}>
                                    <Box sx={{ p: 4, textAlign: "center", borderBottom: "1px solid #f1f1f1", bgcolor: "#fafbfc" }}>
                                        <Box sx={{ p: 2, borderRadius: "24px", bgcolor: "#fff", display: "inline-flex", mb: 2, boxShadow: "0 8px 24px rgba(0,0,0,0.02)" }}>{cat.icon}</Box>
                                        <Typography variant="h5" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1px" }}>{cat.title}</Typography>
                                    </Box>
                                    <CardContent sx={{ p: 4 }}>
                                        <Stack spacing={2.5}>
                                            {cat.reports.map((report) => (
                                                <Button 
                                                    key={report.id}
                                                    fullWidth 
                                                    variant="text"
                                                    onClick={() => setActiveTab(report.id)}
                                                    startIcon={<AssessmentIcon sx={{ fontSize: 18 }} />}
                                                    sx={{ 
                                                        color: "#1b2559", 
                                                        borderRadius: "16px", 
                                                        py: 1.5, 
                                                        textTransform: "none", 
                                                        fontWeight: "800",
                                                        justifyContent: "flex-start",
                                                        px: 3,
                                                        bgcolor: "#f4f7fe",
                                                        "&:hover": { bgcolor: "#4318ff", color: "#fff" }
                                                    }}
                                                >
                                                    {report.name}
                                                </Button>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                </Fade>
            );
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      {activeTab === "main" && (
        <Box sx={{ mb: 6 }}>
            <Typography variant="h3" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-2px" }}>Reports Dashboard</Typography>
            <Typography variant="body1" color="#a3aed0" fontWeight="600">View and manage all application reports and insights.</Typography>
        </Box>
      )}

      {renderActiveReport()}
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

export default Reports;