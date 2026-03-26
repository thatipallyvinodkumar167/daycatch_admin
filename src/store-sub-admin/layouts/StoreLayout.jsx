import React, { useState, useEffect, createContext, useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Outlet, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import StoreSidebar from "../components/StoreSidebar";
import StoreTopbar from "../components/StoreTopbar";
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from "../config/navigation";
import { genericApi } from "../../api/genericApi";
import { getAssignedStorePath, getAuthSession } from "../../utils/authSession";
import { SHELL_CONTENT_BG } from "../../utils/adminShell";

const StoreContext = createContext();
const STORE_CACHE_PREFIX = "store-workspace:";

export const useStore = () => useContext(StoreContext);

const createFallbackStore = (storeId, storeNameRaw) => ({
  id: storeId,
  name: storeNameRaw || "Unknown",
  logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(storeNameRaw || "S")}&background=E53935&color=fff`,
});

const getCachedStore = (storeId, storeNameRaw) => {
  if (!storeId) return null;

  try {
    const cachedValue = sessionStorage.getItem(`${STORE_CACHE_PREFIX}${storeId}`);
    if (cachedValue) {
      return JSON.parse(cachedValue);
    }
  } catch (error) {
    console.error("Unable to read cached store workspace:", error);
  }

  return storeNameRaw ? createFallbackStore(storeId, storeNameRaw) : null;
};

function StoreLayout() {
  const { id } = useParams(); // For /stores/details/:id
  const [searchParams] = useSearchParams();
  const storeIdFromQuery = searchParams.get("storeId");
  const storeNameRaw = searchParams.get("storeName");
  const navigate = useNavigate();

  const activeStoreId = id || storeIdFromQuery;
  const initialStore = getCachedStore(activeStoreId, storeNameRaw);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(!initialStore);
  const [store, setStore] = useState(initialStore);

  useEffect(() => {
    const { scope, storeId: assignedStoreId } = getAuthSession();
    if (scope === "store" && assignedStoreId && String(activeStoreId) !== String(assignedStoreId)) {
      navigate(getAssignedStorePath(), { replace: true });
      return;
    }

    if (!activeStoreId) {
      navigate("/stores-list");
      return;
    }

    const cachedStore = getCachedStore(activeStoreId, storeNameRaw);
    if (cachedStore) {
      setStore(cachedStore);
      setLoading(false);
    } else {
      setLoading(true);
    }

    const fetchStore = async () => {
      try {
        const response = await genericApi.getOne("storeList", activeStoreId);
        const record = response.data || {};
        const storeData = {
          id: record._id || record.id || activeStoreId,
          name: record["Store Name"] || record.name || storeNameRaw || "Unnamed Store",
          logo: record["Profile Pic"] || record.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(storeNameRaw || "S")}&background=4318ff&color=fff`,
          // Add other fields you might need in child components
          owner: record["Employee Name"] || "N/A",
          phone: record.Mobile || "N/A",
          email: record.Email || "N/A",
          city: record.City || "N/A",
          address: record.Address || "N/A",
          status: record.status || "Active",
          adminShare: record["Admin Share"] || 0,
          startTime: record["Start Time"] || "N/A",
          endTime: record["End Time"] || "N/A",
        };
        sessionStorage.setItem(`${STORE_CACHE_PREFIX}${storeData.id}`, JSON.stringify(storeData));
        setStore(storeData);
      } catch (error) {
        console.error("Error fetching store:", error);
        setStore((current) => current || createFallbackStore(activeStoreId, storeNameRaw));
      } finally {
        setLoading(false);
      }
    };
    fetchStore();
  }, [activeStoreId, storeNameRaw, navigate]);

  if (loading && !store) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f4f7fe" }}>
        <CircularProgress sx={{ color: "#E53935" }} />
      </Box>
    );
  }

  return (
    <StoreContext.Provider value={store}>
      <Helmet>
        <title>{`DayCatch | ${store?.name || "Store Admin"}`}</title>
        <meta name="description" content={`Management workspace for ${store?.name || "DayCatch stores"}.`} />
      </Helmet>
      <Box className="store-shell" sx={{ display: "flex" }}>
        <StoreTopbar
          store={store}
          onToggleSidebar={() => setSidebarOpen((current) => !current)}
        />
        <StoreSidebar store={store} open={sidebarOpen} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            mt: `${TOPBAR_HEIGHT}px`,
            ml: { xs: 0, lg: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0 },
            minHeight: "100vh",
            backgroundColor: SHELL_CONTENT_BG,
            transition: "margin 0.3s ease",
            overflowX: "hidden",
          }}
        >
          <Outlet context={{ store }} />
        </Box>
      </Box>
    </StoreContext.Provider>
  );
}

export default StoreLayout;
