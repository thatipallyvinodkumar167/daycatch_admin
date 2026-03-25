import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  alpha,
  CircularProgress,
  TextField,
  InputAdornment,
  Tooltip,
  Avatar
} from "@mui/material";
import {
  Search as SearchIcon,
  PhoneInTalk as CallIcon,
  CheckCircle as ResolveIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  SupportAgent as SupportIcon,
  CallMade as CallOutIcon
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreCallbackRequests = ({ type, title }) => {
  const { store } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [requests] = useState([]); // Default empty for "No data found"

  useEffect(() => {
    // Simulating loading
    setTimeout(() => setLoading(false), 500);
  }, [type]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#4318ff" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box sx={{ p: 2, borderRadius: "18px", bgcolor: alpha("#4318ff", 0.08) }}>
             <SupportIcon sx={{ color: "#4318ff", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              {title}
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
               Manage callback requests from {type === "user" ? "customers" : "delivery partners"} for {store.name}.
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder={`Search ${type === "user" ? "User" : "Driver"} Name or Phone...`}
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#a3aed0" }} /></InputAdornment>,
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: "350px" }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>{type === "user" ? "User Name" : "Driver Name"}</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>{type === "user" ? "User Phone" : "Driver Phone"}</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                      <Stack alignItems="center" spacing={2.5}>
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#4318ff", 0.05) }}>
                          <CallIcon sx={{ color: "#4318ff", fontSize: 56, opacity: 0.3 }} />
                        </Box>
                        <Box>
                           <Typography variant="h5" color="#1b2559" fontWeight="900" gutterBottom>No data found</Typography>
                           <Typography variant="body2" color="#a3aed0" fontWeight="600">No active {type} callback requests to display.</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((row, index) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#4318ff" }}>#{row.id}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ bgcolor: alpha("#4318ff", 0.08), color: "#4318ff" }}><PersonIcon fontSize="small" /></Avatar>
                          <Typography variant="body1" fontWeight="800" color="#1b2559">{row.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                         <Typography variant="body2" fontWeight="700" color="#707eae">{row.phone}</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Mark as Resolved">
                            <IconButton size="small" sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", borderRadius: "10px" }}><ResolveIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <Tooltip title="Call Now">
                            <IconButton size="small" sx={{ bgcolor: alpha("#4318ff", 0.1), color: "#4318ff", borderRadius: "10px" }}><CallOutIcon fontSize="small" /></IconButton>
                          </Tooltip>
                          <IconButton size="small" sx={{ color: "#ee5d50" }}><DeleteIcon fontSize="small" /></IconButton>
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
    </Box>
  );
};

export default StoreCallbackRequests;
