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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const RedeemValues = () => {
  const navigate = useNavigate();
  const [redeemValues, setRedeemValues] = useState([]);
  const [search, setSearch] = useState("");
  const [newRule, setNewRule] = useState({ points: "", value: "" });

  const fetchRedeemValues = useCallback(async () => {
    try {
      const response = await genericApi.getAll("reedm value");
      const results = response.data.results || response.data || [];
      const formattedData = results.map((item) => ({
        id: item._id,
        rewardPoints: item["Reward Points"] || item.rewardPoints || 0,
        redeemValue:
          item["Redeem Values"] || item["Redeem Value"] || item.redeemValue || 0,
      }));
      setRedeemValues(formattedData);
    } catch (error) {
      console.error("Error fetching redeem values:", error);
    } finally {
    }
  }, []);

  useEffect(() => {
    fetchRedeemValues();
  }, [fetchRedeemValues]);

  const filteredValues = redeemValues.filter((item) =>
    item.rewardPoints.toString().includes(search.trim()) ||
    item.redeemValue.toString().includes(search.trim())
  );

  const handleAdd = async () => {
    if (!newRule.points || !newRule.value) return;
    try {
      const payload = {
        "Reward Points": Number(newRule.points),
        "Redeem Values": Number(newRule.value),
      };
      await genericApi.create("reedm value", payload);
      alert("Redemption rule added!");
      setNewRule({ points: "", value: "" });
      fetchRedeemValues();
    } catch (error) {
      console.error("Error adding redeem value:", error);
      alert("Error adding redemption rule.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this redemption rule?")) {
      try {
        await genericApi.remove("reedm value", id);
        fetchRedeemValues();
      } catch (error) {
        console.error("Error deleting redeem value:", error);
        alert("Error deleting redemption rule.");
      }
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="700" color="#2b3674">
                Redemption Rules
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
                Set the cash conversion value for customer reward points.
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
            Create New Rule
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
              <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>Cash Value (₹)</Typography>
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
              Rule List
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
                  <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CASH VALUE</TableCell>
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
                              <IconButton className="action-edit" 
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
                              <IconButton className="action-delete" 
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



