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
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  CircularProgress,
  Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import { useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers, updateUser } from "../../api/usersApi";
import { getAllOrders } from "../../api/ordersApi";

const UsersData = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mutatingKey, setMutatingKey] = useState("");

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [userRes, orderRes] = await Promise.all([
        getAllUsers({ limit: 500 }),
        getAllOrders({ limit: 1000 })
      ]);

      const results = userRes.data?.results || userRes.data?.data || [];
      const orderList = orderRes.data?.results || orderRes.data?.data || [];

      const orderCountMap = orderList.reduce((acc, order) => {
        const userKey = order["User"] || order["User Phone"];
        if (userKey) {
          acc[userKey] = (acc[userKey] || 0) + 1;
        }
        return acc;
      }, {});

      const formattedData = results.map((user) => {
        const name = user["User Name"] || "Unknown User";
        const email = user["User Email"] || "No email";
        const phone = user["User Phone"] || "N/A";
        const registrationDate = user["Registration Date"];
        const isVerified = Boolean(user["Is Verified"]);

        return {
          id: user._id || name,
          name,
          email,
          phone,
          regDate: registrationDate
            ? new Date(registrationDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
          isVerified,
          totalOrders: orderCountMap[name] || orderCountMap[phone] || 0,
          walletBalance: user["Wallet Balance"] || "Rs. 0",
          location: user["Location"] || user["City"] || "Not Set",
          status: user.status || user.Status || "Active",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        };
      });

      setUsers(formattedData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm("Permanently de-register this user from the system?")) {
      setMutatingKey(`delete-${id}`);
      try {
        await deleteUser(id);
        setUsers((prev) => prev.filter((user) => user.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      } finally {
        setMutatingKey("");
      }
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "Active" ? "Blocked" : "Active";
    const actionKey = `status-${user.id}`;

    setMutatingKey(actionKey);
    try {
      await updateUser(user.id, { status: nextStatus });
      setUsers((prev) =>
        prev.map((entry) =>
          entry.id === user.id ? { ...entry, status: nextStatus } : entry
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status.");
    } finally {
      setMutatingKey("");
    }
  };

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return users;
    return users.filter((user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query)
    );
  }, [users, search]);

  const stats = useMemo(() => [
    { label: "Total Users", value: users.length, icon: <GroupsIcon sx={{ fontSize: 20 }} />, color: "#4318ff" },
    { label: "Verified", value: users.filter(u => u.isVerified).length, icon: <VerifiedUserIcon sx={{ fontSize: 20 }} />, color: "#00d26a" },
    { label: "Restricted", value: users.filter(u => u.status === "Blocked").length, icon: <BlockOutlinedIcon sx={{ fontSize: 20 }} />, color: "#ff4d49" },
  ], [users]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                User Management
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Manage user profiles, verification status, and order history.
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
            <Tooltip title="Refresh List">
                <IconButton 
                    onClick={() => fetchUsers(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
            {/* ADD USER BUTTON */}
            <Button 
                variant="contained" 
                startIcon={<GroupsIcon />}
                onClick={() => navigate("/user-data/add")}
                sx={{ 
                    backgroundColor: "#4318ff", 
                    "&:hover": { backgroundColor: "#3311cc" },
                    borderRadius: "14px",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    fontWeight: "800",
                    boxShadow: "0 10px 20px rgba(67, 24, 255, 0.2)"
                }}
            >
                Add User
            </Button>
        </Stack>
      </Box>

      {/* Full Width Table Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          {/* Search Toolbar */}
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">User List</Typography>
              <TextField
                  size="small"
                  placeholder="Search users..."
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>User Info</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Contact</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Activity</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Verification</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredUsers.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                  <Typography color="#a3aed0" fontWeight="600">No users found.</Typography>
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredUsers.map((user, index) => (
                              <TableRow key={user.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                                  <TableCell>
                                      <Stack direction="row" spacing={1.5} alignItems="center">
                                          <Avatar src={user.avatar} sx={{ width: 44, height: 44, borderRadius: "14px", border: "2px solid #f4f7fe" }} />
                                          <Box>
                                              <Typography variant="body2" fontWeight="800" color="#1b2559" noWrap sx={{ maxWidth: 140 }}>{user.name}</Typography>
                                              <Typography variant="caption" color="#a3aed0" fontWeight="700">Joined {user.regDate}</Typography>
                                          </Box>
                                      </Stack>
                                  </TableCell>
                                  <TableCell>
                                      <Typography variant="body2" color="#1b2559" fontWeight="800">{user.phone}</Typography>
                                      <Typography variant="caption" color="#a3aed0" fontWeight="700">{user.email}</Typography>
                                  </TableCell>
                                  <TableCell>
                                      <Typography variant="body2" fontWeight="900" color="#1b2559">{user.totalOrders} <Typography component="span" variant="caption" color="#a3aed0">Orders</Typography></Typography>
                                      <Typography variant="caption" color="#00d26a" fontWeight="800">{user.walletBalance}</Typography>
                                  </TableCell>
                                  <TableCell>
                                      <Chip 
                                          label={user.isVerified ? "Verified" : "Unverified"} 
                                          size="small" 
                                          sx={{ backgroundColor: user.isVerified ? "rgba(0, 210, 106, 0.08)" : "rgba(255, 77, 73, 0.08)", color: user.isVerified ? "#00d26a" : "#ff4d49", fontWeight: "800", borderRadius: "8px" }} 
                                      />
                                  </TableCell>
                                  <TableCell>
                                      <Chip
                                          label={user.status}
                                          size="small"
                                          onClick={() => handleToggleStatus(user)}
                                          sx={{ 
                                              backgroundColor: user.status === "Active" ? "rgba(67, 24, 255, 0.08)" : "rgba(255, 77, 73, 0.08)", 
                                              color: user.status === "Active" ? "#4318ff" : "#ff4d49", 
                                              fontWeight: "800",
                                              borderRadius: "8px",
                                              cursor: "pointer",
                                              opacity: mutatingKey === `status-${user.id}` ? 0.6 : 1,
                                              pointerEvents: mutatingKey ? "none" : "auto",
                                              "&:hover": { opacity: 0.8 }
                                          }}
                                      />
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 3 }}>
                                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                          <Tooltip title="View Details">
                                              <IconButton size="small" sx={{ color: "#4318ff", bgcolor: "#f4f7fe", borderRadius: "10px", "&:hover": { bgcolor: "#e0e5f2" } }}>
                                                  <VisibilityIcon fontSize="small" />
                                              </IconButton>
                                          </Tooltip>
                                          <IconButton size="small" onClick={() => handleToggleStatus(user)} disabled={Boolean(mutatingKey)} sx={{ color: user.status === "Active" ? "#ff4d49" : "#00d26a", bgcolor: user.status === "Active" ? "rgba(255, 77, 73, 0.05)" : "rgba(0, 210, 106, 0.05)", borderRadius: "10px" }}>
                                              {user.status === "Active" ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                          </IconButton>
                                          <IconButton size="small" onClick={() => handleDelete(user.id)} disabled={Boolean(mutatingKey)} sx={{ color: "#ff4d49", bgcolor: "rgba(255, 77, 73, 0.05)", borderRadius: "10px" }}>
                                              <DeleteIcon fontSize="small" />
                                          </IconButton>
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

export default UsersData;


