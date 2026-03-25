import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";
import {
  CameraAltOutlined as CameraIcon,
  Check as AcceptIcon,
  Close as RejectIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import { formatStoreDate, matchesStoreRecord } from "../utils/storeWorkspace";

const StoreOrderByPhoto = () => {
  const { store } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [previewRequest, setPreviewRequest] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchRequests = useCallback(async () => {
    try {
      const response = await genericApi.getAll("order_by_photo_requests");
      const rows = response?.data?.results || response?.data?.data || [];
      setRequests(
        rows
          .filter((row) => matchesStoreRecord(row, store))
          .map((row, index) => ({
            id: String(row._id ?? row.id ?? index),
            userName: row["User Name"] || row.userName || "Unknown User",
            userPhone: row["User Phone"] || row.userPhone || "",
            address: row.Address || row.address || "N/A",
            photo: row.Photo || row.photo || row.imageUrl || "",
            status: row.Status || row.status || "Pending",
            createdAt: row["Created At"] || row.createdAt || "",
          }))
      );
    } catch (error) {
      console.error("Unable to load order-by-photo requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [store]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) =>
        [request.userName, request.userPhone, request.address].some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [requests, searchTerm]
  );

  const handleStatusUpdate = async (request, status) => {
    try {
      await genericApi.update("order_by_photo_requests", request.id, { Status: status });
      await fetchRequests();
      setSnackbar({ open: true, message: `Request marked as ${status}.`, severity: "success" });
    } catch (error) {
      console.error("Unable to update order-by-photo request:", error);
      setSnackbar({ open: true, message: "Failed to update request.", severity: "error" });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#E53935" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Box sx={{ p: 2, borderRadius: "18px", bgcolor: alpha("#E53935", 0.08) }}>
             <CameraIcon sx={{ color: "#E53935", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Order By Photo List
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Manage grocery lists uploaded by users via photo for {store.name}.
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder="Search by User..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: "320px" }
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Accept/Reject</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                      <Stack alignItems="center" spacing={2.5}>
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#E53935", 0.05) }}>
                          <CameraIcon sx={{ color: "#E53935", fontSize: 56, opacity: 0.3 }} />
                        </Box>
                        <Box>
                           <Typography variant="h5" color="#1b2559" fontWeight="900" gutterBottom>No data found</Typography>
                           <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>No customers have uploaded shopping photos yet.</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((row, index) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: alpha("#E53935", 0.1), color: "#E53935" }}><PersonIcon /></Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="800" color="#1b2559">{row.userName}</Typography>
                            <Typography variant="caption" color="#a3aed0" fontWeight="700">{row.userPhone || "N/A"}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                         <Typography variant="body2" fontWeight="700" color="#707eae" sx={{ maxWidth: "300px" }}>{row.address}</Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0" }}>{formatStoreDate(row.createdAt)}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: row.status === "Accepted" ? "#05cd99" : row.status === "Rejected" ? "#ee5d50" : "#1b2559" }}>
                        {row.status}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5}>
                          <Tooltip title="Accept Order">
                            <IconButton size="small" onClick={() => handleStatusUpdate(row, "Accepted")} sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", borderRadius: "10px", "&:hover": { bgcolor: "#05cd99", color: "#fff" } }}>
                               <AcceptIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject Order">
                            <IconButton size="small" onClick={() => handleStatusUpdate(row, "Rejected")} sx={{ bgcolor: alpha("#ee5d50", 0.1), color: "#ee5d50", borderRadius: "10px", "&:hover": { bgcolor: "#ee5d50", color: "#fff" } }}>
                               <RejectIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Photo">
                             <IconButton size="small" onClick={() => setPreviewRequest(row)} sx={{ color: "#E53935" }}><ViewIcon fontSize="small" /></IconButton>
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

      <Dialog
        open={Boolean(previewRequest)}
        onClose={() => setPreviewRequest(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px" } }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: "#1b2559" }}>
          Order Photo Preview
        </DialogTitle>
        <DialogContent>
          {previewRequest?.photo ? (
            <Box
              component="img"
              src={previewRequest.photo}
              alt={previewRequest.userName}
              sx={{ width: "100%", borderRadius: "16px", border: "1px solid #e0e5f2" }}
            />
          ) : (
            <Typography color="#a3aed0" fontWeight="700">No photo available.</Typography>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreOrderByPhoto;
