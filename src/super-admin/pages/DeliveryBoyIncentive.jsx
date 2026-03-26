import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  LinearProgress,
  Avatar,
  Button,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { genericApi } from "../../api/genericApi";
import { getAllDeliveryBoys } from "../../api/deliveryBoyApi";
import {
  buildSyncedIncentiveRecords,
  extractApiResults,
  formatBankUpiLabel,
  normalizeIncentiveRecord,
} from "../../utils/deliveryIncentiveUtils";

const formatDateTime = (value) => {
  if (!value) {
    return "N/A";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const DeliveryBoyIncentive = () => {
  const navigate = useNavigate();
  const [incentives, setIncentives] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [perOrderRate, setPerOrderRate] = useState(0);

  const syncIncentiveLedger = useCallback(async (showFailureAlert = false) => {
    if (showFailureAlert) {
      setSyncing(true);
    } else {
      setLoading(true);
    }

    try {
      const [
        incentivesResponse,
        completedOrdersResponse,
        storeSettingsResponse,
        deliveryBoyResponse,
      ] = await Promise.all([
        genericApi.getAll("deliveryboy_incentives", { limit: 500 }),
        genericApi.getAll("completed orders", { limit: 1000 }),
        genericApi.getAll("storeList", { limit: 500 }),
        getAllDeliveryBoys({ limit: 500 }),
      ]);

      const existingIncentives = extractApiResults(incentivesResponse);
      const completedOrders = extractApiResults(completedOrdersResponse);
      const storeDocuments = extractApiResults(storeSettingsResponse);
      const deliveryBoys = Array.isArray(deliveryBoyResponse.data?.data)
        ? deliveryBoyResponse.data.data
        : Array.isArray(deliveryBoyResponse.data)
          ? deliveryBoyResponse.data
          : [];

      const syncedAt = new Date().toISOString();
      const recordsToSync = buildSyncedIncentiveRecords({
        existingRecords: existingIncentives,
        deliveryBoys,
        completedOrders,
        perOrderIncentive: 0,
        storeDocuments,
        syncedAt,
      });

      const persistedRecords = [];

      for (const record of recordsToSync) {
        if (record.id) {
          await genericApi.update("deliveryboy_incentives", record.id, record.payload);
          persistedRecords.push({
            ...record.document,
            ...record.payload,
            _id: record.id,
          });
        } else {
          const createdResponse = await genericApi.create(
            "deliveryboy_incentives",
            record.payload
          );
          const createdDocument = createdResponse.data?._id
            ? createdResponse.data
            : createdResponse.data?.data || createdResponse.data;

          persistedRecords.push({
            ...record.document,
            ...record.payload,
            _id: createdDocument?._id || "",
          });
        }
      }

      const normalizedRecords = (
        persistedRecords.length ? persistedRecords : recordsToSync.map((item) => item.document)
      ).map((document) => normalizeIncentiveRecord(document));

      const uniqueRates = Array.from(
        new Set(normalizedRecords.map((item) => Number(item.perOrderIncentive || 0)))
      );

      setPerOrderRate(uniqueRates.length === 1 ? uniqueRates[0] : 0);
      setIncentives(normalizedRecords);
    } catch (error) {
      console.error("Error syncing incentives:", error);
      if (showFailureAlert) {
        alert(
          "Failed to sync incentive ledger. Please verify the backend server and MongoDB connection."
        );
      }
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    syncIncentiveLedger(false);
  }, [syncIncentiveLedger]);

  const filteredIncentives = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return incentives;
    }

    return incentives.filter((item) =>
      [item.name, item.phone, item.address, item.settlementStatus]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [incentives, search]);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleDownloadCSV = () => {
    if (filteredIncentives.length === 0) {
      alert("No data available to download.");
      return;
    }

    const headers = [
      "Driver Name",
      "Phone",
      "Orders Delivered",
      "Per Order Incentive",
      "Total Incentive",
      "Paid Incentive",
      "Pending Incentive",
      "Settlement Status",
      "Last Synced At",
    ];
    const csvRows = [headers.join(",")];

    filteredIncentives.forEach((item) => {
      const row = [
        `"${String(item.name || "").replace(/"/g, '""')}"`,
        `"${String(item.phone || "").replace(/"/g, '""')}"`,
        item.ordersDelivered || 0,
        item.perOrderIncentive || 0,
        item.totalIncentive || 0,
        item.paidIncentive || 0,
        item.pendingIncentive || 0,
        `"${String(item.settlementStatus || "").replace(/"/g, '""')}"`,
        `"${formatDateTime(item.lastSyncedAt)}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "driver-incentive-ledger.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalUnpaid = incentives.reduce(
    (acc, curr) => acc + (curr.pendingIncentive || 0),
    0
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box
        sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Box>
          <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
            Driver Incentives
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ fontWeight: "500" }}>
            Build and settle the live incentive ledger from completed deliveries.
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          startIcon={syncing ? <CircularProgress size={18} color="inherit" /> : <RefreshIcon />}
          onClick={() => syncIncentiveLedger(true)}
          disabled={syncing || loading}
          sx={{
            backgroundColor: "#2b3674",
            "&:hover": { backgroundColor: "#1b2559" },
            borderRadius: "14px",
            textTransform: "none",
            px: 3,
            fontWeight: "700",
          }}
        >
          {syncing ? "Syncing Ledger..." : "Sync Ledger"}
        </Button>
      </Box>

      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <Paper
          sx={{
            p: 3,
            flex: 1,
            borderRadius: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderLeft: "6px solid #ff4d49",
          }}
        >
          <Avatar sx={{ bgcolor: "#fff1f0", color: "#ff4d49", width: 56, height: 56 }}>
            <AccountBalanceWalletIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>
              TOTAL OUTSTANDING
            </Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              Rs {totalUnpaid.toLocaleString("en-IN")}
            </Typography>
          </Box>
        </Paper>
        <Paper
          sx={{
            p: 3,
            flex: 1,
            borderRadius: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderLeft: "6px solid #24d164",
          }}
        >
          <Avatar sx={{ bgcolor: "#e6f9ed", color: "#24d164", width: 56, height: 56 }}>
            <CurrencyRupeeIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>
              SETTLED DRIVERS
            </Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              {incentives.filter((item) => item.pendingIncentive === 0).length} / {incentives.length}
            </Typography>
          </Box>
        </Paper>
        <Paper
          sx={{
            p: 3,
            flex: 1,
            borderRadius: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderLeft: "6px solid #4318ff",
          }}
        >
          <Avatar sx={{ bgcolor: "#eef2ff", color: "#4318ff", width: 56, height: 56 }}>
            <DeliveryDiningIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="caption" color="#a3aed0" fontWeight="800" sx={{ letterSpacing: "1px" }}>
              STORE-CONTROLLED RATE
            </Typography>
            <Typography variant="h4" fontWeight="800" color="#1b2559">
              {perOrderRate > 0 ? `Rs ${perOrderRate.toLocaleString("en-IN")}` : "Store-wise"}
            </Typography>
          </Box>
        </Paper>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} justifyContent="space-between">
        <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
          <TextField
            size="small"
            placeholder="Search by driver, phone or settlement status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{
              flex: 1,
              maxWidth: "500px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                backgroundColor: "#fff",
                "& fieldset": { borderColor: "#e0e5f2" },
              },
            }}
          />
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Tooltip title="Print Ledger">
            <IconButton
              onClick={() => window.print()}
              sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}
            >
              <PrintIcon sx={{ color: "#2b3674" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export CSV">
            <IconButton
              onClick={handleDownloadCSV}
              sx={{ backgroundColor: "#fff", border: "1px solid #e0e5f2", borderRadius: "12px" }}
            >
              <FileDownloadIcon sx={{ color: "#2b3674" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Paper
        sx={{
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.05)",
          border: "1px solid #e0e5f2",
          background: "#fff",
        }}
      >
        {(loading || syncing) && (
          <LinearProgress sx={{ "& .MuiLinearProgress-bar": { bgcolor: "#4318ff" } }} />
        )}

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", py: 2, pl: 4, borderBottom: "1px solid #e0e5f2" }}>
                  #
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>
                  DRIVER
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>
                  PAYOUT DETAILS
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>
                  TOTAL ACCRUED
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>
                  SETTLED
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", borderBottom: "1px solid #e0e5f2" }}>
                  REMAINING
                </TableCell>
                <TableCell align="right" sx={{ backgroundColor: "#fafbfc", color: "#a3aed0", fontWeight: "800", fontSize: "11px", pr: 4, borderBottom: "1px solid #e0e5f2" }}>
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIncentives.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                    <Typography variant="body1" color="#a3aed0" fontWeight="600">
                      No incentive ledger entries available. Sync will create them from drivers and completed orders.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIncentives.map((item, index) => {
                  const isExpanded = expandedRow === item.id;
                  const isFullyPaid = item.pendingIncentive === 0;
                  const hasRecordId = Boolean(item.id);

                  return (
                    <React.Fragment key={item.id || `${item.name}-${index}`}>
                      <TableRow
                        sx={{
                          "&:hover": { bgcolor: "#f4f7fe" },
                          transition: "0.2s",
                          backgroundColor: isExpanded ? "#f4f7fe" : "inherit",
                        }}
                      >
                        <TableCell sx={{ color: "#a3aed0", fontWeight: "800", pl: 4 }}>
                          <IconButton
                            size="small"
                            onClick={() => toggleRow(item.id)}
                            sx={{ mr: 1, color: "#4318ff" }}
                          >
                            {isExpanded ? (
                              <KeyboardArrowUpIcon fontSize="small" />
                            ) : (
                              <KeyboardArrowDownIcon fontSize="small" />
                            )}
                          </IconButton>
                          {String(index + 1).padStart(2, "0")}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar
                              sx={{
                                bgcolor: isFullyPaid ? "#e6f9ed" : "#eef2ff",
                                color: isFullyPaid ? "#24d164" : "#4318ff",
                                fontWeight: "800",
                                fontSize: "14px",
                                border: "2px solid #e0e5f2",
                              }}
                            >
                              {(item.name || "U")[0].toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="800" color="#1b2559">
                                {item.name}
                              </Typography>
                              <Typography variant="caption" color="#a3aed0" fontWeight="600">
                                {item.phone}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="700" color="#475467">
                            {item.bankDetailsLabel || formatBankUpiLabel(item.bankUpi)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="800" color="#1b2559">
                            Rs {item.totalIncentive.toLocaleString("en-IN")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="800" color="#24d164">
                            Rs {item.paidIncentive.toLocaleString("en-IN")}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="subtitle2"
                            fontWeight="800"
                            color={isFullyPaid ? "#a3aed0" : "#ff4d49"}
                            sx={{ textDecoration: isFullyPaid ? "line-through" : "none" }}
                          >
                            Rs {item.pendingIncentive.toLocaleString("en-IN")}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Process Payout">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/delivery-boy-incentive/pay/${item.id}`)}
                                  disabled={isFullyPaid || !hasRecordId}
                                  sx={{
                                    color: "#fff",
                                    bgcolor: isFullyPaid || !hasRecordId ? "#e0e5f2" : "#24d164",
                                    borderRadius: "10px",
                                    width: "32px",
                                    height: "32px",
                                    "&:hover": {
                                      bgcolor:
                                        isFullyPaid || !hasRecordId ? "#e0e5f2" : "#1fb355",
                                    },
                                    transition: "0.2s",
                                  }}
                                >
                                  <PaymentIcon sx={{ fontSize: "16px" }} />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="View History">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/delivery-boy-incentive/history/${item.id}`)}
                                  disabled={!hasRecordId}
                                  sx={{
                                    color: "#fff",
                                    bgcolor: !hasRecordId ? "#e0e5f2" : "#4318ff",
                                    borderRadius: "10px",
                                    width: "32px",
                                    height: "32px",
                                    "&:hover": {
                                      bgcolor: !hasRecordId ? "#e0e5f2" : "#3311cc",
                                    },
                                    transition: "0.2s",
                                  }}
                                >
                                  <HistoryIcon sx={{ fontSize: "16px" }} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          colSpan={7}
                          sx={{ py: 0, borderBottom: isExpanded ? "1px solid #e0e5f2" : "none" }}
                        >
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 4, backgroundColor: "#fafbfc" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "flex-start",
                                  gap: 3,
                                }}
                              >
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="800" gutterBottom color="#2b3674">
                                    INCENTIVE AUDIT TRAIL
                                  </Typography>
                                  <Typography variant="body2" color="#a3aed0">
                                    This ledger is synced from completed deliveries and keeps payout history attached to the same driver record.
                                  </Typography>
                                </Box>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  disableElevation
                                  onClick={handleDownloadCSV}
                                  sx={{
                                    textTransform: "none",
                                    fontWeight: 800,
                                    color: "#4318ff",
                                    borderColor: "#e0e5f2",
                                    borderRadius: "12px",
                                  }}
                                >
                                  Download Breakdown
                                </Button>
                              </Box>
                              <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
                                <Paper
                                  sx={{
                                    p: 2,
                                    flex: 1,
                                    borderRadius: "16px",
                                    border: "1px dashed #e0e5f2",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="caption" color="#a3aed0" fontWeight="700">
                                    ORDERS DELIVERED
                                  </Typography>
                                  <Typography variant="body2" fontWeight="800" color="#1b2559">
                                    {item.ordersDelivered}
                                  </Typography>
                                </Paper>
                                <Paper
                                  sx={{
                                    p: 2,
                                    flex: 1,
                                    borderRadius: "16px",
                                    border: "1px dashed #e0e5f2",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="caption" color="#a3aed0" fontWeight="700">
                                    PER ORDER RATE
                                  </Typography>
                                  <Typography variant="body2" fontWeight="800" color="#24d164">
                                    Rs {item.perOrderIncentive.toLocaleString("en-IN")}
                                  </Typography>
                                </Paper>
                                <Paper
                                  sx={{
                                    p: 2,
                                    flex: 1,
                                    borderRadius: "16px",
                                    border: "1px dashed #e0e5f2",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="caption" color="#a3aed0" fontWeight="700">
                                    LAST SYNC
                                  </Typography>
                                  <Typography variant="body2" fontWeight="800" color="#1b2559">
                                    {formatDateTime(item.lastSyncedAt)}
                                  </Typography>
                                </Paper>
                                <Paper
                                  sx={{
                                    p: 2,
                                    flex: 1,
                                    borderRadius: "16px",
                                    border: "1px dashed #e0e5f2",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="caption" color="#a3aed0" fontWeight="700">
                                    SETTLEMENT STATUS
                                  </Typography>
                                  <Typography variant="body2" fontWeight="800" color="#1b2559">
                                    {item.settlementStatus}
                                  </Typography>
                                </Paper>
                              </Stack>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DeliveryBoyIncentive;


