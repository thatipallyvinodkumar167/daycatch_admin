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
  Avatar,
  Divider,
  LinearProgress,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../api/genericApi";

const SubAdmin = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAdmins = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("sub-admin");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((user, index) => ({
        id: user._id || index,
        name: user["Name"] || user.name || "Unknown Admin",
        email: user["Email"] || user["Email ID"] || user.email || "protocol@daycatch.com",
        phone: user["Mobile Number"] || user.phone || "N/A",
        role: user["role Name"] || user.roleName || user.role || "Admin",
        status: user.Status || user.status || "Active",
        image: user.Image || user.image || user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user["Name"] || "Admin")}&background=4318ff&color=fff`
      }));

      setAdmins(formattedData);
    } catch (error) {
      console.error("Error fetching sub-admins:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sub-admin account?")) {
      try {
        await genericApi.remove("sub-admin", id);
        fetchAdmins();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredAdmins = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return admins;
    return admins.filter((admin) =>
      admin.name.toLowerCase().includes(q) ||
      admin.email.toLowerCase().includes(q)
    );
  }, [admins, search]);

  const stats = useMemo(() => [
    { label: "Total Admins", value: admins.length, icon: <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Status", value: "Verified", icon: <ManageAccountsIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [admins]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Sub-Admin Management
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage sub-admin accounts and their access levels.
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
                onClick={() => navigate("/sub-admin/add")}
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
                Add Sub-Admin
            </Button>
        </Stack>
      </Box>

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {(loading || refreshing) && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, bgcolor: "#f4f7fe", "& .MuiLinearProgress-bar": { bgcolor: "#4318ff" } }} />
          )}
          
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Sub-Admin List</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                      size="small"
                      placeholder="Search Sub-Admin..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      InputProps={{
                          startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#fff", width: "320px" } }}
                  />
                  <Tooltip title="Refresh">
                      <IconButton onClick={() => fetchAdmins(true)} disabled={refreshing} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Sub-Admin</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Role</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredAdmins.length === 0 && !loading ? (
                          <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10, color: "#a3aed0", fontWeight: "800" }}>No sub-admins found.</TableCell></TableRow>
                      ) : (
                          filteredAdmins.map((admin, index) => (
                              <TableRow key={admin.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                          <Avatar src={admin.image} sx={{ width: 44, height: 44, borderRadius: "12px", border: "2px solid #f4f7fe" }} />
                                          <Box>
                                              <Typography variant="body2" fontWeight="800" color="#1b2559">{admin.name}</Typography>
                                              <Typography variant="caption" color="#a3aed0" fontWeight="700" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                                  <EmailIcon sx={{ fontSize: 10 }} /> {admin.email}
                                              </Typography>
                                          </Box>
                                      </Stack>
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={admin.role.toUpperCase()} 
                                          size="small" 
                                          sx={{ fontWeight: "900", bgcolor: "rgba(67, 24, 255, 0.05)", color: "#4318ff", borderRadius: "10px", fontSize: "10px", border: "1px solid rgba(67, 24, 255, 0.1)" }} 
                                      />
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={admin.status.toUpperCase()} 
                                          size="small" 
                                          sx={{ 
                                              fontWeight: "900", 
                                              bgcolor: admin.status === "Active" ? "rgba(0, 210, 106, 0.1)" : "rgba(163, 174, 208, 0.1)", 
                                              color: admin.status === "Active" ? "#00d26a" : "#a3aed0", 
                                              borderRadius: "8px",
                                              fontSize: "10px",
                                              border: `1px solid ${admin.status === "Active" ? "rgba(0, 210, 106, 0.2)" : "rgba(163, 174, 208, 0.2)"}`
                                          }} 
                                      />
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                      <Tooltip title="Edit Admin">
                                          <IconButton 
                                              onClick={() => navigate(`/sub-admin/edit/${admin.id}`)}
                                              sx={{ backgroundColor: "#00d26a", color: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 210, 106, 0.2)", "&:hover": { backgroundColor: "#00b85c" } }}
                                          >
                                              <EditIcon sx={{ fontSize: 18 }} />
                                          </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Delete Admin">
                                          <IconButton 
                                              onClick={() => handleDelete(admin.id)}
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

export default SubAdmin;
