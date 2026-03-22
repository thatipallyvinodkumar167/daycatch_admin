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
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  CircularProgress
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Storefront as StorefrontIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VerifiedUser as VerifiedUserIcon
} from "@mui/icons-material";
import { genericApi } from "../api/genericApi";

const StoreApproval = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendingStores = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("storeList");
      const results = response.data?.results || response.data || [];

      // Show only stores with status Pending
      const pendingStores = results.filter(store =>
        (store.status || "").toLowerCase() === "pending"
      );

      const formattedData = pendingStores.map((store, index) => ({
        id: store._id || index + 1,
        storeName: store["Store Name"] || store.name || "Unknown Entity",
        city: store.City || store.city || "Registry Not Set",
        mobile: store.Mobile || store.phone || "N/A",
        email: store.Email || store.email || "N/A",
        adminShare: store["admin share"] || store["Admin Share"] || "0%",
        ownerName: store["Employee Name"] || store["owner name"] || store.ownerName || "Anonymous Owner",
        status: store.status || "Pending",
        logo: store["Profile Pic"] || store.logo ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(store["Store Name"] || store.name || "S")}&background=4318ff&color=fff`
      }));

      setStores(formattedData);
    } catch (error) {
      console.error("Critical: Merchant Approval Registry Fetch Failure:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingStores();
  }, [fetchPendingStores]);

  const handleApprove = async (id) => {
    if (window.confirm("Authorize this merchant node to start platform operations?")) {
      try {
        await genericApi.update("storeList", id, { status: "Active" });
        setStores(prev => prev.filter(s => s.id !== id));
        alert("Merchant node authorized successfully!");
      } catch (error) {
        console.error(error);
        alert("Authorization failed. Tactical review required.");
      }
    }
  };

  const filteredStores = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return stores;
    return stores.filter((store) =>
      store.storeName.toLowerCase().includes(query) ||
      store.ownerName.toLowerCase().includes(query)
    );
  }, [stores, search]);

  const stats = useMemo(() => [
    { label: "Pending Entities", value: stores.length, icon: <StorefrontIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Audit Level", value: "Level 1 Verified", icon: <VerifiedUserIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [stores]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1.5px" }}>
                Merchant Access Approval
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Auditing inbound merchant enrollment requests for platform inclusion.
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
            <Tooltip title="Synchronize Queue">
                <IconButton 
                    onClick={() => fetchPendingStores(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
        </Stack>
      </Box>

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          {/* Search Toolbar */}
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Merchant Enrollment Queue</Typography>
              <TextField
                  size="small"
                  placeholder="ID or Entity Identity..."
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Entity Profile</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Communication Hub</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Governance</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Administrative Agent</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Tactical Action</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredStores.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                  <Typography color="#a3aed0" fontWeight="600">No pending merchant enrollments identified in the registry.</Typography>
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredStores.map((store, index) => (
                              <TableRow key={store.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                          <Avatar src={store.logo} sx={{ width: 44, height: 44, borderRadius: "14px", border: "2px solid #f4f7fe" }} />
                                          <Box>
                                              <Typography variant="body2" fontWeight="800" color="#1b2559" noWrap sx={{ maxWidth: 160 }}>{store.storeName}</Typography>
                                              <Typography variant="caption" color="#a3aed0" fontWeight="700">{store.city}</Typography>
                                          </Box>
                                      </Stack>
                                  </TableCell>
                                  <TableCell>
                                      <Typography variant="body2" color="#1b2559" fontWeight="800">{store.mobile}</Typography>
                                      <Typography variant="caption" color="#a3aed0" fontWeight="700">{store.email}</Typography>
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={store.adminShare} 
                                          size="small" 
                                          sx={{ backgroundColor: "rgba(67, 24, 255, 0.08)", color: "#4318ff", fontWeight: "900", borderRadius: "8px", fontSize: "10px" }} 
                                      />
                                      <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "#a3aed0", fontWeight: "700" }}>PROTOCOL SHARE</Typography>
                                  </TableCell>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800" }}>{store.ownerName}</TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={store.status.toUpperCase()} 
                                          size="small"
                                          sx={{ 
                                              backgroundColor: "rgba(255, 181, 71, 0.1)", 
                                              color: "#ffb547", 
                                              fontWeight: "900",
                                              borderRadius: "8px",
                                              fontSize: "10px"
                                          }}
                                      />
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3 }}>
                                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                          <Tooltip title="Examine Node Profile">
                                              <IconButton size="small" sx={{ color: "#4318ff", bgcolor: "#f4f7fe", borderRadius: "10px", "&:hover": { bgcolor: "#e0e5f2" } }}>
                                                  <VisibilityIcon fontSize="small" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Authorize Operations">
                                              <IconButton 
                                                  onClick={() => handleApprove(store.id)}
                                                  sx={{ color: "#00d26a", bgcolor: "rgba(0, 210, 106, 0.05)", borderRadius: "10px", "&:hover": { bgcolor: "rgba(0, 210, 106, 0.1)" } }}
                                              >
                                                  <CheckCircleIcon fontSize="small" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Reject Request">
                                              <IconButton sx={{ color: "#ff4d49", bgcolor: "rgba(255, 77, 73, 0.05)", borderRadius: "10px", "&:hover": { bgcolor: "rgba(255, 77, 73, 0.1)" } }}>
                                                  <CancelIcon fontSize="small" />
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

export default StoreApproval;