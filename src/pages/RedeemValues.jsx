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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RedeemValues = () => {
  const navigate = useNavigate();
  const [redeemValues, setRedeemValues] = useState([]);
  const [search, setSearch] = useState("");
  const [newRule, setNewRule] = useState({ points: "", value: "" });

  useEffect(() => {
    fetchRedeemValues();
  }, []);

  useEffect(() => {
    if (redeemValues.length > 0) {
      localStorage.setItem("daycatch_redeem_values_v2", JSON.stringify(redeemValues));
    }
  }, [redeemValues]);

  const fetchRedeemValues = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts?_limit=6"
      );
      
      const formattedData = response.data.map((item, index) => {
        const points = (index + 1) * 10;
        return {
          id: item.id,
          rewardPoints: points,
          redeemValue: points * 0.5,
        };
      });

      // Merge any user-added entries (from localStorage) on top
      const saved = localStorage.getItem("daycatch_redeem_values_v2");
      const savedEntries = saved ? JSON.parse(saved) : [];
      // savedEntries that are NOT in the mock data (user-added have Date.now() IDs > 100)
      const userAdded = savedEntries.filter(e => e.id > 100);
      setRedeemValues([...userAdded, ...formattedData]);
    } catch (error) {
      console.error("Error fetching redeem values:", error);
    }
  };

  const filteredValues = redeemValues.filter((item) =>
    item.rewardPoints.toString().includes(search.trim()) ||
    item.redeemValue.toString().includes(search.trim())
  );

  const handleAdd = () => {
    if (!newRule.points || !newRule.value) return;
    const newItem = {
      id: Date.now(),
      rewardPoints: parseInt(newRule.points),
      redeemValue: parseFloat(newRule.value),
    };
    setRedeemValues([newItem, ...redeemValues]);
    setNewRule({ points: "", value: "" });
    alert("Redemption rule added!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this redemption rule?")) {
      setRedeemValues(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Hi, Day Catch Super Admin Panel.
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Define the monetary value of reward points for customer redemptions.
            </Typography>
        </Box>
      </Box>

      {/* Conversion Rate Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #2d60ff", width: "fit-content" }}>
          <Avatar sx={{ bgcolor: "#e0e7ff", color: "#2d60ff" }}>
              <PaymentsIcon />
          </Avatar>
          <Box>
              <Typography variant="caption" color="textSecondary" fontWeight="600">STANDARD CONVERSION</Typography>
              <Typography variant="h5" fontWeight="800" color="#1b2559">10 Points = ₹ 5.00</Typography>
          </Box>
      </Paper>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={4} alignItems="flex-start">
        {/* Add Rule Form */}
        <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", minWidth: "320px", width: { xs: "100%", lg: "auto" } }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            Add Redeem Entry
          </Typography>
          <Stack spacing={3}>
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
            <Box>
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Redeem Value (₹)</Typography>
              <TextField
                fullWidth
                placeholder="e.g. 5.00"
                value={newRule.value}
                onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>
            <Button
              variant="contained"
              fullWidth
              onClick={handleAdd}
              sx={{
                backgroundColor: "#2d60ff",
                "&:hover": { backgroundColor: "#2046cc" },
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
              Redemption Configuration
            </Typography>
            <TextField
              size="small"
              placeholder="Search by points or value..."
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
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>REWARD POINTS</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>EQUIVALENT CASH VALUE</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredValues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      No redemption rules found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredValues.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#2d60ff", fontWeight: "800", fontSize: "16px" }}>
                        {item.rewardPoints} Pts
                      </TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700", fontSize: "16px" }}>
                        ₹{item.redeemValue.toLocaleString()}
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit Value">
                              <IconButton 
                                   onClick={() => navigate(`/redeem-value/edit/${item.id}`)}
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
                          <Tooltip title="Delete Value">
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

export default RedeemValues;
