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
  Divider,
  CircularProgress,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useNavigate } from "react-router-dom";
import { genericApi } from "../../api/genericApi";
import {
  formatCurrency,
  getCollectionResults,
  normalizePayoutRequest,
} from "../../utils/payoutUtils";

const defaultPayoutRules = {
  minAmount: 500,
  minDays: 7,
};

const PayoutRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [payoutRules, setPayoutRules] = useState(defaultPayoutRules);

  const fetchPayoutRequests = useCallback(async () => {
    setLoading(true);

    try {
      const [requestsResponse, rulesResponse] = await Promise.all([
        genericApi.getAll("payout requests", { limit: 500 }),
        genericApi.getAll("payouts", { limit: 25 }),
      ]);

      const requestRecords = getCollectionResults(requestsResponse);
      const payoutRuleRecords = getCollectionResults(rulesResponse);
      const currentRules = payoutRuleRecords[0] || {};

      setPayoutRules({
        minAmount: currentRules["Minimum Amount"] || defaultPayoutRules.minAmount,
        minDays: currentRules["Minimum Days"] || defaultPayoutRules.minDays,
      });

      const actionableRequests = requestRecords
        .map((item, index) => normalizePayoutRequest(item, index))
        .filter((item) => {
          const normalizedStatus = item.status.toLowerCase();
          return normalizedStatus !== "approved" && normalizedStatus !== "rejected";
        });

      setRequests(actionableRequests);
    } catch (error) {
      console.error("Error fetching payout requests:", error);
      alert("Failed to load payout requests.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayoutRequests();
  }, [fetchPayoutRequests]);

  const filteredRequests = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return requests;
    }

    return requests.filter((item) => {
      return (
        item.storeName?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.address?.toLowerCase().includes(query)
      );
    });
  }, [requests, search]);

  const handleReject = async (request) => {
    if (
      !window.confirm(
        `Are you sure you want to reject the payout request for ${request.storeName}?`
      )
    ) {
      return;
    }

    const timestamp = new Date().toISOString();
    setProcessingId(request.id);

    try {
      await genericApi.update("payout requests", request.id, {
        Status: "Rejected",
        "Rejected Reason": "Rejected by super admin review",
        "Rejected At": timestamp,
        "Rejected By": "Super Admin",
        "Audit Status": "Rejected",
        "Audit Updated At": timestamp,
      });

      setRequests((currentValue) =>
        currentValue.filter((item) => item.id !== request.id)
      );
      alert("Payout request rejected successfully.");
    } catch (error) {
      console.error("Error rejecting payout request:", error);
      alert("Failed to reject payout request.");
    } finally {
      setProcessingId("");
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="700" color="#2b3674">
            Payout Requests
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Review and authorize payouts for stores based on their earnings.
          </Typography>
        </Box>
        <Paper
          sx={{
            p: 2,
            borderRadius: "12px",
            border: "1px solid #e0e5f2",
            backgroundColor: "#fff",
          }}
        >
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="caption" color="textSecondary" fontWeight="600">
                MIN. PAYOUT
              </Typography>
              <Typography variant="body2" fontWeight="700" color="#2b3674">
                {formatCurrency(payoutRules.minAmount)}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="caption" color="textSecondary" fontWeight="600">
                PAYOUT INTERVAL
              </Typography>
              <Typography variant="body2" fontWeight="700" color="#2b3674">
                {payoutRules.minDays} Days
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

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
            Request Queue
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
            placeholder="Search by store, phone, or address..."
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
                  ADDRESS
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  REVENUE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  BANK DETAILS
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  PAID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  BALANCE
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  REQUESTED
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
                  <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    No payout requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((item, index) => (
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
                    <TableCell sx={{ color: "#475467", maxWidth: "150px" }}>
                      {item.address}
                    </TableCell>
                    <TableCell sx={{ color: "#2b3674", fontWeight: "700" }}>
                      {formatCurrency(item.totalRevenue)}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#1b2559",
                            fontWeight: "600",
                            backgroundColor: "#f4f7fe",
                            px: 1,
                            py: 0.5,
                            borderRadius: "4px",
                          }}
                        >
                          {item.bankDetails.summary}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#24d164", fontWeight: "700" }}>
                      {formatCurrency(item.alreadyPaid)}
                    </TableCell>
                    <TableCell sx={{ color: "#ff4d49", fontWeight: "700" }}>
                      {formatCurrency(item.pendingBalance)}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: "#2d60ff",
                        fontWeight: "800",
                        fontSize: "15px",
                      }}
                    >
                      {formatCurrency(item.requestedAmount)}
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Process Payment">
                          <span>
                            <IconButton
                              onClick={() =>
                                navigate(`/payout-requests/process/${item.id}`)
                              }
                              disabled={processingId === item.id}
                              sx={{
                                backgroundColor: "#e6f9ed",
                                color: "#24d164",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#d1f5db" },
                              }}
                            >
                              <PaymentsIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <span>
                            <IconButton
                              onClick={() =>
                                navigate(`/payout-requests/details/${item.id}`)
                              }
                              disabled={processingId === item.id}
                              sx={{
                                backgroundColor: "#e0e7ff",
                                color: "#4318ff",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#ced4ff" },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Reject Request">
                          <span>
                            <IconButton
                              onClick={() => handleReject(item)}
                              disabled={processingId === item.id}
                              sx={{
                                backgroundColor: "#fff1f0",
                                color: "#ff4d49",
                                borderRadius: "8px",
                                "&:hover": { backgroundColor: "#ffccc7" },
                              }}
                            >
                              {processingId === item.id ? (
                                <CircularProgress size={18} sx={{ color: "#ff4d49" }} />
                              ) : (
                                <CancelIcon fontSize="small" />
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

export default PayoutRequests;


