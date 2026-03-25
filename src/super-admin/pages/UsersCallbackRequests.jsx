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
  CircularProgress,
  Chip,
  Divider,
  LinearProgress
} from "@mui/material";
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Add as AddIcon,
  PhoneCallback as PhoneCallbackIcon,
  Done as DoneIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const UsersCallbackRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("usercallbackrequests");
      const results = response.results || response.data?.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        userName: item.userName || item["User Name"] || item.name || "Unknown node",
        userPhone: item.userPhone || item["User Phone"] || item.phone || item.mobile || "N/A",
        callbackTo: item.callbackTo || item["Callback To"] || item.department || "Protocol Support",
        status: item.status || "Pending",
        date: item.createdAt || item.date || item.Date || null
      }));

      setRequests(formattedData);
    } catch (error) {
      console.error("Critical: User Callback Registry Fetch Failure:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return requests;
    return requests.filter((item) =>
      item.userName?.toLowerCase().includes(query) ||
      item.userPhone?.toLowerCase().includes(query)
    );
  }, [requests, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Mark this callback request as resolved?")) {
      try {
        await genericApi.remove("usercallbackrequests", id);
        setRequests(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error decommissioning callback request:", error);
        alert("Action failed. Neural verification required.");
      }
    }
  };

  const stats = useMemo(() => [
    { label: "Active Requests", value: requests.length, icon: <PhoneCallbackIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Matrix Sync", value: "Real-time", icon: <HistoryIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [requests]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1.5px" }}>
                User Callback Requests
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage and respond to callback requests from customers.
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
            <Tooltip title="Refresh Feed">
                <IconButton 
                    onClick={() => fetchRequests(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => navigate("/user-callback-request/add")}
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

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          {/* Search Toolbar */}
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Pending Requests</Typography>
              <TextField
                  size="small"
                  placeholder="Search name or phone..."
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>CUSTOMER NAME</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>PHONE NUMBER</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>DEPARTMENT</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>STATUS</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>ACTIONS</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredRequests.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                  <Typography color="#a3aed0" fontWeight="600">No active callback requests found in the system.</Typography>
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredRequests.map((item, index) => (
                              <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>{item.userName}</TableCell>
                                  <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontFamily: "monospace" }}>{item.userPhone}</TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={item.callbackTo.toUpperCase()} 
                                          size="small" 
                                          sx={{ backgroundColor: "rgba(67, 24, 255, 0.08)", color: "#4318ff", fontWeight: "900", borderRadius: "8px", fontSize: "10px" }} 
                                      />
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={item.status.toUpperCase()} 
                                          size="small"
                                          sx={{ 
                                              backgroundColor: item.status === "Pending" ? "rgba(255, 77, 73, 0.1)" : "rgba(0, 210, 106, 0.1)", 
                                              color: item.status === "Pending" ? "#ff4d49" : "#00d26a", 
                                              fontWeight: "900",
                                              borderRadius: "8px",
                                              fontSize: "10px"
                                          }}
                                      />
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3 }}>
                                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                          <Tooltip title="View Request">
                                              <IconButton size="small" sx={{ color: "#4318ff", bgcolor: "#f4f7fe", borderRadius: "10px", "&:hover": { bgcolor: "#e0e5f2" } }}>
                                                  <VisibilityIcon fontSize="small" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Mark as Resolved">
                                              <IconButton 
                                                  onClick={() => handleDelete(item.id)}
                                                  sx={{ color: "#00d26a", bgcolor: "rgba(0, 210, 106, 0.05)", borderRadius: "10px", "&:hover": { bgcolor: "rgba(0, 210, 106, 0.1)" } }}
                                              >
                                                  <DoneIcon fontSize="small" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Edit Request">
                                              <IconButton className="action-edit" 
                                                  onClick={() => navigate(`/user-callback-request/edit/${item.id}`)}
                                                  sx={{ color: "#ffb547", bgcolor: "rgba(255, 181, 71, 0.05)", borderRadius: "10px", "&:hover": { bgcolor: "rgba(255, 181, 71, 0.1)" } }}
                                              >
                                                  <EditIcon fontSize="small" />
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

export default UsersCallbackRequests;



