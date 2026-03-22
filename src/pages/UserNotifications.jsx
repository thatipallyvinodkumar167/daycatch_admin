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
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  LinearProgress
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { genericApi } from "../api/genericApi";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("user_notifications");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index,
        title: item.title || "System Broadcast",
        image: item.image || item.logo || null,
        user: item.user || item.selectUsers || "Global Audience",
        message: item.message || item.body || "Notification details scheduled for dispatch...",
        timestamp: item.createdAt || item.date || null
      }));

      setNotifications(formattedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return notifications;
    return notifications.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query) ||
      item.user.toLowerCase().includes(query)
    );
  }, [notifications, search]);

  const stats = useMemo(() => [
    { label: "Dispatches", value: notifications.length, icon: <HistoryIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Reach", value: "Verified", icon: <SendIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [notifications]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Consumer Alert Registry
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                Archival repository of sent and scheduled push communications.
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
            <Tooltip title="Refresh Dispatches">
                <IconButton 
                    onClick={() => fetchNotifications(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
        </Stack>
      </Box>

      {/* Full Width Registry Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Dispatch Logs</Typography>
              <TextField
                  size="small"
                  placeholder="Search Identity or Message..."
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Communication Asset</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Target Hub</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Manifest (Body)</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Status</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Ops</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filtered.map((item, index) => (
                          <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                              <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                              <TableCell>
                                  <Stack direction="row" spacing={1.5} alignItems="center">
                                      <Avatar src={item.image} variant="rounded" sx={{ width: 44, height: 44, borderRadius: "12px", border: "2px solid #f4f7fe" }}>
                                          <NotificationsActiveIcon sx={{ fontSize: 20 }} />
                                      </Avatar>
                                      <Box>
                                          <Typography variant="body2" fontWeight="800" color="#1b2559" noWrap sx={{ maxWidth: 150 }}>{item.title}</Typography>
                                          <Typography variant="caption" color="#a3aed0" fontWeight="700">Dispatch ID: {String(item.id).slice(-6).toUpperCase()}</Typography>
                                      </Box>
                                  </Stack>
                              </TableCell>
                              <TableCell>
                                  <Typography variant="body2" color="#4318ff" fontWeight="800">{item.user}</Typography>
                              </TableCell>
                              <TableCell>
                                  <Typography variant="caption" color="#1b2559" fontWeight="600" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5, maxWidth: "250px" }}>
                                      {item.message}
                                  </Typography>
                              </TableCell>
                              <TableCell>
                                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#00d26a" }} />
                                      <Typography variant="caption" fontWeight="800" color="#00d26a">DELIVERED</Typography>
                                  </Box>
                              </TableCell>
                              <TableCell align="right" sx={{ pr: 3 }}>
                                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                      <Tooltip title="Examine Payload">
                                          <IconButton size="small" sx={{ color: "#4318ff", bgcolor: "#f4f7fe", borderRadius: "10px", "&:hover": { bgcolor: "#e0e5f2" } }}>
                                              <VisibilityIcon fontSize="small" />
                                          </IconButton>
                                      </Tooltip>
                                      <IconButton size="small" sx={{ color: "#ff4d49", bgcolor: "rgba(255, 77, 73, 0.05)", borderRadius: "10px" }}>
                                          <DeleteOutlineIcon fontSize="small" />
                                      </IconButton>
                                  </Stack>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
      </Paper>
    </Box>
  );
};

export default UserNotifications;
