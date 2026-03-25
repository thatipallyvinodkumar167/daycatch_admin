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
  LinearProgress,
  Chip
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import BoltIcon from "@mui/icons-material/Bolt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { genericApi } from "../../api/genericApi";

const DriverNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await genericApi.getAll("driver_notifications");
      const results = response.data.results || response.data || [];
      
      const formattedData = results.map((item, index) => ({
        id: item._id || index,
        title: item.title || "Dispatch Alert",
        image: item.image || item.logo || null,
        driver: item.driver || item.selectDrivers || "All Drivers",
        message: item.message || item.body || "No message content available.",
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

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this notification?")) {
      try {
        await genericApi.remove("driver_notifications", id);
        fetchNotifications();
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return notifications;
    return notifications.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query) ||
      item.driver.toLowerCase().includes(query)
    );
  }, [notifications, search]);

  const stats = useMemo(() => [
    { label: "Total Sent", value: notifications.length, icon: <BoltIcon sx={{ fontSize: 18 }} />, color: "#4318ff" },
    { label: "Status", value: "Verified", icon: <DeliveryDiningIcon sx={{ fontSize: 18 }} />, color: "#00d26a" },
  ], [notifications]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Premium Header Container */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Driver Notifications
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
                List of all notifications sent to delivery partners.
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
                    onClick={() => fetchNotifications(true)} 
                    disabled={refreshing || loading}
                    sx={{ bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", p: 1.5 }}
                >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon sx={{ color: "#4318ff" }} />}
                </IconButton>
            </Tooltip>
        </Stack>
      </Box>

      {/* Full Width Dispatch Hub */}
      <Paper sx={{ borderRadius: "28px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #e0e5f2", backgroundColor: "#fff", position: "relative" }}>
          {loading && (
              <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "#f4f7fe", "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" } }} />
          )}
          
          <Box sx={{ p: 4, borderBottom: "1px solid #e0e5f2", display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#fafbfc" }}>
              <Typography variant="subtitle1" fontWeight="800" color="#1b2559">Notification History</Typography>
              <TextField
                  size="small"
                  placeholder="Search notifications..."
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
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Notification</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Audience</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Message</TableCell>
                          <TableCell sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", bgcolor: "#f4f7fe" }}>Type</TableCell>
                          <TableCell align="right" sx={{ fontWeight: "800", color: "#8f9bba", textTransform: "uppercase", fontSize: "11px", pr: 4, bgcolor: "#f4f7fe" }}>Actions</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {filtered.map((item, index) => (
                          <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9fbff" }, transition: "0.2s" }}>
                              <TableCell sx={{ color: "#1b2559", fontWeight: "800", pl: 4 }}>#{index + 1}</TableCell>
                              <TableCell>
                                  <Stack direction="row" spacing={1.5} alignItems="center">
                                      <Avatar src={item.image} variant="rounded" sx={{ width: 44, height: 44, borderRadius: "12px", border: "2px solid #f4f7fe" }}>
                                          <BoltIcon sx={{ fontSize: 20 }} />
                                      </Avatar>
                                      <Box>
                                          <Typography variant="body2" fontWeight="800" color="#1b2559" noWrap sx={{ maxWidth: 150 }}>{item.title}</Typography>
                                          <Typography variant="caption" color="#a3aed0" fontWeight="700">ID: {String(item.id).slice(-4).toUpperCase()}</Typography>
                                      </Box>
                                  </Stack>
                              </TableCell>
                              <TableCell>
                                  <Typography variant="body2" color="#4318ff" fontWeight="800">{item.driver}</Typography>
                              </TableCell>
                              <TableCell>
                                  <Typography variant="caption" color="#1b2559" fontWeight="600" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5, maxWidth: "250px" }}>
                                      {item.message}
                                  </Typography>
                              </TableCell>
                              <TableCell>
                                  <Chip label="OPERATIONAL" size="small" variant="outlined" sx={{ border: "1px dashed", borderColor: "#ffb800", color: "#ffb800", fontWeight: "900", fontSize: "10px" }} />
                              </TableCell>
                              <TableCell align="right" sx={{ pr: 3 }}>
                                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                      <Tooltip title="View Details">
                                          <IconButton size="small" sx={{ color: "#4318ff", bgcolor: "#f4f7fe", borderRadius: "10px", "&:hover": { bgcolor: "#e0e5f2" } }}>
                                              <VisibilityIcon fontSize="small" />
                                          </IconButton>
                                      </Tooltip>
                                      <IconButton className="action-delete" onClick={() => handleDelete(item.id)} size="small" sx={{ color: "#ff4d49", bgcolor: "rgba(255, 77, 73, 0.05)", borderRadius: "10px" }}>
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

export default DriverNotifications;



