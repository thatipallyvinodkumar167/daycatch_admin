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
  Tooltip,
  Divider,
  LinearProgress,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { genericApi } from "../api/genericApi";

const ItemSaleReport = () => {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSalesReport = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("item_sale_report");
      const results = response.data.results || response.data || [];
      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        productName: item["Product Name"] || item.productName || "Unknown Product",
        variantSize: item["Variant Size"] || item.variantSize || item.Variant || item.variant || item.size || item.Size || item.variation || "N/A",
        quantity: Number(item["Quantity"] || item.quantity || item.qty || item.Stock || 0),
        totalWeight: item["Total Weight"] || item.totalWeight || item.weight || item.Weight || item.total_weight || "0",
      }));
      setSales(formattedData);
    } catch (error) {
      console.error("Error fetching sales report:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSalesReport();
  }, [fetchSalesReport]);

  const filteredSales = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sales;
    return sales.filter((item) =>
      item.productName.toLowerCase().includes(q)
    );
  }, [sales, search]);

  const stats = useMemo(() => [
    { label: "Total Units Sold", value: sales.reduce((acc, curr) => acc + curr.quantity, 0), icon: <AssessmentIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Status", value: "Optimal", icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [sales]);

  const handleExport = () => {
    if (filteredSales.length === 0) {
      alert("No data available to export.");
      return;
    }
    const csvRows = [];
    const headers = ["#", "Product Name", "Variant", "Quantity Sold", "Total Weight"];
    csvRows.push(headers.join(","));
    filteredSales.forEach((item, index) => {
      const row = [
        index + 1,
        `"${(item.productName || "").replace(/"/g, '""')}"`,
        `"${(item.variantSize || "").replace(/"/g, '""')}"`,
        item.quantity,
        `"${String(item.totalWeight || "").replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });
    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Item_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Item Sales Report
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Monitor total item sales and growth performance over the last 30 days.
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
                Export CSV
            </Button>
        </Stack>
      </Box>

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Item Sales List (Last 30 Days)</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                      size="small"
                      placeholder="Search Product..."
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
                      <IconButton onClick={() => fetchSalesReport(true)} disabled={refreshing} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Product Name</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Variant</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Quantity Sold</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Total Weight</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredSales.length === 0 && !loading ? (
                          <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10, color: "#a3aed0", fontWeight: "600" }}>No sales data found.</TableCell></TableRow>
                      ) : (
                          filteredSales.map((item, index) => (
                              <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                          <Box sx={{ p: 1, borderRadius: "10px", bgcolor: "rgba(67, 24, 255, 0.05)" }}>
                                              <Inventory2Icon sx={{ color: "#4318ff", fontSize: 18 }} />
                                          </Box>
                                          <Typography variant="body2" fontWeight="800" color="#1b2559">{item.productName}</Typography>
                                      </Stack>
                                  </TableCell>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{item.variantSize}</TableCell>
                                  <TableCell>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                          <Typography variant="body2" fontWeight="900" color="#4318ff">{item.quantity}</Typography>
                                          <Typography variant="caption" color="#a3aed0" fontWeight="800">UNITS</Typography>
                                      </Box>
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3, color: "#a3aed0", fontWeight: "800" }}>
                                      {item.totalWeight}
                                  </TableCell>
                              </TableRow>
                          ))
                      )}
                  </TableBody>
              </Table>
          </TableContainer>
      </Paper>
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

export default ItemSaleReport;