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
  Stack,
  Tooltip,
  Divider,
  LinearProgress,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RefreshIcon from "@mui/icons-material/Refresh";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { genericApi } from "../api/genericApi";

const TaxReports = () => {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchTaxReports = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("tax_report");
      const results = response.data.results || response.data || [];
      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        productName: item["Product Name"] || item.productName || "Unknown Asset",
        quantity: item["Quantity"] || item.quantity || "0",
      }));
      setReports(formattedData);
    } catch (error) {
      console.error("Error fetching tax reports:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTaxReports();
  }, [fetchTaxReports, selectedDate]);

  const filteredReports = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return reports;
    return reports.filter((report) =>
      report.productName.toLowerCase().includes(q)
    );
  }, [reports, search]);

  const stats = useMemo(() => [
    { label: "Taxed Assets", value: reports.length, icon: <AssessmentIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Audit Node", value: "Verified", icon: <ReceiptIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [reports]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Fiscal Audit Console
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Auditing item-wise tax manifest and fiscal quantities for administrative records.
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
            <Box>
                <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ textTransform: "uppercase", display: "block", lineHeight: 1 }}>INTERVAL</Typography>
                <TextField
                    type="date"
                    size="small"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    sx={{ 
                        "& .MuiOutlinedInput-root": { 
                            borderRadius: "10px", 
                            backgroundColor: "white", 
                            height: "32px",
                            fontSize: "12px",
                            "& fieldset": { borderColor: "#e0e5f2" } 
                        },
                        width: "160px"
                    }}
                />
            </Box>
        </Stack>
      </Box>

      {/* Full Width Audit Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Product Fiscal Ledger</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                      size="small"
                      placeholder="Search Fiscal Asset..."
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
                  <Tooltip title="Synchronize Audit">
                      <IconButton onClick={() => fetchTaxReports(true)} disabled={refreshing} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Product Fiscal Identity</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Node Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Fiscal Quantity Protocol</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredReports.length === 0 && !loading ? (
                          <TableRow>
                              <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                  <Box sx={{ opacity: 0.1, mb: 1 }}>
                                      <EventNoteIcon sx={{ fontSize: 60, color: "#4318ff" }} />
                                  </Box>
                                  <Typography variant="subtitle1" fontWeight="800" color="#a3aed0">Zero manifest data found for the selected interval.</Typography>
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredReports.map((report, index) => (
                              <TableRow key={report.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                          <Box sx={{ p: 1, borderRadius: "10px", bgcolor: "rgba(0, 210, 106, 0.05)" }}>
                                              <ReceiptIcon sx={{ color: "#00d26a", fontSize: 18 }} />
                                          </Box>
                                          <Typography variant="body2" fontWeight="800" color="#1b2559">{report.productName}</Typography>
                                      </Stack>
                                  </TableCell>
                                  <TableCell>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#00d26a" }} />
                                          <Typography variant="caption" fontWeight="800" color="#00d26a">AUDITED</Typography>
                                      </Box>
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3, color: "#4318ff", fontWeight: "900" }}>
                                      {report.quantity}
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

export default TaxReports;