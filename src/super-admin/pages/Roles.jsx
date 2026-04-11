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
  Divider,
  LinearProgress,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const Roles = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoles = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("roles");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((role) => ({
        id: role.role_id || role.id || role._id,
        name: role.role_name || role.name || "Unnamed Role",
      }));

      setRoles(formattedData);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await genericApi.remove("roles", id);
        fetchRoles();
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const filteredRoles = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return roles;
    return roles.filter((role) =>
      role.name.toLowerCase().includes(q)
    );
  }, [roles, search]);

  const stats = useMemo(() => [
    { label: "Total Roles", value: roles.length, icon: <SecurityIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Level", value: "Verified", icon: <AdminPanelSettingsIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [roles]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Role Management
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage user roles and their respective permissions.
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
                onClick={() => navigate("/roles/add")}
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
                Add Role
            </Button>
        </Stack>
      </Box>

      {/* Full Width Ledger Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {(loading || refreshing) && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, bgcolor: "#f4f7fe", "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg, #454545 0%, #ea3834 100%)" } }} />
          )}
          
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Role List</Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                      size="small"
                      placeholder="Search Roles..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      InputProps={{
                          startAdornment: <SearchIcon sx={{ color: "#a3aed0", mr: 1, fontSize: 20 }} />
                      }}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "14px", backgroundColor: "#fff", width: "320px" } }}
                  />
                  <Tooltip title="Refresh">
                      <IconButton onClick={() => fetchRoles(true)} disabled={refreshing} sx={{ bgcolor: "#fff", border: "1px solid #e0e5f2" }}>
                          <RefreshIcon sx={{ color: "#4318ff", fontSize: 20 }} className={refreshing ? "spin-animation" : ""} />
                      </IconButton>
                  </Tooltip>
              </Stack>
          </Box>

          <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
              <Table stickyHeader>
                  <TableHead>
                      <TableRow>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pl: 4, bgcolor: "#f4f7fe" }}>#</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Role Name</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredRoles.length === 0 && !loading ? (
                          <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10, color: "#a3aed0", fontWeight: "800" }}>No roles found.</TableCell></TableRow>
                      ) : (
                          filteredRoles.map((role, index) => (
                              <TableRow key={role.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                          <Box sx={{ p: 1, borderRadius: "10px", bgcolor: "rgba(67, 24, 255, 0.05)" }}>
                                              <SecurityIcon sx={{ color: "#4318ff", fontSize: 18 }} />
                                          </Box>
                                          <Typography variant="body2" fontWeight="800" color="#1b2559">{role.name}</Typography>
                                      </Stack>
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label="VERIFIED" 
                                          size="small" 
                                          sx={{ fontWeight: "900", bgcolor: "rgba(0, 210, 106, 0.1)", color: "#00d26a", borderRadius: "8px", fontSize: "10px", border: "1px solid rgba(0, 210, 106, 0.2)" }} 
                                      />
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3 }}>
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                      <Tooltip title="Edit Role">
                                          <IconButton className="action-edit" 
                                              onClick={() => navigate(`/roles/edit/${role.id}`)}
                                              sx={{ backgroundColor: "#00d26a", color: "#ffffff", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 210, 106, 0.2)", "&:hover": { backgroundColor: "#00b85c" } }}
                                          >
                                              <EditIcon sx={{ fontSize: 18 }} />
                                          </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Delete Role">
                                          <IconButton className="action-delete" 
                                              onClick={() => handleDelete(role.id)}
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

export default Roles;


