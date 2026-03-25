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
  Avatar,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { genericApi } from "../../api/genericApi";

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [search, setSearch] = useState("");
  const [newRule, setNewRule] = useState({ cartValue: "", points: "" });

  const fetchRewards = useCallback(async () => {
    try {
      const response = await genericApi.getAll("rewards");
      const results = response.data.results || response.data || [];
      const formattedData = results.map((item) => ({
        id: item._id,
        cartValue: item["Cart Value"] || item.cartValue || 0,
        rewardPoints: item["Reward Points"] || item.rewardPoints || 0,
      }));
      setRewards(formattedData);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const filteredRewards = rewards.filter((item) =>
    item.cartValue.toString().includes(search.trim()) ||
    item.rewardPoints.toString().includes(search.trim())
  );

  const handleAdd = async () => {
    if (!newRule.cartValue || !newRule.points) return;
    try {
      const payload = {
        "Cart Value": Number(newRule.cartValue),
        "Reward Points": Number(newRule.points),
      };
      await genericApi.create("rewards", payload);
      alert("Reward rule added!");
      setNewRule({ cartValue: "", points: "" });
      fetchRewards();
    } catch (error) {
      console.error("Error adding reward:", error);
      alert("Error adding reward rule.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reward rule?")) {
      try {
        await genericApi.remove("rewards", id);
        fetchRewards();
      } catch (error) {
        console.error("Error deleting reward:", error);
        alert("Error deleting reward rule.");
      }
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
            Reward Rules
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Set up reward point distribution logic for customer purchases.
        </Typography>
      </Box>

      {/* Summary Card */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 2, borderLeft: "6px solid #4318ff", width: "fit-content" }}>
          <Avatar sx={{ bgcolor: "#e0e7ff", color: "#4318ff" }}>
              <CardGiftcardIcon />
          </Avatar>
          <Box>
              <Typography variant="caption" color="textSecondary" fontWeight="600">TOTAL RULES</Typography>
              <Typography variant="h5" fontWeight="800" color="#1b2559">{rewards.length}</Typography>
          </Box>
      </Paper>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={4} alignItems="flex-start">
        {/* Add Rule Form */}
        <Paper sx={{ p: 4, borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", minWidth: "320px", width: { xs: "100%", lg: "auto" } }}>
          <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
            Create New Rule
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

        {/* List Section */}
        <Paper sx={{ flex: 1, p: 4, borderRadius: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", width: "100%" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h6" fontWeight="800" color="#1b2559">Rule List</Typography>
            <TextField
              size="small"
              placeholder="Search by amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", backgroundColor: "#f4f7fe", "& fieldset": { border: "none" } }, width: "250px" }}
            />
          </Stack>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", py: 2, pl: 4, borderBottom: "1px solid #e0e5f2" }}>#</TableCell>
                  <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>CART VALUE (₹)</TableCell>
                  <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>REWARD POINTS</TableCell>
                  <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRewards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Typography variant="body2" color="textSecondary">No reward rules defined.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRewards.map((item, index) => (
                    <TableRow key={item.id} sx={{ "&:hover": { bgcolor: "#f9fafc" } }}>
                      <TableCell sx={{ color: "#a3aed0", fontWeight: "700", pl: 4 }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>₹{item.cartValue}</TableCell>
                      <TableCell>
                        <Chip label={`${item.rewardPoints} Points`} size="small" sx={{ bgcolor: "#eef2ff", color: "#4318ff", fontWeight: "800", borderRadius: "8px" }} />
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Delete Rule">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(item.id)}
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


