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
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
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
        image: "https://via.placeholder.com/50",
        user: "John Doe " + (index + 1),
        message: item.body.slice(0, 50) + "...",
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
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Image</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>User</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Notification Text</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item, index) => (
                <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                  <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: "700", color: "#1b2559" }}>{item.title}</TableCell>
                  <TableCell>
                    <img src={item.image} alt="Notification" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600", color: "#2b3674" }}>{item.user}</TableCell>
                  <TableCell sx={{ color: "#475467", maxWidth: "250px" }}>{item.message}</TableCell>
                  <TableCell align="right" sx={{ pr: 3 }}>
                    <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                        <IconButton sx={{ 
                            backgroundColor: "#22c55e", 
                            color: "#fff", 
                            borderRadius: "8px",
                            width: "35px",
                            height: "35px",
                            "&:hover": { backgroundColor: "#16a34a" }
                        }}>
                            <EditIcon sx={{ fontSize: "20px" }} />
                        </IconButton>
                        <Button 
                            variant="contained" 
                            disableElevation
                            sx={{ 
                                backgroundColor: "#ff4d4f", 
                                color: "#fff", 
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: "600",
                                minWidth: "70px",
                                height: "35px",
                                "&:hover": { backgroundColor: "#e03e3e" }
                            }}
                        >
                            Close
                        </Button>
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