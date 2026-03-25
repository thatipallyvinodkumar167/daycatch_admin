import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
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
  CheckCircle as ResolveIcon,
  DeleteOutline as DeleteIcon,
  PersonOutline as PersonIcon,
  Phone as PhoneIcon,
  Search as SearchIcon,
  SupportAgent as SupportIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";

const StoreCallbackRequests = ({ type = "user", title = "Callback Requests" }) => {
  const { store } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const collection = type === "user" ? "usercallbackrequests" : "deliveryboycallbackrequests";
        const response = await genericApi.getAll(collection);
        const rows = response?.data?.results || [];
        setRequests(
          rows.map((row) => ({
            id: String(row._id ?? row.id ?? ""),
            reference: row.ID || "N/A",
            name:
              row["User Name"] ||
              row["Delivery Boy Name"] ||
              "Unnamed Requester",
            phone:
              row["User Phone"] ||
              row["Delivery Boy Phone"] ||
              "No phone",
          }))
        );
      } catch (error) {
        console.error("Unable to load callback requests:", error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [type]);

  const filteredRequests = useMemo(
    () =>
      requests.filter((row) => {
        const query = searchTerm.toLowerCase();
        return (
          row.name.toLowerCase().includes(query) ||
          row.phone.toLowerCase().includes(query) ||
          row.reference.toLowerCase().includes(query)
        );
      }),
    [requests, searchTerm]
  );

  const handleResolve = async (rowId) => {
    try {
      const collection = type === "user" ? "usercallbackrequests" : "deliveryboycallbackrequests";
      await genericApi.remove(collection, rowId);
      setRequests((current) => current.filter((row) => row.id !== rowId));
      setSnackbar({ open: true, message: "Callback request resolved.", severity: "success" });
    } catch (error) {
      console.error("Unable to resolve callback request:", error);
      setSnackbar({ open: true, message: "Failed to resolve callback request.", severity: "error" });
    }
  };

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
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
            <SupportIcon sx={{ color: "#E53935", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              {title}
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Manage callback requests from {type === "user" ? "customers" : "delivery partners"} for {store.name}.
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder={`Search ${type === "user" ? "User" : "Driver"} Name or Phone...`}
              size="small"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: "350px" },
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>{type === "user" ? "User Name" : "Driver Name"}</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>{type === "user" ? "User Phone" : "Driver Phone"}</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 12 }}>
                      <Stack alignItems="center" spacing={2.5}>
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#E53935", 0.05) }}>
                          <PhoneIcon sx={{ color: "#E53935", fontSize: 56, opacity: 0.3 }} />
                        </Box>
                        <Box>
                          <Typography variant="h5" color="#1b2559" fontWeight="900" gutterBottom>No data found</Typography>
                          <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>No active {type} callback requests to display.</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((row, index) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#E53935" }}>#{row.reference}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ bgcolor: alpha("#E53935", 0.08), color: "#E53935" }}>
                            <PersonIcon fontSize="small" />
                          </Avatar>
                          <Typography variant="body1" fontWeight="800" color="#1b2559">{row.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#707eae">{row.phone}</Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Mark as Resolved">
                            <IconButton size="small" onClick={() => handleResolve(row.id)} sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", borderRadius: "10px" }}>
                              <ResolveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Call Now">
                            <IconButton size="small" onClick={() => handleCall(row.phone)} sx={{ bgcolor: alpha("#E53935", 0.1), color: "#E53935", borderRadius: "10px" }}>
                              <PhoneIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton className="action-delete" size="small" onClick={() => handleResolve(row.id)} sx={{ color: "#ee5d50", bgcolor: alpha("#ee5d50", 0.08), borderRadius: "10px" }}>
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

export default StoreCallbackRequests;
