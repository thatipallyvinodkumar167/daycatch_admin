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
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Button
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { genericApi } from "../api/genericApi";

const UsersFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("Userfeedback");
      const results = response.results || response.data?.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index,
        user: item.userName || item.name || item.user || item.email || "Unknown User",
        feedback: item.feedback || item.body || item.message || "No feedback content",
        date: item.createdAt || item.date || null
      }));

      setFeedbackList(formattedData);
    } catch (error) {
      console.error("Error fetching user feedback:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const filteredFeedback = React.useMemo(() => {
    return feedbackList.filter((item) =>
      item.user?.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.feedback?.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [feedbackList, search]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Consumer Sentiment
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Monitor and analyze direct feedback from your platform users.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh Feed">
                <IconButton 
                    onClick={fetchFeedback} 
                    disabled={loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {loading ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
        </Stack>
      </Box>

      <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
        
        {/* Search Toolbar */}
        <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
            <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Recent Feedback</Typography>
            <TextField
                size="small"
                placeholder="Search sentiment..."
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
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>Consumer Name</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px" }}>Sentiment & Message</TableCell>
                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pr: 4 }}>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <CircularProgress sx={{ color: "#4318ff" }} />
                  </TableCell>
                </TableRow>
              ) : filteredFeedback.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                    <Typography color="#a3aed0" fontWeight="600">No active feedback found in direct collections.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeedback.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700", pl: 4 }}>
                      #{index + 1}
                    </TableCell>
                    <TableCell sx={{ color: "#4318ff", fontWeight: "800" }}>
                      {item.user}
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500", maxWidth: "500px", lineHeight: 1.6 }}>
                      {item.feedback}
                    </TableCell>
                    <TableCell sx={{ color: "#a3aed0", fontWeight: "600", pr: 4 }}>
                      {item.date ? new Date(item.date).toLocaleDateString() : "Live Feed"}
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

export default UsersFeedback;
