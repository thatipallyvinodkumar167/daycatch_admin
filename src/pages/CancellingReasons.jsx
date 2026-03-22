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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const CancellingReasons = () => {
  const navigate = useNavigate();
  const [reasons, setReasons] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReasons = useCallback(async () => {
    setLoading(true);
    try {
      // Real-time API Sync (Replaces fake JSONPlaceholder data)
      const response = await genericApi.getAll("cancelling reason");
      const results = response.results || response.data?.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index,
        reason: item.reason || item.title || item.name || "Undefined Reason"
      }));

      setReasons(formattedData);
    } catch (error) {
      console.error("Error fetching cancellation reasons:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReasons();
  }, [fetchReasons]);

  const filteredReasons = reasons.filter((item) =>
    item.reason?.toLowerCase().includes(search.toLowerCase().trim())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Permanently remove this cancellation reason from the platform?")) {
      try {
        await genericApi.remove("cancelling reason", id);
        setReasons(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Platform Sync Error: Navigation rejected.");
      }
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Operational Cancel Logic
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage pre-defined reasons for order cancellations by consumers and delivery fleet.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Force Refresh">
                <IconButton 
                    onClick={fetchReasons} 
                    disabled={loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {loading ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => navigate("/cancelling-reasons/add")}
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
                Define New Reason
            </Button>
        </Stack>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
        
        {/* Search Toolbar */}
        <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
            <Typography variant="subtitle1" fontWeight="800" color="#1b2559">System Cancel Reasons</Typography>
            <TextField
                size="small"
                placeholder="Search logic..."
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
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pl: 4 }}>#</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>Reason Narrative</TableCell>
                <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pr: 4 }}>Control Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <CircularProgress sx={{ color: "#4318ff" }} />
                  </TableCell>
                </TableRow>
              ) : filteredReasons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <Typography color="#a3aed0" fontWeight="600">No cancellation reasons defined in the core logic.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReasons.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", pl: 4 }}>
                      #{index + 1}
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "800", fontSize: "15px" }}>
                      {item.reason}
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Narrative">
                            <IconButton 
                                onClick={() => navigate(`/cancelling-reasons/edit/${item.id}`)}
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
                        </Tooltip>
                        <Tooltip title="Deactivate">
                            <IconButton 
                                onClick={() => handleDelete(item.id)}
                                sx={{ 
                                    backgroundColor: "#fff5f5", 
                                    color: "#ff4d49",
                                    borderRadius: "10px",
                                    "&:hover": { backgroundColor: "#ffebeb" },
                                    p: 1
                                }}
                            >
                                <DeleteIcon fontSize="small" />
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

export default CancellingReasons;
