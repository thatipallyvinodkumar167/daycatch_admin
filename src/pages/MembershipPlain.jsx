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
  Chip,
  Tooltip,
  Avatar,
  Divider,
  LinearProgress,
  Fade,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import StarsIcon from "@mui/icons-material/Stars";
import SpeedIcon from "@mui/icons-material/Speed";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const MembershipPlain = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlans = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("membership");
      const results = response.data.results || response.data || [];
      
      const processedPlans = results.map(plan => ({
        id: plan._id,
        name: plan.name || plan["Plan Name"] || "Unnamed Subscription",
        days: plan.days || plan["Plan Days"] || 0,
        price: plan.price || plan["Plan Price"] || 0,
        freeDelivery: plan.freeDelivery ?? plan["Free Delivery"] ?? false,
        instantDelivery: plan.instantDelivery ?? plan["Instant Delivery"] ?? false,
        rewards: plan.rewards || plan.Reward || 0,
        description: plan.description || plan.Description || "",
        image: plan.image || plan.Image || ""
      }));

      setPlans(processedPlans);

    } catch (error) {
      console.error("Error fetching membership plans:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to terminate this subscription model?")) {
      try {
        await genericApi.delete("membership", id);
        fetchPlans();
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const filteredPlans = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return plans;
    return plans.filter((plan) =>
      plan.name.toLowerCase().includes(q)
    );
  }, [plans, search]);

  const stats = useMemo(() => [
    { label: "Active Tiers", value: plans.length, icon: <CardMembershipIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Loyalty Nodes", value: "Verified", icon: <StarsIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [plans]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Subscription Matrix
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Design and manage high-velocity subscription tiers for Day Catch premium members.
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
            <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => navigate("/membership-plain/add")}
                sx={{ 
                    backgroundColor: "#4318ff", 
                    borderRadius: "14px",
                    textTransform: "none",
                    px: 3,
                    py: 1.2,
                    fontWeight: "800",
                    boxShadow: "0 10px 25px rgba(67, 24, 255, 0.2)",
                    "&:hover": { backgroundColor: "#3310cc" }
                }}
            >
                Initialize Plan
            </Button>
        </Stack>
      </Box>

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {(loading || refreshing) && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, bgcolor: "#f4f7fe", "& .MuiLinearProgress-bar": { bgcolor: "#4318ff" } }} />
          )}
          
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Membership Repository</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                      size="small"
                      placeholder="Search Subscription Tier..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      InputProps={{
                          startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#fff", width: "320px" } }}
                  />
                  <Tooltip title="Synchronize Repository">
                      <IconButton onClick={() => fetchPlans(true)} disabled={refreshing} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
                          <RefreshIcon sx={{ color: "#4318ff", fontSize: 20 }} className={refreshing ? "spin-animation" : ""} />
                      </IconButton>
                  </Tooltip>
              </Stack>
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Visual Identity</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Subscription Tier</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Validity Loop</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Premium Value</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Logistic Perks</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Loyalty Multiplier</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Operational Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredPlans.length === 0 && !loading ? (
                          <TableRow><TableCell colSpan={8} align="center" sx={{ py: 10, color: "#a3aed0", fontWeight: "800" }}>Zero subscription tiers detected in active repository.</TableCell></TableRow>
                      ) : (
                          filteredPlans.map((plan, index) => (
                              <TableRow key={plan.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Avatar src={plan.image} variant="rounded" sx={{ width: 44, height: 44, borderRadius: "12px", border: "1px solid #e0e5f2" }} />
                                  </TableCell>
                                  <TableCell>
                                      <Typography variant="body2" fontWeight="800" color="#1b2559">{plan.name}</Typography>
                                      <Typography variant="caption" color="#a3aed0" fontWeight="600" sx={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", maxWidth: 150 }}>
                                          {plan.description?.replace(/<[^>]*>/g, '')}
                                      </Typography>
                                  </TableCell>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>{plan.days} <Typography component="span" variant="caption" fontWeight="800" color="#a3aed0">DAYS</Typography></TableCell>
                                  <TableCell sx={{ color: "#4318ff", fontWeight: "900", fontSize: "15px" }}>RS {plan.price}</TableCell>
                                  <TableCell align="center">
                                      <Stack direction="row" spacing={1} justifyContent="center">
                                          <Tooltip title={plan.freeDelivery ? "Free Standard Protocol Active" : "Disabled"}>
                                              <Box sx={{ p: 0.5, borderRadius: "8px", bgcolor: plan.freeDelivery ? "rgba(0, 210, 106, 0.1)" : "rgba(163, 174, 208, 0.1)", color: plan.freeDelivery ? "#00d26a" : "#a3aed0" }}>
                                                  <LocalShippingIcon sx={{ fontSize: 16 }} />
                                              </Box>
                                          </Tooltip>
                                          <Tooltip title={plan.instantDelivery ? "Instant Velocity Protocol Active" : "Disabled"}>
                                              <Box sx={{ p: 0.5, borderRadius: "8px", bgcolor: plan.instantDelivery ? "rgba(67, 24, 255, 0.1)" : "rgba(163, 174, 208, 0.1)", color: plan.instantDelivery ? "#4318ff" : "#a3aed0" }}>
                                                  <SpeedIcon sx={{ fontSize: 16 }} />
                                              </Box>
                                          </Tooltip>
                                      </Stack>
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={`${plan.rewards}X Accumulator`} 
                                          size="small" 
                                          sx={{ fontWeight: "900", bgcolor: "rgba(67, 24, 255, 0.05)", color: "#4318ff", borderRadius: "10px", fontSize: "10px", border: "1px solid rgba(67, 24, 255, 0.1)" }} 
                                      />
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                      <Tooltip title="Modify Tier">
                                          <IconButton 
                                              onClick={() => navigate(`/membership-plain/edit/${plan.id}`)}
                                              sx={{ backgroundColor: "#00d26a", color: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 210, 106, 0.2)", "&:hover": { backgroundColor: "#00b85c" } }}
                                          >
                                              <EditIcon sx={{ fontSize: 18 }} />
                                          </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Terminate Tier">
                                          <IconButton 
                                              onClick={() => handleDelete(plan.id)}
                                              sx={{ backgroundColor: "#ff4d49", color: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(255, 77, 73, 0.2)", "&:hover": { backgroundColor: "#d32f2f" } }}
                                          >
                                              <DeleteIcon sx={{ fontSize: 18 }} />
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
      <style>
          {`
          @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
          }
          .spin-animation {
              animation: spin 1s linear infinite;
          }
          `}
      </style>
    </Box>
  );
};

export default MembershipPlain;