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
  Avatar,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Rewards = () => {
  const navigate = useNavigate();
  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem("daycatch_reward_rules");
    return saved ? JSON.parse(saved) : [];
  });
  const [search, setSearch] = useState("");
  const [newRule, setNewRule] = useState({ cartValue: "", points: "" });

  useEffect(() => {
    if (rewards.length === 0) {
      fetchRewards();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("daycatch_reward_rules", JSON.stringify(rewards));
  }, [rewards]);

  const fetchRewards = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts?_limit=8"
      );
      
      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        cartValue: 500 + (index * 250),
        rewardPoints: 10 + (index * 5),
      }));

      setRewards(formattedData);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

  const filteredRewards = rewards.filter((item) =>
    item.cartValue.toString().includes(search.trim()) ||
    item.rewardPoints.toString().includes(search.trim())
  );

  const handleAdd = () => {
    if (!newRule.cartValue || !newRule.points) return;
    const newItem = {
      id: Date.now(),
      cartValue: parseInt(newRule.cartValue),
      rewardPoints: parseInt(newRule.points),
    };
    setRewards([newItem, ...rewards]);
    setNewRule({ cartValue: "", points: "" });
    alert("Reward rule added!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this reward rule?")) {
      setRewards(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
            Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Configure reward points based on customer purchase amounts.
        </Typography>
      </Box>

      {/* Summary Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #4318ff", width: "fit-content" }}>
          <Avatar sx={{ bgcolor: "#e0e7ff", color: "#4318ff" }}>
              <CardGiftcardIcon />
          </Avatar>
          <Box>
              <Typography variant="caption" color="textSecondary" fontWeight="600">ACTIVE RULES</Typography>
              <Typography variant="h5" fontWeight="800" color="#1b2559">{rewards.length}</Typography>
          </Box>
      </Paper>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={4} alignItems="flex-start">
        {/* Add Rule Form */}
        <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", minWidth: "320px", width: { xs: "100%", lg: "auto" } }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            Add Reward Entry
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Cart Value (₹)</Typography>
              <TextField
                fullWidth
                placeholder="e.g. 500"
                value={newRule.cartValue}
                onChange={(e) => setNewRule({ ...newRule, cartValue: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Reward Points</Typography>
              <TextField
                fullWidth
                placeholder="e.g. 10"
                value={newRule.points}
                onChange={(e) => setNewRule({ ...newRule, points: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleAdd}
              sx={{
                backgroundColor: "#4318ff",
                "&:hover": { backgroundColor: "#3311cc" },
                borderRadius: "10px",
                py: 1.5,
                textTransform: "none",
                fontWeight: "700",
              }}
            >
              Submit
            </Button>
          </Stack>
        </Paper>

        {/* List */}
        <Paper sx={{ flex: 1, borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", width: "100%" }}>
          <Box 
            sx={{ 
              p: 3, 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              borderBottom: "1px solid #f1f1f1"
            }}
          >
            <Typography variant="h6" fontWeight="700" color="#1b2559">
              Reward Point Distribution
            </Typography>
            <TextField
              size="small"
              placeholder="Search by value or points..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ 
                "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                width: "280px"
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CART VALUE</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>REWARD POINTS</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRewards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      No reward rules found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRewards.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700", fontSize: "16px" }}>
                        ₹{item.cartValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                          <Chip 
                              label={`${item.rewardPoints} Points`}
                              sx={{ bgcolor: "#e6f9ed", color: "#24d164", fontWeight: "700", borderRadius: "8px" }}
                          />
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit Rule">
                              <IconButton 
                                  onClick={() => navigate(`/rewards-list/edit/${item.id}`)}
                                  sx={{ 
                                      backgroundColor: "#00d26a", 
                                      color: "#fff", 
                                      borderRadius: "10px",
                                      "&:hover": { backgroundColor: "#00b85c" }
                                  }}
                              >
                                  <EditIcon fontSize="small" />
                              </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Rule">
                              <IconButton 
                                  onClick={() => handleDelete(item.id)}
                                  sx={{ 
                                      backgroundColor: "#ff4d49", 
                                      color: "#fff", 
                                      borderRadius: "10px",
                                      "&:hover": { backgroundColor: "#e03e3e" }
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
      </Stack>
    </Box>
  );
};

export default Rewards;
