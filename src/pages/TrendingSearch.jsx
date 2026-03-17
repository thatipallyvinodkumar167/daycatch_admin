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
  Tooltip,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import axios from "axios";

const TrendingSearch = () => {
  const [trending, setTrending] = useState([]);
  const [search, setSearch] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  // API Call (using JSONPlaceholder as fakeapi)
  useEffect(() => {
    fetchTrendingKeywords();
  }, []);

  const fetchTrendingKeywords = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts?_limit=10"
      );
      
      // Map fake data to trending keywords
      const keywords = ["Organic Milk", "Farm Fresh Eggs", "Local Honey", "Hybrid Tomatoes", "Cold Pressed Oil", "A2 Ghee", "Basmati Rice", "Sugarfree Dates", "Green Tea", "Himalayan Salt"];
      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        keyword: keywords[index % keywords.length],
        searchCount: Math.floor(Math.random() * 5000) + 100,
        lastUpdated: "2024-03-16"
      }));

      setTrending(formattedData);
    } catch (error) {
      console.error("Error fetching trending keywords:", error);
    }
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return;
    const newItem = {
        id: Date.now(),
        keyword: newKeyword.trim(),
        searchCount: 0,
        lastUpdated: new Date().toISOString().split('T')[0]
    };
    setTrending([newItem, ...trending]);
    setNewKeyword("");
    alert("Trending keyword added!");
  };

  const handleDelete = (id) => {
    setTrending(prev => prev.filter(item => item.id !== id));
  };

  const filtered = trending.filter(item => 
    item.keyword.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Manage trending search keywords displayed to users.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Add New Keyword Section */}
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
                    Add Trending Keyword
                </Typography>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Keyword</Typography>
                        <TextField
                            fullWidth
                            placeholder="e.g. Organic Milk"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                        />
                    </Box>
                    <Button 
                        variant="contained" 
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={handleAddKeyword}
                        sx={{ 
                            backgroundColor: "#2d60ff", 
                            "&:hover": { backgroundColor: "#2046cc" },
                            borderRadius: "10px",
                            py: 1.5,
                            textTransform: "none",
                            fontWeight: "700"
                        }}
                    >
                        Save Keyword
                    </Button>
                </Stack>
            </Paper>
        </Grid>

        {/* List Section */}
        <Grid item xs={12} md={8}>
            <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
                    <Typography variant="h6" fontWeight="600" color="#1b2559">Trending Keywords</Typography>
                    <TextField
                        size="small"
                        placeholder="Search keywords..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "240px" }}
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Keyword</TableCell>
                                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Search Count</TableCell>
                                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Last Updated</TableCell>
                                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>No keywords found</TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((item, index) => (
                                    <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                                        <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <TrendingUpIcon sx={{ color: "#2d60ff", fontSize: "1.2rem" }} />
                                                <Typography variant="body2" fontWeight="700" color="#1b2559">{item.keyword}</Typography>
                                            </Stack>
                                        </TableCell>
                                        <TableCell sx={{ color: "#475467", fontWeight: "600" }}>{item.searchCount.toLocaleString()}</TableCell>
                                        <TableCell sx={{ color: "#475467" }}>{item.lastUpdated}</TableCell>
                                        <TableCell align="right" sx={{ pr: 3 }}>
                                            <Tooltip title="Delete">
                                                <IconButton 
                                                    onClick={() => handleDelete(item.id)}
                                                    sx={{ 
                                                        backgroundColor: "#fff1f0", 
                                                        color: "#ff4d49", 
                                                        borderRadius: "8px",
                                                        "&:hover": { backgroundColor: "#ffccc7" }
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
