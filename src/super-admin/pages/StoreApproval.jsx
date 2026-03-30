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
  LinearProgress,
  CircularProgress
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Storefront as StorefrontIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  VerifiedUser as VerifiedUserIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const extractItems = (payload) => {
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
};

const getStoreKey = (store) =>
  normalizeValue(store.email) ||
  normalizeValue(store.storeName) ||
  normalizeValue(store.mobile) ||
  normalizeValue(store.id);

const buildLogo = (storeName, image) =>
  image ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(storeName || "S")}&background=4318ff&color=fff`;

const normalizeApprovalStatus = (value, fallback = "Pending") => {
  const normalized = normalizeValue(value);

  if (["approved", "active", "accepted", "live"].includes(normalized)) return "Active";
  if (["rejected", "declined", "inactive"].includes(normalized)) return "Rejected";
  if (["pending", "review", "in review"].includes(normalized)) return "Pending";

  return fallback;
};

const formatStoreListRequest = (store, index) => {
  const storeName = store["Store Name"] || store.name || "Unknown Entity";

  return {
    id: store._id || `store-list-${index}`,
    sourceCollection: "storeList",
    storeWorkspaceId: store._id || "",
    linkedStoreId: store._id || "",
    storeName,
    city: store.City || store.city || "Registry Not Set",
    mobile: store.Mobile || store.phone || "N/A",
    email: store.Email || store.email || "N/A",
    adminShare: store["admin share"] || store["Admin Share"] || "0%",
    ownerName:
      store["Employee Name"] ||
      store["owner name"] ||
      store["Owner name"] ||
      store.ownerName ||
      "Anonymous Owner",
    status: normalizeApprovalStatus(store.status || store.Status, "Pending"),
    logo: buildLogo(storeName, store["Profile Pic"] || store.logo),
    raw: store
  };
};

const formatStoreApprovalRequest = (store, index, linkedStoreId = "") => {
  const storeName = store["Store Name"] || store.name || "Unknown Entity";
  const reviewStatus = normalizeApprovalStatus(store.status || store.Status, "Pending");

  return {
    id: store._id || `store-approval-${index}`,
    sourceCollection: "storeapproval",
    storeWorkspaceId: linkedStoreId || "",
    linkedStoreId,
    storeName,
    city: store.City || store.city || "Registry Not Set",
    mobile: store.Mobile || store.phone || "N/A",
    email: store.Email || store.email || "N/A",
    adminShare: store["Admin Share"] || store["admin share"] || "0%",
    ownerName:
      store["Owner name"] ||
      store["owner name"] ||
      store["Employee Name"] ||
      store.ownerName ||
      "Anonymous Owner",
    status: reviewStatus === "Rejected" ? "Rejected" : "Pending",
    logo: buildLogo(storeName, store["Profile Pic"] || store.logo),
    raw: store
  };
};

const buildStoreListPayloadFromApproval = (store) => ({
  "Profile Pic": store.logo || "",
  "Store Name": store.storeName,
  name: store.storeName,
  City: store.city,
  Mobile: store.mobile,
  Email: store.email,
  "admin share": store.adminShare,
  "Admin Share": Number.parseFloat(String(store.adminShare || "").replace(/[^\d.]/g, "")) || 0,
  "owner name": store.ownerName,
  "Employee Name": store.ownerName,
  status: "Active",
  updatedAt: new Date().toISOString()
});

const StoreApproval = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendingStores = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [approvalResponse, storeListResponse] = await Promise.allSettled([
        genericApi.getAll("storeapproval"),
        genericApi.getAll("storeList")
      ]);

      const approvalResults =
        approvalResponse.status === "fulfilled" ? extractItems(approvalResponse.value.data) : [];
      const storeListResults =
        storeListResponse.status === "fulfilled" ? extractItems(storeListResponse.value.data) : [];

      const mappedStoreList = storeListResults.map(formatStoreListRequest);
      const storeListLookup = new Map(
        mappedStoreList
          .map((store) => [getStoreKey(store), store])
          .filter(([key]) => Boolean(key))
      );

      const approvalQueue = approvalResults
        .map((store, index) => {
          const baseStore = formatStoreApprovalRequest(store, index);
          const linkedStore = storeListLookup.get(getStoreKey(baseStore));

          return linkedStore
            ? {
                ...baseStore,
                linkedStoreId: linkedStore.linkedStoreId,
                storeWorkspaceId: linkedStore.storeWorkspaceId
              }
            : baseStore;
        })
        .filter((store) => store.status !== "Rejected");

      const approvalKeys = new Set(approvalQueue.map(getStoreKey).filter(Boolean));

      const pendingStoreListQueue = mappedStoreList.filter(
        (store) => store.status === "Pending" && !approvalKeys.has(getStoreKey(store))
      );

      setStores(
        [...approvalQueue, ...pendingStoreListQueue].sort((left, right) =>
          left.storeName.localeCompare(right.storeName)
        )
      );
    } catch (error) {
      console.error("Error: Failed to load store approval list:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingStores();
  }, [fetchPendingStores]);

  const handleApprove = async (store) => {
    if (window.confirm("Approve this store to start selling on the platform?")) {
      try {
        if (store.sourceCollection === "storeapproval") {
          const payload = buildStoreListPayloadFromApproval(store);

          if (store.linkedStoreId) {
            await genericApi.update("storeList", store.linkedStoreId, payload);
          } else {
            await genericApi.create("storeList", payload);
          }

          await genericApi.remove("storeapproval", store.id);
        } else {
          await genericApi.update("storeList", store.id, {
            ...store.raw,
            status: "Active",
            updatedAt: new Date().toISOString()
          });
        }

        setStores(prev => prev.filter(s => s.id !== store.id));
        alert("Store approved successfully!");
      } catch (error) {
        console.error(error);
        alert("Approval failed. Please try again.");
      }
    }
  };

  const handleReject = async (store) => {
    if (!window.confirm("Reject this store request?")) return;

    try {
      if (store.sourceCollection === "storeapproval") {
        await genericApi.update("storeapproval", store.id, {
          ...store.raw,
          status: "Rejected",
          reviewedAt: new Date().toISOString()
        });
      } else {
        await genericApi.update("storeList", store.id, {
          ...store.raw,
          status: "Rejected",
          reviewedAt: new Date().toISOString()
        });
      }

      setStores(prev => prev.filter(s => s.id !== store.id));
      alert("Store rejected successfully.");
    } catch (error) {
      console.error("Rejection failed:", error);
      alert("Rejection failed. Please try again.");
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

  const openStorePage = (storeId) => {
    if (!storeId) return;
    navigate(`/stores/details/${encodeURIComponent(storeId)}/dashboard`);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Store Approvals
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
                Review and approve new store registration requests.
            </Typography>
        </Box>
        <Tooltip title="Refresh List">
            <IconButton 
                onClick={() => fetchPendingStores(true)} 
                disabled={refreshing || loading}
                sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5, borderRadius: "14px" }}
            >
                {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
            </IconButton>
        </Tooltip>
      </Box>

      {/* Summary Cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Pending Requests", value: stores.length, icon: <StorefrontIcon />, color: "#4318ff", bg: "#e0e7ff" },
          { label: "Avg. Wait Time", value: "24h", icon: <VerifiedUserIcon />, color: "#24d164", bg: "#e6f9ed" },
          { label: "Rejected Today", value: "0", icon: <CancelIcon />, color: "#ff4d49", bg: "#fff1f0" },
          { label: "Verification Level", value: "85%", icon: <CheckCircleIcon />, color: "#ffb800", bg: "#fff8e6" },
        ].map((stat) => (
          <Paper key={stat.label} sx={{ flex: 1, p: 3, borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">{stat.label}</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{stat.value}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          {/* Search Toolbar */}
          <Box sx={{ p: 3, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Box>
                <Typography variant="h6" fontWeight="700" color="#1b2559">Approval Queue</Typography>
                <Typography variant="caption" color="textSecondary">{filteredStores.length} requests</Typography>
              </Box>
              <TextField
                  size="small"
                  placeholder="Search store or owner..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ 
                      "& .MuiOutlinedInput-root": { 
                          borderRadius: "12px", 
                          backgroundColor: "#f4f7fe" 
                      },
                      width: "280px"
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Store Info</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Contact Info</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Commission</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Owner Name</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredStores.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                  <Typography color="#a3aed0" fontWeight="600">No pending store requests.</Typography>
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredStores.map((store, index) => (
                              <TableRow key={store.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                          <Avatar src={store.logo} sx={{ width: 44, height: 44, borderRadius: "8px", border: "2px solid #f4f7fe" }} />
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
                                      <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "#a3aed0", fontWeight: "700" }}>STORE SHARE</Typography>
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
                                          <Tooltip title="Open Store Page">
                                              <IconButton 
                                                size="small" 
                                                disabled={!store.storeWorkspaceId}
                                                onClick={() => openStorePage(store.storeWorkspaceId)}
                                                sx={{ color: "#4318ff", bgcolor: "#f4f7fe", borderRadius: "10px", "&:hover": { bgcolor: "#e0e5f2" } }}
                                              >
                                                  <VisibilityIcon fontSize="small" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Approve Store">
                                              <IconButton 
                                                  onClick={() => handleApprove(store)}
                                                  sx={{ color: "#00d26a", bgcolor: "rgba(0, 210, 106, 0.05)", borderRadius: "10px", "&:hover": { bgcolor: "rgba(0, 210, 106, 0.1)" } }}
                                              >
                                                  <CheckCircleIcon fontSize="small" />
                                              </IconButton>
                                          </Tooltip>
                                          <Tooltip title="Reject Store">
                                              <IconButton
                                                onClick={() => handleReject(store)}
                                                sx={{ color: "#ff4d49", bgcolor: "rgba(255, 77, 73, 0.05)", borderRadius: "10px", "&:hover": { bgcolor: "rgba(255, 77, 73, 0.1)" } }}
                                              >
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


