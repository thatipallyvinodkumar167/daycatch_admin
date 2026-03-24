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
  LinearProgress,
  Avatar,
  Tooltip,
  Collapse,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import HistoryIcon from "@mui/icons-material/History";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const StoresList = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("storeList");
      const results = response.data.results || response.data || [];
      
      const normalizedList = results.map((store, index) => ({
        id: store._id || index,
        name: store["Store Name"] || store.name || "Unnamed Store",
        email: store.Email || store.email || "N/A",
        phone: store.Mobile || store.phone || "N/A",
        city: store.City || store.city || "N/A",
        orders: store.orders || store.Orders || 0,
        status: store.status || "Active",
        logo: store["Profile Pic"] || store.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(store["Store Name"] || store.name || "S")}&background=4318ff&color=fff`,
        address: store.address || "N/A",
      }));

      setStores(normalizedList);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = React.useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return stores;
    return stores.filter((item) => {
      return (item.name || "").toLowerCase().includes(s) || (item.phone || "").toLowerCase().includes(s);
    });
  }, [stores, search]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleStatus = async (item) => {
    try {
      const newStatus = (item.status || "").toLowerCase() === "active" ? "Inactive" : "Active";
      await genericApi.update("storeList", item.id, { status: newStatus });
      fetchStores();
    } catch (error) {}
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete store "${name}"?`)) {
      try {
        await genericApi.remove("storeList", id);
        fetchStores();
        alert("Store deleted successfully!");
      } catch (error) {
        alert("Failed to delete store.");
      }
    }
  };

  const handleDownloadCSV = () => {
    if (filteredStores.length === 0) {
      alert("No data available to download.");
      return;
    }
    const headers = ["Store Name", "Email", "Mobile", "City", "Total Orders", "Address"];
    const csvRows = [headers.join(",")];
    filteredStores.forEach(s => {
      const row = [
        `"${String(s.name || "").replace(/"/g, '""')}"`,
        `"${String(s.email || "").replace(/"/g, '""')}"`,
        `"${String(s.phone || "").replace(/"/g, '""')}"`,
        `"${String(s.city || "").replace(/"/g, '""')}"`,
        s.orders || 0,
        `"${String(s.address || "").replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Store_List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Store List
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
            Manage and monitor your partner stores.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/stores/add")}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#4318ff",
            "&:hover": { backgroundColor: "#3311cc" },
            borderRadius: "16px",
            textTransform: "none",
            px: 4,
            py: 1.8,
            fontWeight: "800",
            boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)",
          }}
        >
          Add Store
        </Button>
      </Box>

      {/* Stats Section */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, backgroundColor: "#fff" }}>
          <Avatar sx={{ bgcolor: "#eef2ff", color: "#4318ff", width: 56, height: 56 }}>
            <StorefrontIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>TOTAL STORES</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">{stores.length}</Typography>
          </Box>
        </Paper>
        <Paper sx={{ p: 3, flex: 1, borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, backgroundColor: "#fff" }}>
          <Avatar sx={{ bgcolor: "#e6f9ed", color: "#24d164", width: 56, height: 56 }}>
            <CheckCircleIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>ACTIVE STORES</Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              {stores.filter(s => s.status.toLowerCase() === "active").length}
            </Typography>
          </Box>
        </Paper>
      </Stack>

      {/* Utility Bar */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
        <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
            <TextField
                size="small"
                placeholder="Search by store name, mobile..."
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
            <Tooltip title="Print List">
                <IconButton onClick={() => window.print()} sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
                    <PrintIcon sx={{ color: "#2b3674" }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Download CSV">
                <IconButton onClick={handleDownloadCSV} sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}>
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
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>STORE</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>CITY</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>CONTACT</TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>TOTAL ORDERS</TableCell>
                <TableCell align="center" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>DETAILS</TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No stores found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStores.map((item, index) => {
                  const isBlocked = (item.status || "").toLowerCase() === "inactive" || (item.status || "").toLowerCase() === "blocked";
                  const isExpanded = expandedRow === item.id;

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
                          <Avatar 
                            src={item.logo} 
                            sx={{ 
                              width: 44, 
                              height: 44, 
                              borderRadius: "14px", 
                              border: "2px solid #e0e5f2",
                              bgcolor: "#f4f7fe",
                              color: "#4318ff",
                              fontWeight: "800",
                              fontSize: "14px",
                            }}
                          >
                            {(item.name || "S")[0].toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" fontWeight="800" color="#1b2559">
                            {item.name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#475467">
                          {item.city}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="700" color="#1b2559">{item.phone}</Typography>
                          <Typography variant="caption" color="#a3aed0" fontWeight="600">{item.email}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box 
                          onClick={() => navigate(`/all-orders?storeId=${item.id}`)}
                          sx={{ 
                            display: "inline-flex", 
                            alignItems: "center", 
                            gap: 1,
                            bgcolor: "#f4f7fe", 
                            px: 2, 
                            py: 0.8, 
                            borderRadius: "12px",
                            border: "1px solid #e0e5f2",
                            cursor: "pointer",
                            "&:hover": { bgcolor: "#eef2ff", borderColor: "#4318ff" },
                            transition: "0.2s"
                          }}>
                          <Typography fontWeight="900" color="#4318ff" variant="subtitle2">
                            {item.orders ?? 0} <span style={{ color: "#a3aed0", fontSize: "10px", fontWeight: "600" }}>ORDERS</span>
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/stores/details/${item.id}`)}
                          sx={{
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: "700",
                            borderColor: "#e0e5f2",
                            color: "#1b2559",
                            "&:hover": { borderColor: "#4318ff", backgroundColor: "#eef2ff" }
                          }}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit Store">
                                <IconButton
                                    size="small"
                                    onClick={() => navigate(`/stores/edit/${item.id}`)}
                                    sx={{
                                        color: "#fff",
                                        bgcolor: "#24d164",
                                        borderRadius: "10px",
                                        width: "32px",
                                        height: "32px",
                                        "&:hover": { bgcolor: "#1fb355", transform: "translateY(-1px)" },
                                        transition: "0.2s"
                                    }}
                                >
                                    <EditIcon sx={{ fontSize: "16px" }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={isBlocked ? "Unblock Store" : "Block Store"}>
                                <IconButton
                                    size="small"
                                    onClick={() => toggleStatus(item)}
                                    sx={{
                                        color: "#fff",
                                        bgcolor: "#ffb800",
                                        borderRadius: "10px",
                                        width: "32px",
                                        height: "32px",
                                        "&:hover": { bgcolor: "#e6a600", transform: "translateY(-1px)" },
                                        transition: "0.2s"
                                    }}
                                >
                                    {isBlocked ? <LockOpenIcon sx={{ fontSize: "16px" }} /> : <LockIcon sx={{ fontSize: "16px" }} />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Store">
                                <IconButton
                                    size="small"
                                    onClick={() => handleDelete(item.id, item.name)}
                                    sx={{
                                        color: "#fff",
                                        bgcolor: "#ff4d49",
                                        borderRadius: "10px",
                                        width: "32px",
                                        height: "32px",
                                        "&:hover": { bgcolor: "#e03e3a", transform: "translateY(-1px)" },
                                        transition: "0.2s"
                                    }}
                                >
                                    <DeleteIcon sx={{ fontSize: "16px" }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>

                    {/* Expandable Content */}
                    <TableRow>
                        <TableCell colSpan={7} sx={{ py: 0, borderBottom: isExpanded ? "1px solid #e0e5f2" : "none" }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Box sx={{ p: 4, backgroundColor: "#fafbfc" }}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">STORE OVERVIEW</Typography>
                                            <Typography variant="body2" color="#a3aed0">This store is part of your partner network. You can manage their settings, earnings, and performance metrics from the detailed dashboard.</Typography>
                                        </Grid>
                                        <Grid item xs={12} md={8}>
                                            <Stack direction="row" spacing={3}>
                                                <Paper sx={{ p: 2, flex: 1, borderRadius: "16px", border: "1px dashed #e0e5f2", textAlign: 'center' }}>
                                                    <Typography variant="caption" color="#a3aed0" fontWeight="700">ADDRESS</Typography>
                                                    <Typography variant="body2" fontWeight="800" color="#1b2559">{item.address}</Typography>
                                                </Paper>
                                                <Paper sx={{ p: 2, flex: 1, borderRadius: "16px", border: "1px dashed #e0e5f2", textAlign: 'center' }}>
                                                  <Button 
                                                    startIcon={<HistoryIcon />} 
                                                    onClick={() => navigate("/store-earnings")}
                                                    sx={{ 
                                                        textTransform: 'none', 
                                                        fontWeight: 800, 
                                                        color: '#4318ff',
                                                        "&:hover": { bgcolor: "rgba(67, 24, 255, 0.05)" }
                                                    }}
                                                  >
                                                    View Earnings
                                                  </Button>
                                                </Paper>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

// Help Grid component for expandable row - CLONED FROM DELIVERYBOY
const Grid = ({ children, container, item, xs, md, spacing }) => {
    return <Box sx={{ 
        display: container ? 'flex' : 'block', 
        flexWrap: 'wrap', 
        width: item ? (xs ? `${(xs/12)*100}%` : 'auto') : '100%',
        p: spacing ? spacing : 0,
        ...(md && { width: { md: `${(md/12)*100}%` } })
    }}>{children}</Box>
}

export default StoresList;