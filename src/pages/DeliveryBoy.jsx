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
  Button,
  Stack,
  IconButton,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { getAllDeliveryBoys, deleteDeliveryBoy } from "../api/deliveryBoyApi";
import {
  formatDeliveryBoyStatus,
  isDeliveryBoyOffDuty,
} from "../utils/deliveryBoy";

const DeliveryBoy = () => {
  const navigate = useNavigate();
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      const response = await getAllDeliveryBoys();
      const list = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      setDeliveryBoys(list);
    } catch (error) {
      console.error("Error fetching delivery boys:", error);
    }
  };

  const filteredBoys = React.useMemo(() => {
    return deliveryBoys.filter(
      (item) =>
        (item.boyName || item.name)
          ?.toLowerCase()
          .includes(search.toLowerCase().trim()) ||
        (item.boyMobile || item.phone)
          ?.toLowerCase()
          .includes(search.toLowerCase().trim())
    );
  }, [deliveryBoys, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this delivery boy?")) {
      try {
        await deleteDeliveryBoy(id);
        setDeliveryBoys((prev) =>
          prev.filter((item) => item._id !== id && item.id !== id)
        );
        alert("Delivery boy deleted successfully!");
      } catch (error) {
        console.error("Error deleting delivery boy:", error);
        alert("Failed to delete delivery boy.");
      }
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Here is your admin panel.
        </Typography>
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
            Delivery Boy List
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/delivery-boy-list/add")}
            sx={{
              backgroundColor: "#2d60ff",
              "&:hover": { backgroundColor: "#2046cc" },
              borderRadius: "8px",
              textTransform: "none",
              px: 3,
              fontWeight: "600",
            }}
          >
            Add New Boy
          </Button>
        </Box>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          sx={{ p: 3 }}
        >
          <Typography variant="body2" sx={{ mr: 1, fontWeight: "500" }}>
            Search:
          </Typography>
          <TextField
            size="small"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              width: "280px",
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
                  Boy Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  Boy Phone
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  Boy Password
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  Orders
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "700",
                    color: "#a3aed0",
                    borderBottom: "2px solid #e0e5f2",
                  }}
                >
                  Details
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
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBoys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No delivery boys found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBoys.map((item, index) => {
                  const isOffDuty = isDeliveryBoyOffDuty(item.status);

                  return (
                    <TableRow
                      key={item._id || item.id}
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ color: "#1b2559", fontWeight: "600" }}>
                        {item.boyName || item.name}
                      </TableCell>
                      <TableCell sx={{ color: "#475467" }}>
                        {item.boyMobile || item.phone}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#475467",
                          fontStyle: "italic",
                          fontSize: "12px",
                        }}
                      >
                        {item.boyPassword || item.password || "--"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatDeliveryBoyStatus(item.status)}
                          size="small"
                          sx={{
                            backgroundColor: isOffDuty ? "#fff1f0" : "#e6f9ed",
                            color: isOffDuty ? "#ff4d49" : "#24d164",
                            fontWeight: "700",
                            borderRadius: "6px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          onClick={() =>
                            navigate(
                              `/delivery-boy-list/orders/${item._id || item.id}`
                            )
                          }
                          sx={{
                            color: "#2d60ff",
                            fontWeight: "700",
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {item.orders ?? 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() =>
                            navigate(
                              `/delivery-boy-list/details/${item._id || item.id}`
                            )
                          }
                          sx={{
                            backgroundColor: "#2d60ff",
                            color: "white",
                            borderRadius: "10px",
                            "&:hover": { backgroundColor: "#2046cc" },
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            onClick={() =>
                              navigate(
                                `/delivery-boy-list/edit/${item._id || item.id}`
                              )
                            }
                            sx={{
                              backgroundColor: "#00d26a",
                              color: "white",
                              borderRadius: "10px",
                              "&:hover": { backgroundColor: "#00b85c" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(item._id || item.id)}
                            sx={{
                              backgroundColor: "#ff4d49",
                              color: "white",
                              borderRadius: "10px",
                              "&:hover": { backgroundColor: "#e03e3a" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
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

export default DeliveryBoy;
