import React, { useEffect, useMemo, useState } from "react";
import {
  alpha,
  Avatar,
  Box,
  CircularProgress,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountBalanceWallet as WalletIcon,
  History as HistoryIcon,
  MonetizationOn as IncentiveIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import {
  extractApiResults,
  formatBankUpiLabel,
  normalizeIncentiveRecord,
  normalizeLookupKey,
} from "../../utils/deliveryIncentiveUtils";

const matchesStoreIncentive = (record, store) => {
  const details = record?.details || {};
  const storeId = normalizeLookupKey(store?.id);
  const storeName = normalizeLookupKey(store?.name);
  const candidates = [
    details.storeId,
    details.Store,
    record.store,
    record.storeName,
  ];

  return candidates.some((candidate) => {
    const normalized = normalizeLookupKey(candidate);
    if (!normalized) return false;
    return normalized === storeId || normalized === storeName;
  });
};

const StoreIncentivePayouts = () => {
  const { store } = useOutletContext();
  const storeId = store?.id;
  const storeName = store?.name;
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [incentives, setIncentives] = useState([]);

  useEffect(() => {
    const fetchIncentives = async () => {
      if (!storeId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await genericApi.getAll("deliveryboy_incentives", { limit: 500 });
        const records = extractApiResults(response)
          .map((item) => normalizeIncentiveRecord(item))
          .filter((item) => matchesStoreIncentive(item, { id: storeId, name: storeName }));
        setIncentives(records);
      } catch (error) {
        console.error("Failed to load store incentive payouts:", error);
        setIncentives([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncentives();
  }, [storeId, storeName]);

  const filteredIncentives = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return incentives;

    return incentives.filter((row) =>
      [row.name, row.phone, row.address, row.settlementStatus]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [incentives, searchTerm]);

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
            <IncentiveIcon sx={{ color: "#E53935", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#1b2559", mb: 0.5, letterSpacing: "-1.5px" }}>
              Incentive Payouts
            </Typography>
            <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
              Store-controlled incentive ledger for {storeName}.
            </Typography>
          </Box>
        </Stack>

        <Paper sx={{ p: 4, borderRadius: "24px", border: "1px solid #e0e5f2", boxShadow: "0 18px 40px rgba(15,23,42,0.04)" }}>
          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 4 }}>
            <TextField
              placeholder="Search Delivery Boy..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#a3aed0" }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: "14px", bgcolor: "#f8f9fc", width: "320px" },
              }}
            />
          </Stack>

          <TableContainer sx={{ border: "1px solid #eef2f6", borderRadius: "20px", overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#fafbfc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", width: "60px" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Delivery Boy</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Bank/UPI</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Per Order</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Total Incentive</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase" }}>Pending Incentive</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#a3aed0", fontSize: "11px", textTransform: "uppercase", textAlign: "right" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIncentives.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 12 }}>
                      <Stack alignItems="center" spacing={2.5}>
                        <Box sx={{ p: 3, borderRadius: "50%", bgcolor: alpha("#E53935", 0.05) }}>
                          <WalletIcon sx={{ color: "#E53935", fontSize: 56, opacity: 0.3 }} />
                        </Box>
                        <Box>
                          <Typography variant="h5" color="#1b2559" fontWeight="900" gutterBottom>No data found</Typography>
                          <Typography variant="body1" sx={{ color: "#a3aed0", fontWeight: 700 }}>
                            No incentive payouts recorded yet for this store.
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncentives.map((row, index) => (
                    <TableRow key={row.id || `${row.name}-${index}`} hover>
                      <TableCell sx={{ fontWeight: 800, color: "#1b2559" }}>{index + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: alpha("#E53935", 0.1), color: "#E53935" }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="800" color="#1b2559">{row.name}</Typography>
                            <Typography variant="body2" fontWeight="700" color="#707eae">{row.phone}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="700" color="#707eae">{row.address}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" fontWeight="800" sx={{ bgcolor: alpha("#05cd99", 0.08), px: 1.5, py: 0.5, borderRadius: "8px", color: "#05cd99" }}>
                          {formatBankUpiLabel(row.bankUpi)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#1b2559" }}>Rs {row.perOrderIncentive}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#1b2559" }}>Rs {row.totalIncentive}</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: "#ee5d50" }}>Rs {row.pendingIncentive}</TableCell>
                      <TableCell sx={{ textAlign: "right" }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                          <HistoryIcon sx={{ color: "#a3aed0", fontSize: 18 }} />
                          <Typography variant="body2" fontWeight="800" color="#1b2559">
                            {row.settlementStatus}
                          </Typography>
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

export default StoreIncentivePayouts;
