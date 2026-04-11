// Volatile memory storage to ensure login on refresh as requested
let memoryToken = "";
let memoryRefreshToken = "";
let memoryRole = "";
let memoryScope = "platform";
let memoryStoreId = "";
let memoryStoreName = "";
let memoryStatus = "Active";
let memoryAssignedCityIds = [];

export const getAuthSession = () => ({
  token: memoryToken,
  refreshToken: memoryRefreshToken,
  role: memoryRole,
  scope: memoryScope,
  storeId: memoryStoreId,
  storeName: memoryStoreName,
  status: memoryStatus,
  assignedCityIds: memoryAssignedCityIds,
});

export const getAssignedStorePath = () => {
  const { storeId } = getAuthSession();
  return storeId ? `/stores/details/${encodeURIComponent(storeId)}/dashboard` : "/stores-list";
};

export const setAuthSession = ({ token, refreshToken, user }) => {
  memoryToken = token || "";
  memoryRefreshToken = refreshToken || "";
  memoryRole = user?.["role Name"] || user?.roleName || user?.role || "Super Admin";
  memoryScope = user?.scope || "platform";
  memoryStoreId = user?.storeId || "";
  memoryStoreName = user?.storeName || "";
  memoryStatus = user?.status || "Active";
  memoryAssignedCityIds = Array.isArray(user?.assignedCityIds) ? user.assignedCityIds : [];

  // Optionally keep user_email or user_name in localStorage for cosmetic reasons
  // but the 'secret' tokens are memory-only now.
  localStorage.setItem("user_email", user?.Email || "");
  localStorage.setItem("user_name", user?.Name || "");
};

export const clearAuthSession = () => {
  memoryToken = "";
  memoryRefreshToken = "";
  memoryRole = "";
  memoryScope = "platform";
  memoryStoreId = "";
  memoryStoreName = "";
  memoryStatus = "Active";
  memoryAssignedCityIds = [];
  
  [
    "user_email",
    "user_name",
  ].forEach((key) => localStorage.removeItem(key));
};

export const updateTokens = ({ token, refreshToken }) => {
  if (token) memoryToken = token;
  if (refreshToken) memoryRefreshToken = refreshToken;
};
