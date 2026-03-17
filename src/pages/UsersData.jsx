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
  Button,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";

const UsersData = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      
      const formattedData = response.data.map((user, index) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone.split(" ")[0],
        regDate: `2024-02-${10 + (index % 18)}`,
        isVerified: index % 3 !== 0,
        status: index % 5 === 0 ? "Blocked" : "Active",
        avatar: `https://ui-avatars.com/api/?name=${user.name}&background=random`,
      }));

      setUsers(formattedData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
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

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>USER</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>CONTACT</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>REG. DATE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>VERIFIED</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STATUS</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No Users Found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={user.avatar} sx={{ width: 36, height: 36 }} />
                        <Typography variant="body2" fontWeight="700" color="#1b2559">{user.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="600" color="#1b2559">{user.phone}</Typography>
                      <Typography variant="caption" color="textSecondary">{user.email}</Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#475467" }}>{user.regDate}</TableCell>
                    <TableCell>
                      {user.isVerified ? (
                        <Chip label="Verified" size="small" sx={{ backgroundColor: "#e6f9ed", color: "#24d164", fontWeight: "700" }} />
                      ) : (
                        <Chip label="Unverified" size="small" sx={{ backgroundColor: "#fff1f0", color: "#ff4d49", fontWeight: "700" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        size="small"
                        sx={{ 
                          backgroundColor: user.status === "Active" ? "#e6f9ed" : "#fff1f0", 
                          color: user.status === "Active" ? "#24d164" : "#ff4d49", 
                          fontWeight: "700" 
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
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
                        <Tooltip title="Edit User">
                          <IconButton size="small" sx={{ 
                                backgroundColor: "#00d26a", 
                                color: "#fff", 
                                borderRadius: "10px",
                                "&:hover": { backgroundColor: "#00b85c" }
                            }}>
                            <EditIcon fontSize="small" />
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