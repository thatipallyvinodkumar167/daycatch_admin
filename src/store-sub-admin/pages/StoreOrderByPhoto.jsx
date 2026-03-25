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
  Avatar,
  IconButton,
  Button,
  alpha,
  CircularProgress,
  Tooltip,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  CameraAltOutlined as CameraIcon,
  Check as AcceptIcon,
  Close as RejectIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreOrderByPhoto = () => {
  const { store } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [requests] = useState([]); // Default empty for "No data found"

  useEffect(() => {
    // Simulating loading
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#4318ff" }} /></Box>;

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ maxWidth: "1420px", mx: "auto" }}>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box sx={{ p: 2, borderRadius: "18px", bgcolor: alpha("#4318ff", 0.08) }}>
             <CameraIcon sx={{ color: "#4318ff", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-1.5px" }}>
              Order By Photo List
            </Typography>
            <Typography variant="body2" color="#a3aed0" fontWeight="600">
               Manage grocery lists uploaded by users via photo for {store.name}.
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "28px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder="Search by User..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#a3aed0" }} /></InputAdornment>,
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: "320px" }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Accept/Reject</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 12 }}>
                      <Stack alignItems="center" spacing={2.5}>
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#4318ff", 0.05) }}>
                          <CameraIcon sx={{ color: "#4318ff", fontSize: 56, opacity: 0.3 }} />
                        </Box>
                        <Box>
                           <Typography variant="h5" color="#1b2559" fontWeight="900" gutterBottom>No data found</Typography>
                           <Typography variant="body2" color="#a3aed0" fontWeight="600">No customers have uploaded shopping photos yet.</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((row, index) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: alpha("#4318ff", 0.1), color: "#4318ff" }}><PersonIcon /></Avatar>
                          <Typography variant="body1" fontWeight="800" color="#1b2559">{row.userName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                         <Typography variant="body2" fontWeight="700" color="#707eae" sx={{ maxWidth: "300px" }}>{row.address}</Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5}>
                          <Tooltip title="Accept Order">
                            <IconButton size="small" sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", borderRadius: "10px", "&:hover": { bgcolor: "#05cd99", color: "#fff" } }}>
                               <AcceptIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject Order">
                            <IconButton size="small" sx={{ bgcolor: alpha("#ee5d50", 0.1), color: "#ee5d50", borderRadius: "10px", "&:hover": { bgcolor: "#ee5d50", color: "#fff" } }}>
                               <RejectIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Photo">
                             <IconButton size="small" sx={{ color: "#4318ff" }}><ViewIcon fontSize="small" /></IconButton>
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
    </Box>
  );
};

export default StoreOrderByPhoto;
