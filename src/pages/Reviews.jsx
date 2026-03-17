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
  Rating,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/comments?_limit=12"
      );
      const products = ["Organic Milk 1L", "Farm Fresh Eggs", "A2 Ghee", "Basmati Rice", "Cold Pressed Oil", "Green Tea"];
      const formattedData = response.data.map((item, index) => ({
        id: item.id,
        reviewer: item.email,
        product: products[index % products.length],
        review: item.body.slice(0, 80) + "...",
        rating: Math.floor(Math.random() * 2) + 3,
        status: index % 5 === 0 ? "Hidden" : "Published",
        date: `2024-03-${10 + (index % 18)}`,
        avatar: `https://ui-avatars.com/api/?name=${item.email}&background=random`,
      }));
      setReviews(formattedData);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleToggleStatus = (id) => {
    setReviews(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === "Published" ? "Hidden" : "Published" }
          : item
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this review?")) {
      setReviews(prev => prev.filter(item => item.id !== id));
    }
  };

  const filtered = reviews.filter(item =>
    item.reviewer.toLowerCase().includes(search.toLowerCase().trim()) ||
    item.product.toLowerCase().includes(search.toLowerCase().trim())
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Manage customer reviews and product ratings.
        </Typography>
      </Box>

      {/* Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ mb: 4 }}>
        {[
          { label: "Total Reviews", value: reviews.length, color: "#2d60ff" },
          { label: "Avg Rating", value: `⭐ ${avgRating}`, color: "#ffb800" },
          { label: "Published", value: reviews.filter(r => r.status === "Published").length, color: "#24d164" },
          { label: "Hidden", value: reviews.filter(r => r.status === "Hidden").length, color: "#ff4d49" },
        ].map((s) => (
          <Paper key={s.label} sx={{ flex: 1, p: 3, borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <Typography variant="caption" color="textSecondary" fontWeight="600">{s.label}</Typography>
            <Typography variant="h5" fontWeight="800" color={s.color}>{s.value}</Typography>
          </Paper>
        ))}
      </Stack>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f1f1" }}>
          <Typography variant="h6" fontWeight="600" color="#1b2559">Product Reviews</Typography>
          <TextField
            size="small"
            placeholder="Search by reviewer or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" }, width: "300px" }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Reviewer</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Product</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Rating</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Review</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0" }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: "700", color: "#a3aed0", pr: 4 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}>No reviews found</TableCell></TableRow>
              ) : (
                filtered.map((item, index) => (
                  <TableRow key={item.id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500" }}>{index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={item.avatar} sx={{ width: 32, height: 32, fontSize: "12px" }} />
                        <Typography variant="caption" color="#2d60ff" fontWeight="600">{item.reviewer}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "600", maxWidth: "130px" }}>{item.product}</TableCell>
                    <TableCell>
                      <Rating value={item.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell sx={{ color: "#475467", maxWidth: "200px", fontSize: "12px" }}>{item.review}</TableCell>
                    <TableCell sx={{ color: "#475467" }}>{item.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          backgroundColor: item.status === "Published" ? "#e6f9ed" : "#fff1f0",
                          color: item.status === "Published" ? "#24d164" : "#ff4d49",
                          fontWeight: "700"
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 3 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title={item.status === "Published" ? "Hide Review" : "Publish Review"}>
                          <IconButton
                            onClick={() => handleToggleStatus(item.id)}
                            sx={{
                              backgroundColor: item.status === "Published" ? "#fff8e6" : "#e6f9ed",
                              color: item.status === "Published" ? "#ffb800" : "#24d164",
                              borderRadius: "8px"
                            }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Review">
                          <IconButton
                            onClick={() => handleDelete(item.id)}
                            sx={{ backgroundColor: "#fff1f0", color: "#ff4d49", borderRadius: "8px" }}
                          >
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
  );
};

export default Reviews;