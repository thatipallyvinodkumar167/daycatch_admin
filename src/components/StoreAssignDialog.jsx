import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { genericApi } from "../api/genericApi";

const StoreAssignDialog = ({ open, onClose, onAssign, orderId }) => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchStores();
    }
  }, [open]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await genericApi.getAll("storeList");
      const results = response.data.results || response.data || [];
      setStores(results);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStores = stores.filter((s) => {
    const name = (s["Store Name"] || s.name || "").toLowerCase();
    const city = (s.City || s.city || "").toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || city.includes(query);
  });

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="xs"
      sx={{ "& .MuiDialog-paper": { borderRadius: "24px", p: 1 } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Box>
            <Typography variant="h6" fontWeight="900" color="#1b2559">Assign Store</Typography>
            <Typography variant="caption" color="#a3aed0" fontWeight="700">Order ID: {orderId}</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#ff4d49", bgcolor: "#fff1f0", borderRadius: "10px" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ mt: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#a3aed0", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            mb: 2,
            "& .MuiOutlinedInput-root": { borderRadius: "14px", bgcolor: "#f4f7fe", "& fieldset": { borderColor: "#e0e5f2" } }
          }}
        />
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} sx={{ color: "#4318ff" }} />
          </Box>
        ) : (
          <List sx={{ maxHeight: "350px", overflow: "auto", pr: 1 }}>
            {filteredStores.length === 0 ? (
                <Typography variant="body2" color="#a3aed0" textAlign="center" py={4}>No stores found.</Typography>
            ) : (
                filteredStores.map((store) => (
                    <ListItem 
                      key={store._id} 
                      button 
                      onClick={() => onAssign(store)}
                      sx={{ 
                        borderRadius: "16px", 
                        mb: 1, 
                        border: "1px solid #e0e5f2",
                        "&:hover": { bgcolor: "#f4f7fe", borderColor: "#4318ff" }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={store["Profile Pic"] || store.logo} 
                          sx={{ borderRadius: "10px", bgcolor: "#eef2ff", color: "#4318ff" }}
                        >
                          <StorefrontIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={<Typography variant="body1" fontWeight="800" color="#1b2559">{store["Store Name"] || store.name}</Typography>}
                        secondary={<Typography variant="caption" color="#a3aed0" fontWeight="600">{store.City || store.city}</Typography>}
                      />
                    </ListItem>
                ))
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoreAssignDialog;
