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
  Avatar,
  LinearProgress,
  Chip,
  Button,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { genericApi } from "../../api/genericApi";
import { useNavigate } from "react-router-dom";

const StoreEarningPaments = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("storepayments");
      const results = response.data?.results || response.data || [];

      const formatted = results
        .map((store, index) => {
        const totalRevenue = store.total_revenue || store["Total Revenue"] || store.totalRevenue || store.revenue || 0;
        const alreadyPaid = store.already_paid || store["Already Paid"] || store.alreadyPaid || store.paid || 0;
        const pending = totalRevenue - alreadyPaid;
        return {
          id: store.store_id || store._id || index,
          name: store.store_name || store["Store Name"] || store.name || "Unnamed Store",
          address: store.address || store.Address || store.City || store.city || "N/A",
          logo: store.profile_pic || store["Profile Pic"] || store.logo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(store.store_name || store["Store Name"] || store.name || "S")}&background=4318ff&color=fff`,
          totalRevenue,
          alreadyPaid,
          pendingBalance: pending < 0 ? 0 : pending,
        };
      });

      setStores(formatted);
    } catch (error) {
      console.error("Error fetching store earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase().trim()) ||
    s.address.toLowerCase().includes(search.toLowerCase().trim())
  );

  const totalRevenue = stores.reduce((sum, s) => sum + s.totalRevenue, 0);
  const totalPaid = stores.reduce((sum, s) => sum + s.alreadyPaid, 0);
  const totalPending = stores.reduce((sum, s) => sum + s.pendingBalance, 0);

  const fmt = (val) => `RS ${Number(val).toLocaleString("en-IN")}`;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>

      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
            <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
                Store Earnings
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 0.5 }}>
                Monitor store revenue and payment status.
            </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate("/store-approval")}
          startIcon={<HowToRegIcon />}
          sx={{
            backgroundColor: "#24d164",
            "&:hover": { backgroundColor: "#1fb355" },
            borderRadius: "16px",
            textTransform: "none",
            px: 4,
            py: 1.5,
            fontWeight: "800",
            boxShadow: "0 10px 20px rgba(36, 209, 100, 0.2)",
          }}
        >
          Store Approvals
        </Button>
      </Box>

      {/* Summary Cards */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Revenue", value: fmt(totalRevenue), icon: <AccountBalanceWalletIcon />, color: "#4318ff", bg: "#e0e7ff" },
          { label: "Already Paid", value: fmt(totalPaid), icon: <CurrencyRupeeIcon />, color: "#24d164", bg: "#e6f9ed" },
          { label: "Pending Balance", value: fmt(totalPending), icon: <HourglassTopIcon />, color: "#ff9500", bg: "#fff4e5" },
          { label: "Total Stores", value: stores.length, icon: <StorefrontIcon />, color: "#2d60ff", bg: "#e8eeff" },
        ].map((stat) => (
          <Paper key={stat.label} sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ p: 1.5, borderRadius: "12px", backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary" fontWeight="600">{stat.label}</Typography>
                <Typography variant="h5" fontWeight="800" color="#1b2559">{stat.value}</Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Table */}
      <Paper sx={{ borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>

        {/* Table Header Bar */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Box>
            <Typography variant="h6" fontWeight="700" color="#1b2559">Store Earnings</Typography>
            <Typography variant="caption" color="textSecondary">{filtered.length} stores</Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TextField
              size="small"
              placeholder="Search by store or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "280px" }}
            />
          </Stack>
        </Box>

        {loading && <LinearProgress />}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", width: 60 }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>STORE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>ADDRESS</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>REVENUE</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>PAID</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>BALANCE</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#a3aed0" }}>
                    <StorefrontIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1, display: "block", mx: "auto" }} />
                    No stores found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((store, index) => (
                  <TableRow key={store.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          src={store.logo}
                          sx={{ width: 36, height: 36, borderRadius: "8px", border: "2px solid #f4f7fe" }}
                        />
                        <Typography fontWeight="700" color="#1b2559" fontSize="14px">{store.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#475467", maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>{store.address}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="700" color="#4318ff">{fmt(store.totalRevenue)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={fmt(store.alreadyPaid)}
                        size="small"
                        sx={{ backgroundColor: "#e6f9ed", color: "#24d164", fontWeight: "700", borderRadius: "8px" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={fmt(store.pendingBalance)}
                        size="small"
                        sx={{
                          backgroundColor: store.pendingBalance > 0 ? "#fff4e5" : "#f4f7fe",
                          color: store.pendingBalance > 0 ? "#ff9500" : "#a3aed0",
                          fontWeight: "700",
                          borderRadius: "8px",
                        }}
                      />
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

export default StoreEarningPaments;


