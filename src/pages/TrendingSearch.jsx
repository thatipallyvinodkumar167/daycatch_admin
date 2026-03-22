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
  Grid,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import LayersIcon from "@mui/icons-material/Layers";
import { genericApi } from "../api/genericApi";

const TrendingSearch = () => {
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrendingKeywords = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("trending_search");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index + 1,
        keyword: item.Keyword || item.keyword || "Unnamed",
        searchCount: Number(item["Search Count"] || item.searchCount || 0),
        lastUpdated: item["Last Updated"] ? new Date(item["Last Updated"]).toLocaleDateString() : "N/A"
      }));

      setTrending(formattedData);
    } catch (error) {
      console.error("Error fetching trending keywords:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingKeywords();
  }, [fetchTrendingKeywords]);

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;
    try {
      const payload = {
        Keyword: newKeyword.trim(),
        "Search Count": 0,
        "Last Updated": new Date().toISOString()
      };
      await genericApi.create("trending_search", payload);
      setNewKeyword("");
      fetchTrendingKeywords();
    } catch (error) {
      console.error("Error adding keyword:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Permanently de-list this trending metric?")) {
      try {
        await genericApi.delete("trending_search", id);
        fetchTrendingKeywords();
      } catch (error) {
        console.error("Error deleting keyword:", error);
      }
    }
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return trending;
    return trending.filter(item => 
      item.keyword.toLowerCase().includes(query)
    );
  }, [trending, search]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Trend Analytics Board
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Auditing high-frequency search metrics displayed across the consumer interface.
            </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
            <Tooltip title="Refresh Metrics">
                <IconButton 
                    onClick={() => fetchTrendingKeywords(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
        </Stack>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        
        {/* Metric Registration Module */}
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
                <Typography variant="h6" fontWeight="800" color="#1b2559" sx={{ mb: 3 }}>
                    Register Metric
                </Typography>
                <Stack spacing={4}>
                    <Box>
                        <Typography variant="caption" fontWeight="800" color="#1b2559" sx={{ mb: 1, display: "block", ml: 0.5 }}>SEARCH KEYWORD</Typography>
                        <TextField
                            fullWidth
                            placeholder="e.g. Artisanal Seafood"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#f4f7fe", border: "none" }, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                        />
                    </Box>
                    <Button 
                        variant="contained" 
                        fullWidth
                        onClick={handleAddKeyword}
                        sx={{ 
                            backgroundColor: "#4318ff", 
                            "&:hover": { backgroundColor: "#3311cc" },
                            borderRadius: "16px",
                            py: 2,
                            textTransform: "none",
                            fontWeight: "800",
                            boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                        }}
                    >
                        Activate Metric
                    </Button>
                </Stack>
            </Paper>

            {/* Total Metrics Insight */}
            <Paper sx={{ p: 3, mt: 3, borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", border: "1px solid #e0e5f2", bgcolor: "#fff" }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: "#f4f7fe" }}>
                        <LayersIcon sx={{ color: "#4318ff" }} />
                    </Box>
                    <Box>
                        <Typography variant="caption" color="#a3aed0" fontWeight="800">ACTIVE POOL</Typography>
                        <Typography variant="h6" fontWeight="800" color="#1b2559">{trending.length} Keywords</Typography>
                    </Box>
                </Stack>
            </Paper>
        </Grid>

        {/* Analytics Registry Module */}
        <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff" }}>
                
                {/* Search Toolbar */}
                <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
                    <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Keyword Registry</Typography>
                    <TextField
                        size="small"
                        placeholder="Search metrics..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                        }}
                        sx={{ 
                            "& .MuiOutlinedInput-root": { 
                                borderRadius: "12px", 
                                backgroundColor: "#fff",
                                width: "240px"
                            } 
                        }}
                    />
                </Box>

                <TableContainer sx={{ 
                  maxHeight: "calc(100vh - 400px)",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" }
                }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pl: 4, bgcolor: "#f4f7fe" }}>#</TableCell>
                                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Keyword Strategy</TableCell>
                                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Frequency</TableCell>
                                <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", bgcolor: "#f4f7fe" }}>Last Sync</TableCell>
                                <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "12px", pr: 4, bgcolor: "#f4f7fe" }}>Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading && trending.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        <CircularProgress sx={{ color: "#4318ff" }} />
                                    </TableCell>
                                </TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        <Typography color="#a3aed0" fontWeight="600">No active metrics identified in the registry.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((item, index) => (
                                    <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                        <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Box sx={{ p: 1, borderRadius: "10px", backgroundColor: "rgba(67, 24, 255, 0.05)" }}>
                                                    <TrendingUpIcon sx={{ color: "#4318ff", fontSize: "1rem" }} />
                                                </Box>
                                                <Typography variant="body2" fontWeight="800" color="#1b2559">{item.keyword}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="900" color="#1b2559">{item.searchCount.toLocaleString()}</Typography>
                                            <Typography variant="caption" color="#a3aed0" fontWeight="700">Unique Hits</Typography>
                                        </TableCell>
                                        <TableCell sx={{ color: "#a3aed0", fontWeight: "700" }}>{item.lastUpdated}</TableCell>
                                        <TableCell align="right" sx={{ pr: 3 }}>
                                            <Tooltip title="De-list Metric">
                                                <IconButton 
                                                    onClick={() => handleDelete(item.id)}
                                                    sx={{ 
                                                        backgroundColor: "#fff5f5", 
                                                        color: "#ff4d49", 
                                                        borderRadius: "10px",
                                                        "&:hover": { backgroundColor: "#ffebeb" }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default TrendingSearch;
