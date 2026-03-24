import React, { useEffect, useState, useCallback } from "react";
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
  CircularProgress,
  Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const StoresCallbackRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("storecallbackrequests");
      const results = response.results || response.data?.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index,
        storeName: item.storeName || item["Store Name"] || item.store || item.company?.name || item.name || "Unknown Store",
        storePhone: item.storePhone || item["Store Phone"] || item.phone || item.mobile || "N/A",
        status: item.status || "Pending Support",
        date: item.createdAt || item.date || item.Date || null
      }));

      setRequests(formattedData);
    } catch (error) {
      console.error("Error fetching store callback requests:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = React.useMemo(() => {
    return requests.filter((item) =>
      item.storeName?.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.storePhone?.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [requests, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Mark this callback request as resolved?")) {
      try {
        await genericApi.remove("storecallbackrequests", id);
        setRequests(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting callback:", error);
        alert("Failed to close request channel.");
      }
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Store Callback Requests
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage callback requests from stores.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh Feed">
                <IconButton 
                    onClick={fetchRequests} 
                    disabled={loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {loading ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => navigate("/store-callback-request/add")}
                sx={{ 
                    backgroundColor: "#4318ff", 
                    "&:hover": { backgroundColor: "#3311cc" },
                    borderRadius: "14px",
                    textTransform: "none",
                    px: 4,
                    fontWeight: "800",
                    boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                }}
            >
                Add Request
            </Button>
        </Stack>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
        
        {/* Search Toolbar */}
        <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
            <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Callback Requests</Typography>
            <TextField
                size="small"
                placeholder="Search store or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                }}
                sx={{ 
                    "& .MuiOutlinedInput-root": { 
                        borderRadius: "12px", 
                        backgroundColor: "#fff",
                        width: "320px"
                    } 
                }}
            />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f4f7fe" }}>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pl: 4 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>STORE NAME</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>PHONE NUMBER</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress sx={{ color: "#4318ff" }} />
                  </TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Typography color="#a3aed0" fontWeight="600">No callback requests found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", pl: 4 }}>
                      #{index + 1}
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>
                      {item.storeName}
                    </TableCell>
                    <TableCell sx={{ color: "#4318ff", fontWeight: "700" }}>
                      {item.storePhone}
                    </TableCell>
                    <TableCell>
                        <Chip 
                            label={item.status} 
                            size="small"
                            sx={{ 
                                bgcolor: "#fff5f5",
                                color: "#ff4d49",
                                fontWeight: "800",
                                borderRadius: "8px"
                            }}
                        />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton 
                            onClick={() => navigate(`/store-callback-request/edit/${item.id}`)}
                            sx={{ 
                                backgroundColor: "#f4f7fe", 
                                color: "#4318ff",
                                borderRadius: "10px",
                                "&:hover": { backgroundColor: "#e0e5f2" },
                                p: 1
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleDelete(item.id)}
                            sx={{ 
                                borderColor: "#ff4d49", 
                                color: "#ff4d49",
                                borderRadius: "10px",
                                textTransform: "none",
                                fontWeight: "800",
                                "&:hover": { borderColor: "#e03e3a", bgcolor: "#fff5f5" },
                            }}
                        >
                            Complete
                        </Button>
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

export default StoresCallbackRequests;
