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
  Stack,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CampaignIcon from "@mui/icons-material/Campaign";
import axios from "axios";

const UserNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts?_limit=8"
      );
      
      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        title: item.title.slice(0, 30),
        message: item.body.slice(0, 50) + "...",
        date: "2024-03-16",
        time: "10:30 AM",
        status: index % 3 === 0 ? "Draft" : "Sent",
      }));

      setNotifications(formattedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const filtered = notifications.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase().trim()) ||
    item.message.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          History of sent and scheduled user notifications.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">User Notifications List</Typography>
          <TextField
            size="small"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "280px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Title</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Message</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Schedule/Sent</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item, index) => (
                <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                  <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#1b2559" }}>{item.title}</TableCell>
                  <TableCell sx={{ color: "#475467", maxWidth: "250px" }}>{item.message}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600" color="#1b2559">{item.date}</Typography>
                    <Typography variant="caption" color="textSecondary">{item.time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                        label={item.status} 
                        size="small" 
                        sx={{ 
                            backgroundColor: item.status === "Sent" ? "#e6f9ed" : "#f4f7fe", 
                            color: item.status === "Sent" ? "#24d164" : "#2b3674",
                            fontWeight: "700" 
                        }} 
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton sx={{ 
                            backgroundColor: "#2d60ff", 
                            color: "#fff", 
                            borderRadius: "10px",
                            "&:hover": { backgroundColor: "#2046cc" }
                        }}>
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton sx={{ 
                            backgroundColor: "#ff4d49", 
                            color: "#fff", 
                            borderRadius: "10px",
                            "&:hover": { backgroundColor: "#e03e3e" }
                        }}>
                            <DeleteIcon fontSize="small" />
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