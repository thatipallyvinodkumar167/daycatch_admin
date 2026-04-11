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
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers, updateUser } from "../../api/usersApi";

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
      const userRes = await getAllUsers({ limit: 500 });
      const results = userRes.data?.results || userRes.data?.data || [];

      const formattedData = results.map((user) => {
        const name = String(user.name || user["User Name"] || "").trim();
        const email = String(
          user.email ||
            user.Email ||
            user["User Email"] ||
            user["Email ID"] ||
            ""
        ).trim();
        const phone = String(
          user.user_phone ||
            user.phone ||
            user.Phone ||
            user.mobile ||
            user.Mobile ||
            user["User Phone"] ||
            user["Mobile Number"] ||
            ""
        ).trim();
        const registrationDate = user.reg_date || user["Registration Date"] || null;
        const isVerified = Boolean(user.is_verified ?? user["Is Verified"]);
        const isBlocked = Number(user.block ?? 0) === 1;

        return {
          id: user.id || user._id || name || Math.random().toString(36).slice(2),
          name,
          email,
          phone,
          city: user.city || user.City || "",
          society: user.Society || user.Location || "",
          regDate: registrationDate
            ? new Date(registrationDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "",
          isVerified,
          walletBalance: user["Wallet Balance"] ?? 0,
          userRewards: user["User Rewards"] ?? 0,
          status: user.status || user.Status || (isBlocked ? "Blocked" : "Active"),
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
      user.phone.toLowerCase().includes(query) ||
      user.city.toLowerCase().includes(query) ||
      user.society.toLowerCase().includes(query)
    );
  }, [users, search]);

  const stats = useMemo(
    () => [
      { label: "TOTAL USERS", value: users.length, icon: <GroupsIcon />, color: "#4318ff", bg: "#eef2ff" },
      { label: "VERIFIED", value: users.filter((u) => u.isVerified).length, icon: <VerifiedUserIcon />, color: "#24d164", bg: "#e6f9ed" },
      { label: "RESTRICTED", value: users.filter((u) => u.status === "Blocked").length, icon: <BlockOutlinedIcon />, color: "#ff4d49", bg: "#fff1f0" },
      { label: "ACTIVE", value: users.filter((u) => u.status === "Active").length, icon: <PersonOutlineIcon />, color: "#ffb800", bg: "#fff9e6" },
    ],
    [users]
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            App Users
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
            Manage app user records, verification status, and account access.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={refreshing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          sx={{
            backgroundColor: "#1b2559",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: "700",
            px: 3,
            boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)",
          }}
        >
          {refreshing ? "Refreshing..." : "Reload Data"}
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Paper sx={{ p: 2.5, borderRadius: "20px", display: "flex", alignItems: "center", gap: 2, border: "1px solid #e0e5f2" }}>
              <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 48, height: 48, borderRadius: "12px" }}>
                {stat.icon}
              </Avatar>
              <Box>
                <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "0.5px" }}>
                  {stat.label}
                </Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">
                  {stat.value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          <TextField
            size="small"
            placeholder="Search by name, phone, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              maxWidth: "500px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                backgroundColor: "#fff",
                "& fieldset": { borderColor: "#e0e5f2" },
              },
            }}
          />
        </Box>
      </Stack>

      <Paper
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
          border: "1px solid #e0e5f2",
          background: "#fff",
        }}
      >
        {loading && <LinearProgress sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#4318ff" } }} />}

        <TableContainer>
              <Table stickyHeader>
                  <TableHead>
                      <TableRow>
                          <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", py: 2, pl: 4 }}>#</TableCell>
                          <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER NAME</TableCell>
                          <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>USER PHONE</TableCell>
                          <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>REGISTRATION DATE</TableCell>
                          <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>IS VERIFIED</TableCell>
                          <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px" }}>ACTIVE / BLOCK</TableCell>
                          <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4 }}>ACTIONS</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filteredUsers.length === 0 ? (
                          <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                  <Typography variant="body1" color="#a3aed0" fontWeight="600">
                                    No user records found
                                  </Typography>
                              </TableCell>
                          </TableRow>
                      ) : (
                          filteredUsers.map((user, index) => (
                              <TableRow key={user.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" } }}>
                                  <TableCell sx={{ color: "#1b2559", fontWeight: 700, pl: 4, borderBottom: "1px solid #edf1f8" }}>{index + 1}</TableCell>
                                  <TableCell sx={{ borderBottom: "1px solid #edf1f8" }}>
                                      <Typography variant="body2" fontWeight="800" color="#1b2559">
                                        {user.name}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="#a3aed0"
                                        fontWeight="700"
                                        sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25, wordBreak: "break-word" }}
                                      >
                                        <EmailIcon sx={{ fontSize: 10 }} />
                                        {user.email}
                                      </Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "1px solid #edf1f8" }}>
                                      <Typography variant="body2" color="#1b2559" fontWeight="800">
                                        {user.phone}
                                      </Typography>
                                      <Typography variant="caption" color="#a3aed0" fontWeight="700">
                                        {user.city}
                                      </Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "1px solid #edf1f8" }}>
                                      <Typography variant="body2" color="#1b2559" fontWeight="750">{user.regDate}</Typography>
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "1px solid #edf1f8" }}>
                                      <Chip 
                                          label={user.isVerified ? "Verified" : "Unverified"} 
                                          size="small" 
                                          sx={{ backgroundColor: user.isVerified ? "rgba(0, 210, 106, 0.08)" : "rgba(255, 77, 73, 0.08)", color: user.isVerified ? "#00d26a" : "#ff4d49", fontWeight: 800, borderRadius: "8px" }} 
                                      />
                                  </TableCell>
                                  <TableCell sx={{ borderBottom: "1px solid #edf1f8" }}>
                                      <Chip
                                          label={user.status}
                                          size="small"
                                          onClick={() => handleToggleStatus(user)}
                                          sx={{ 
                                              backgroundColor: user.status === "Active" ? "rgba(67, 24, 255, 0.08)" : "rgba(255, 77, 73, 0.08)", 
                                              color: user.status === "Active" ? "#4318ff" : "#ff4d49", 
                                              fontWeight: 800,
                                              borderRadius: "8px",
                                              cursor: "pointer",
                                              opacity: mutatingKey === `status-${user.id}` ? 0.6 : 1,
                                              pointerEvents: mutatingKey ? "none" : "auto",
                                              "&:hover": { opacity: 0.8 }
                                          }}
                                      />
                                  </TableCell>
                                  <TableCell align="right" sx={{ pr: 4, borderBottom: "1px solid #edf1f8" }}>
                                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                                          <Tooltip title="Edit User">
                                              <Button
                                                  variant="outlined"
                                                  size="small"
                                                  onClick={() => navigate(`/user-data/edit/${user.id}`)}
                                                  sx={{
                                                    borderRadius: "10px",
                                                    textTransform: "none",
                                                    fontWeight: "800",
                                                    borderColor: "#e0e5f2",
                                                    color: "#1b2559",
                                                    "&:hover": { borderColor: "#4318ff", backgroundColor: "#eef2ff" },
                                                  }}
                                              >
                                                  Edit User
                                              </Button>
                                          </Tooltip>
                                          <IconButton size="small" onClick={() => handleToggleStatus(user)} disabled={Boolean(mutatingKey)} sx={{ color: user.status === "Active" ? "#ff4d49" : "#00d26a", bgcolor: user.status === "Active" ? "rgba(255, 77, 73, 0.05)" : "rgba(0, 210, 106, 0.05)", borderRadius: "10px" }}>
                                              {user.status === "Active" ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                                          </IconButton>
                                          <IconButton className="action-delete" size="small" onClick={() => handleDelete(user.id)} disabled={Boolean(mutatingKey)} sx={{ color: "#ff4d49", bgcolor: "rgba(255, 77, 73, 0.05)", borderRadius: "10px" }}>
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



