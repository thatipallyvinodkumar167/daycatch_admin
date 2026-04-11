import React, { useState, useEffect, createContext, useContext } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Outlet, useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import StoreSidebar from "../components/StoreSidebar";
import StoreTopbar from "../components/StoreTopbar";
import { SIDEBAR_WIDTH, TOPBAR_HEIGHT } from "../config/navigation";
import { genericApi } from "../../api/genericApi";
import { getAssignedStorePath, getAuthSession } from "../../utils/authSession";
import { SHELL_CONTENT_BG } from "../../utils/adminShell";

const StoreContext = createContext();
const STORE_CACHE_PREFIX = "store-workspace:";
const STORE_ROUTE_META = {
  dashboard: "Sub-Admin Dashboard",
  "delivery-charges": "Delivery Charges",
  "reports/item-requirement": "Item Requirement",
  "reports/sales-report": "Item Sales Report",
  "notifications/users": "User Notifications",
  "notifications/driver": "Driver Notifications",
  coupons: "Store Coupons",
  "add-coupon": "Add Coupon",
  "payout-requests": "Payout Requests",
  "banners/category": "Category Banners",
  "banners/category/add": "Add Category Banner",
  "banners/product": "Product Banners",
  "banners/product/add": "Add Product Banner",
  products: "Store Products",
  "products/add": "Add Store Product",
  "catalog/products": "Admin Category/Product",
  "catalog/update-pricing": "Update Price and MRP",
  "catalog/update-stock": "Update Stock",
  "catalog/update-order-quantity": "Update Order Quantity",
  "catalog/deals": "Deal Products",
  "catalog/deals/add": "Add Deal Product",
  "catalog/spotlight": "Add Spotlight",
  "catalog/bulk-update": "Bulk Update",
  "orders/all": "All Orders",
  "orders/pending": "Pending Orders",
  "orders/cancelled": "Cancelled Orders",
  "orders/confirmed": "Confirmed Orders",
  "orders/out-for-delivery": "Out For Delivery Orders",
  "orders/payment-failed": "Payment Failed Orders",
  "orders/completed": "Completed Orders",
  "orders/missed": "Missed Orders",
  "orders/day-wise": "Day Wise Orders",
  "orders/today": "Today's Orders",
  "orders/next-day": "Next-Day Orders",
  "order-by-photo": "Order By Photo",
  "delivery/boys": "Delivery Boys",
  "delivery/boys/add": "Add Delivery Boy",
  "delivery/incentives": "Delivery Boy Incentives",
  "callback/users": "User Callback Requests",
  "callback/drivers": "Driver Callback Requests",
  settings: "Store Settings",
};

const getStoreHelmetMeta = (pathname, storeName) => {
  const detailsMarker = "/stores/details/";
  const markerIndex = pathname.indexOf(detailsMarker);
  const normalizedStoreName = storeName && storeName !== "Unknown" ? storeName : "Assigned Store";

  if (markerIndex === -1) {
    return {
      title: `DayCatch | ${normalizedStoreName} | Store Sub-Admin`,
      description: `Operational workspace for the ${normalizedStoreName} store sub-admin.`,
    };
  }

  const workspacePath = pathname.slice(markerIndex + detailsMarker.length).split("/").slice(1).join("/");
  const normalizedWorkspacePath = workspacePath || "dashboard";

  let sectionTitle = STORE_ROUTE_META[normalizedWorkspacePath];

  if (!sectionTitle) {
    if (normalizedWorkspacePath.startsWith("products/edit/")) {
      sectionTitle = "Edit Store Product";
    } else if (normalizedWorkspacePath.startsWith("orders/details/")) {
      sectionTitle = "Order Details";
    } else {
      sectionTitle = "Store Workspace";
    }
  }

  return {
    title: `DayCatch | ${normalizedStoreName} | ${sectionTitle}`,
    description: `${sectionTitle} workspace for ${normalizedStoreName} store sub-admin operations in DayCatch.`,
  };
};

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
  const location = useLocation();
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
      navigate(getAssignedStorePath(), { replace: true });
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
          name: record.store_name || record["Store Name"] || record.name || storeNameRaw || "Unnamed Store",
          logo: record.store_photo || record["Profile Pic"] || record.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(storeNameRaw || "S")}&background=4318ff&color=fff`,
          // Add other fields you might need in child components
          owner: record.employee_name || record["Employee Name"] || "N/A",
          phone: record.phone_number || record.Mobile || "N/A",
          email: record.email || record.Email || "N/A",
          city: record.city || record.City || "N/A",
          address: record.address || record.Address || "N/A",
          status: record.status || "Active",
          adminShare: record.admin_share || record["Admin Share"] || 0,
          startTime: record.store_opening_time || record["Start Time"] || record.startTime || "N/A",
          endTime: record.store_closing_time || record["End Time"] || record.endTime || "N/A",
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

  const helmetMeta = getStoreHelmetMeta(location.pathname, store?.name || storeNameRaw);

  return (
    <StoreContext.Provider value={store}>
      <Helmet>
        <title>{helmetMeta.title}</title>
        <meta name="description" content={helmetMeta.description} />
        <meta name="robots" content="noindex,nofollow" />
        <meta property="og:title" content={helmetMeta.title} />
        <meta property="og:description" content={helmetMeta.description} />
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
