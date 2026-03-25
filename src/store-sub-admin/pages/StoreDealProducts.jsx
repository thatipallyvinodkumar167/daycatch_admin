import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
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
  Typography,
  alpha,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Error as ErrorIcon,
  LocalFireDepartment as HotIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { storeWorkspaceApi } from "../../api/storeWorkspaceApi";

const StoreDealProducts = () => {
  const { store } = useOutletContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [deals, setDeals] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await storeWorkspaceApi.getDeals(store.id);
        setDeals(response?.data?.data || []);
      } catch (error) {
        console.error("Unable to load store deals:", error);
        setSnackbar({ open: true, message: "Failed to load deal products.", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    if (store?.id) {
      fetchDeals();
    }
  }, [store?.id]);

  const orderPanelSx = {
    borderRadius: "24px",
    border: "1px solid #e0e5f2",
    bgcolor: "#fff",
    boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
  };

  const handleDelete = async (deal) => {
    setDeletingId(deal.id);
    try {
      await storeWorkspaceApi.deleteDeal(store.id, deal.productId || deal.id);
      setDeals((current) => current.filter((row) => row.id !== deal.id));
      setSnackbar({ open: true, message: "Deal removed successfully.", severity: "success" });
    } catch (error) {
      console.error("Unable to delete deal:", error);
      setSnackbar({ open: true, message: "Failed to remove deal.", severity: "error" });
    } finally {
      setDeletingId("");
    }
  };

  const filteredDeals = useMemo(
    () =>
      deals.filter((deal) =>
        String(deal.productName || "").toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [deals, searchTerm]
  );

  const StatusChip = ({ status }) => {
    const normalizedStatus = String(status).toLowerCase();
    if (normalizedStatus === "active") {
      return (
        <Chip
          label="Active"
          size="small"
          icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
          sx={{ bgcolor: alpha("#05cd99", 0.1), color: "#05cd99", fontWeight: 800, borderRadius: "10px" }}
        />
      );
    }
    if (normalizedStatus === "expired") {
      return (
        <Chip
          label="Expired"
          size="small"
          icon={<ErrorIcon sx={{ fontSize: "14px !important" }} />}
          sx={{ bgcolor: alpha("#ee5d50", 0.1), color: "#ee5d50", fontWeight: 800, borderRadius: "10px" }}
        />
      );
    }
    return (
      <Chip
        label="Scheduled"
        size="small"
        icon={<ScheduleIcon sx={{ fontSize: "14px !important" }} />}
        sx={{ bgcolor: alpha("#1b2559", 0.1), color: "#1b2559", fontWeight: 800, borderRadius: "10px" }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#E53935" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>
        
        <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Deal Products
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Manage limited-time offers and discounts for {store.name}.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("add")}
            sx={{
              borderRadius: "12px",
              py: 1.5,
              px: 4,
              bgcolor: "#1b2559",
              boxShadow: "0 10px 20px rgba(27, 37, 89, 0.2)",
              textTransform: "none",
              fontWeight: 800,
              fontSize: "15px",
              "&:hover": { bgcolor: "#111c44" },
            }}
          >
            + Create Deal
          </Button>
        </Box>

        <Paper sx={{ p: 4, ...orderPanelSx }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }} flexWrap="wrap" useFlexGap>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              Deals Overview
            </Typography>
            <TextField
              placeholder="Search deals..."
              size="small"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: { xs: "100%", sm: "320px" } },
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Deal Price</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>From Date</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>To Date</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", textAlign: "right" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDeals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                      <Stack alignItems="center" spacing={2}>
                        <Box sx={{ p: 2, borderRadius: "50%", bgcolor: "#fdf8f8" }}>
                          <HotIcon sx={{ color: "#ee5d50", fontSize: 48 }} />
                        </Box>
                        <Typography variant="h6" color="#a3aed0" fontWeight="800">
                          No data found
                        </Typography>
                        <Typography variant="body2" color="#a3aed0" fontWeight="600">
                          You haven&apos;t launched any deal products yet.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeals.map((row, index) => (
                    <TableRow key={row.id} hover sx={{ transition: "0.2s", "&:hover": { bgcolor: alpha("#1b2559", 0.02) } }}>
                      <TableCell sx={{ fontWeight: 800, color: "#a3aed0" }}>{index + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{row.productName}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#1b2559" }}>Rs. {row.dealPrice}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0", fontSize: "13px" }}>
                        {row.fromDate ? new Date(row.fromDate).toLocaleString() : "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#a3aed0", fontSize: "13px" }}>
                        {row.toDate ? new Date(row.toDate).toLocaleString() : "N/A"}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={row.status} />
                      </TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            className="action-edit"
                            size="small"
                            sx={{ color: "#1b2559", bgcolor: alpha("#1b2559", 0.05), borderRadius: "10px" }}
                            onClick={() => navigate("add", { state: { deal: row } })}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            className="action-delete"
                            size="small"
                            onClick={() => handleDelete(row)}
                            disabled={deletingId === row.id}
                            sx={{ color: "#E53935", bgcolor: alpha("#E53935", 0.05), borderRadius: "10px" }}
                          >
                            {deletingId === row.id ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon fontSize="small" />}
                          </IconButton>
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
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: "12px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StoreDealProducts;
