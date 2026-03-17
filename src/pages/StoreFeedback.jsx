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
} from "@mui/material";
import axios from "axios";

const StoreFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [search, setSearch] = useState("");

  // API Call (using JSONPlaceholder as fakeapi)
  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      // Fetching comments as mock data for user feedback
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/comments?_limit=20"
      );
      
      // Map fake data to our columns (#, Users, Feedback)
      const formattedData = response.data.map(item => ({
        id: item.id,
        user: item.email, // Using email as the user identifier
        feedback: item.body,
      }));

      setFeedbackList(formattedData);
    } catch (error) {
      console.error("Error fetching user feedback:", error);
    }
  };

  const filteredFeedback = React.useMemo(() => {
    return feedbackList.filter((item) =>
      item.user?.toLowerCase().includes(search.toLowerCase().trim()) ||
      item.feedback?.toLowerCase().includes(search.toLowerCase().trim())
    );
  }, [feedbackList, search]);

  return (
    <Box sx={{ p: 4, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* Page Heading */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="#2b3674">
          Hi, Day Catch Super Admin Panel.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Here is your admin panel.
        </Typography>
      </Box>

      <Paper sx={{ borderRadius: "15px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        
        {/* Card Header */}
        <Box 
          sx={{ 
            p: 3, 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            borderBottom: "1px solid #f1f1f1"
          }}
        >
          <Typography variant="h6" fontWeight="600" color="#1b2559">
         Store Feedback
          </Typography>
        </Box>

        {/* Toolbar (Search) */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={1}
          sx={{ p: 3 }}
        >
          <Typography variant="body2" sx={{ mr: 1 }}>Search:</Typography>
          <TextField
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ 
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              width: "250px"
            }}
          />
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#fafbfc" }}>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2", width: "80px" }}>#</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2", width: "250px" }}>Store</TableCell>
                <TableCell sx={{ fontWeight: "700", color: "#a3aed0", borderBottom: "2px solid #e0e5f2" }}>Feedback</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeedback.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    No feedback found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeedback.map((item, index) => (
                  <TableRow 
                    key={item.id} 
                    sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                  >
                    <TableCell sx={{ color: "#1b2559", fontWeight: "500", py: 2 }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ color: "#2d60ff", fontWeight: "600" }}>
                      {item.user}
                    </TableCell>
                    <TableCell sx={{ color: "#1b2559", fontWeight: "400", lineHeight: "1.5" }}>
                      {item.feedback}
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

export default StoreFeedback;
