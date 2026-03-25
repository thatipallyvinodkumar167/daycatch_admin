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
  Button,
  Stack,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  CircularProgress,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ErrorIcon from "@mui/icons-material/Error";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import {
  formatCurrency,
  formatDate,
  getCollectionResults,
  normalizePayoutRequest,
} from "../../utils/payoutUtils";

const defaultPayoutRules = {
  minAmount: 500,
  minDays: 7,
  _id: null,
};

const getAuditStatusChip = (status) => {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "verified") {
    return (
      <Chip
        label="Verified"
        size="small"
        sx={{ backgroundColor: "#e6f9ed", color: "#24d164", fontWeight: "700" }}
      />
    );
  }

  if (normalizedStatus === "flagged") {
    return (
      <Chip
        label="Flagged"
        size="small"
        sx={{ backgroundColor: "#fff8e6", color: "#ffb800", fontWeight: "700" }}
      />
    );
  }

  return (
    <Chip
      label="Pending Verification"
      size="small"
      sx={{ backgroundColor: "#eef2ff", color: "#4318ff", fontWeight: "700" }}
    />
  );
};

const PayoutValidation = () => {
  const navigate = useNavigate();
  const [validations, setValidations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingRules, setSavingRules] = useState(false);
  const [updatingAuditId, setUpdatingAuditId] = useState("");
  const [updatingAuditAction, setUpdatingAuditAction] = useState("");
  const [payoutRules, setPayoutRules] = useState(defaultPayoutRules);

  const fetchPayoutValidations = useCallback(async () => {
    setLoading(true);

    try {
      const [rulesResponse, requestResponse] = await Promise.all([
        genericApi.getAll("payouts", { limit: 25 }),
        genericApi.getAll("payout requests", { limit: 500 }),
      ]);

      const payoutRuleRecords = getCollectionResults(rulesResponse);
      const requestRecords = getCollectionResults(requestResponse);
      const activeRules = payoutRuleRecords[0] || {};

      setPayoutRules({
        minAmount: activeRules["Minimum Amount"] || defaultPayoutRules.minAmount,
        minDays: activeRules["Minimum Days"] || defaultPayoutRules.minDays,
        _id: activeRules._id || null,
      });

      const auditedRequests = requestRecords
        .map((item, index) => normalizePayoutRequest(item, index))
        .filter((item) => item.status.toLowerCase() === "approved");

      setValidations(auditedRequests);
    } catch (error) {
      console.error("Error fetching payout validations:", error);
      alert("Failed to load payout audit data.");
      setValidations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayoutValidations();
  }, [fetchPayoutValidations]);

  const filteredValidations = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return validations;
    }

    return validations.filter((item) => {
      return (
        item.storeName?.toLowerCase().includes(query) ||
        item.referenceId?.toLowerCase().includes(query) ||
        item.auditStatus?.toLowerCase().includes(query)
      );
    });
  }, [validations, search]);

  const handleRuleChange = (event) => {
    const { name, value } = event.target;
    setPayoutRules((currentValue) => ({ ...currentValue, [name]: value }));
  };

  const handleSaveRules = async () => {
    setSavingRules(true);

    try {
      const payload = {
        "Minimum Amount": Number(payoutRules.minAmount),
        "Minimum Days": Number(payoutRules.minDays),
      };

      if (payoutRules._id) {
        await genericApi.update("payouts", payoutRules._id, payload);
      } else {
        const response = await genericApi.create("payouts", payload);
        setPayoutRules((currentValue) => ({
          ...currentValue,
          _id: response.data?._id || currentValue._id,
        }));
      }

      alert("Payout rules updated successfully.");
    } catch (error) {
      console.error("Error updating rules:", error);
      alert("Failed to update payout rules.");
    } finally {
      setSavingRules(false);
    }
  };

  const handleAuditStatus = async (item, auditStatus) => {
    const timestamp = new Date().toISOString();
    setUpdatingAuditId(item.id);
    setUpdatingAuditAction(auditStatus);

    try {
      await genericApi.update("payout requests", item.id, {
        "Audit Status": auditStatus,
        "Audit Updated At": timestamp,
        "Audit Updated By": "Super Admin",
        ...(auditStatus === "Verified"
          ? { "Verified At": timestamp }
          : { "Flagged At": timestamp }),
      });

      setValidations((currentValue) =>
        currentValue.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                auditStatus,
                updatedAt: timestamp,
              }
            : entry
        )
      );
    } catch (error) {
      console.error(`Error marking audit as ${auditStatus}:`, error);
      alert(`Failed to mark payout as ${auditStatus}.`);
    } finally {
      setUpdatingAuditId("");
      setUpdatingAuditAction("");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Payout Audit
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Review and verify store payout history for compliance.
        </Typography>
      </Box>

      <Paper
        sx={{
          p: 4,
          borderRadius: "20px",
          mb: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h6" fontWeight="700" color="#1b2559" sx={{ mb: 3 }}>
          Payout Policies
        </Typography>
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
              Minimum Amount (₹)
            </Typography>
            <TextField
              fullWidth
              name="minAmount"
              type="number"
              value={payoutRules.minAmount}
              onChange={handleRuleChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" fontWeight="600" color="#1b2559" sx={{ mb: 1 }}>
              Payout Interval (Days)
            </Typography>
            <TextField
              fullWidth
              name="minDays"
              type="number"
              value={payoutRules.minDays}
              onChange={handleRuleChange}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              disabled={savingRules}
              onClick={handleSaveRules}
              sx={{
                backgroundColor: "#2d60ff",
                "&:hover": { backgroundColor: "#2046cc" },
                borderRadius: "10px",
                py: 1.5,
                fontWeight: "700",
                textTransform: "none",
              }}
            >
              {savingRules ? "Updating..." : "Update Rules"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper
        sx={{
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1",
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
            Audit Logs
          </Typography>
        </Box>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          sx={{ p: 3 }}
        >
          <TextField
            size="small"
            placeholder="Search by store, reference ID, or audit status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              width: "320px",
            }}
          />
        </Stack>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  #
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  STORE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  REFERENCE ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  AMOUNT
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  METHOD
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  DATE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  AUDIT STATUS
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                    pr: 4,
                  }}
                >
                  ACTIONS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : filteredValidations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No audit records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredValidations.map((item, index) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="700" color="#1b2559">
                        {item.storeName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.phone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "600" }}>
                      {item.referenceId}
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "700" }}>
                      {formatCurrency(item.paidAmount || item.requestedAmount)}
                    </TableCell>
                    <TableCell sx={{ color: "#475467" }}>
                      {item.paymentMethod}
                    </TableCell>
                    <TableCell sx={{ color: "#475467" }}>
                      {formatDate(item.updatedAt || item.requestDate)}
                    </TableCell>
                    <TableCell>{getAuditStatusChip(item.auditStatus)}</TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Verify Transaction">
                          <span>
                            <IconButton
                              onClick={() => handleAuditStatus(item, "Verified")}
                              disabled={
                                updatingAuditId === item.id ||
                                item.auditStatus.toLowerCase() === "verified"
                              }
                              sx={{
                                backgroundColor: "#e6f9ed",
                                color: "#24d164",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#d1f5db" },
                              }}
                            >
                              {updatingAuditId === item.id &&
                              updatingAuditAction === "Verified" ? (
                                <CircularProgress size={18} sx={{ color: "#24d164" }} />
                              ) : (
                                <VerifiedIcon fontSize="small" />
                              )}
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="View Receipt">
                          <span>
                            <IconButton
                              onClick={() =>
                                navigate(`/payout-requests/details/${item.id}`)
                              }
                              disabled={updatingAuditId === item.id}
                              sx={{
                                backgroundColor: "#e0e7ff",
                                color: "#4318ff",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#ced4ff" },
                              }}
                            >
                              <ReceiptLongIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Flag Error">
                          <span>
                            <IconButton
                              onClick={() => handleAuditStatus(item, "Flagged")}
                              disabled={
                                updatingAuditId === item.id ||
                                item.auditStatus.toLowerCase() === "flagged"
                              }
                              sx={{
                                backgroundColor: "#fff1f0",
                                color: "#ff4d49",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#ffccc7" },
                              }}
                            >
                              {updatingAuditId === item.id &&
                              updatingAuditAction === "Flagged" ? (
                                <CircularProgress size={18} sx={{ color: "#ff4d49" }} />
                              ) : (
                                <ErrorIcon fontSize="small" />
                              )}
                            </IconButton>
                          </span>
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
  );
};

export default PayoutValidation;


