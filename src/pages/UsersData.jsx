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
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { getAllUsers } from "../api/usersApi";
import { getAllOrders } from "../api/ordersApi";

const UsersData = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [userRes, orderRes] = await Promise.all([
        getAllUsers({ limit: 500 }),
        getAllOrders({ limit: 1000 })
      ]);

      const results = userRes.data?.results || userRes.data?.data || [];
      const orderList = orderRes.data?.results || orderRes.data?.data || [];

      // Create a map of order counts by user name or phone
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
          status: user.status || "Active",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        };
      });

      setUsers(formattedData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === id
          ? { ...user, status: user.status === "Active" ? "Blocked" : "Active" }
          : user
      )
    );
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    user.email.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Comprehensive view of all registered users and their status.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Users", value: users.length, color: "#2d60ff", bg: "#e0e7ff" },
          { label: "Verified Users", value: users.filter(u => u.isVerified).length, color: "#24d164", bg: "#e6f9ed" },
          { label: "Blocked Users", value: users.filter(u => u.status === "Blocked").length, color: "#ff4d49", bg: "#fff1f0" },
        ].map((stat) => (
          <Paper key={stat.label} sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: stat.bg }}>
                <PersonIcon sx={{ color: stat.color }} />
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">{stat.label}</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{stat.value}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", position: "relative" }}>
        {loading && (
          <LinearProgress 
            sx={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              right: 0, 
              backgroundColor: "#fff1f0",
              "& .MuiLinearProgress-bar": { backgroundColor: "#E53935" }
            }} 
          />
        )}
        
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">User Directory</Typography>
          <TextField
            size="small"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "300px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>USER NAME</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>USER PHONE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>LOCATION</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>ORDERS</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>WALLET</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>REG. DATE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>IS VERIFIED</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", fontSize: "12px", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    No Users Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    {/* # */}
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>

                    {/* User Name */}
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="700" color="#1b2559" noWrap sx={{ maxWidth: 130 }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" noWrap sx={{ maxWidth: 130, display: "block" }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* User Phone */}
                    <TableCell sx={{ color: "#475467", fontWeight: "500" }}>{user.phone}</TableCell>

                    {/* Location */}
                    <TableCell sx={{ color: "#475467", fontWeight: "500" }}>{user.location}</TableCell>

                    {/* Total Orders */}
                    <TableCell>
                      <Typography variant="body2" fontWeight="700" color="#E53935">
                        {user.totalOrders}
                      </Typography>
                    </TableCell>

                    {/* Wallet Balance */}
                    <TableCell>
                      <Typography variant="body2" fontWeight="700" color="#2ED480">
                        {user.walletBalance}
                      </Typography>
                    </TableCell>

                    {/* Registration Date */}
                    <TableCell sx={{ color: "#475467", fontSize: "13px" }}>{user.regDate}</TableCell>

                    {/* Is Verified */}
                    <TableCell>
                      {user.isVerified ? (
                        <Chip label="Verified" size="small" sx={{ backgroundColor: "#e6f9ed", color: "#24d164", fontWeight: "700" }} />
                      ) : (
                        <Chip label="Unverified" size="small" sx={{ backgroundColor: "#fff1f0", color: "#ff4d49", fontWeight: "700" }} />
                      )}
                    </TableCell>

                    {/* Active / Block status */}
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        onClick={() => handleToggleStatus(user.id)}
                        sx={{ 
                          backgroundColor: user.status === "Active" ? "#e6f9ed" : "#fff1f0", 
                          color: user.status === "Active" ? "#24d164" : "#ff4d49", 
                          fontWeight: "700",
                          cursor: "pointer",
                          "&:hover": { opacity: 0.85 }
                        }}
                      />
                    </TableCell>

                    {/* Details */}
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small" sx={{ 
                            backgroundColor: "#2d60ff", 
                            color: "#fff", 
                            borderRadius: "10px",
                            "&:hover": { backgroundColor: "#2046cc" }
                        }}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title={user.status === "Active" ? "Block User" : "Unblock User"}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleStatus(user.id)}
                            sx={{
                              backgroundColor: user.status === "Active" ? "#ff4d49" : "#00d26a",
                              color: "#fff",
                              borderRadius: "10px",
                              "&:hover": { backgroundColor: user.status === "Active" ? "#e03e3e" : "#00b85c" }
                            }}
                          >
                            {user.status === "Active" ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(user.id)}
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
    </Box>
  );
};

export default UsersData;
