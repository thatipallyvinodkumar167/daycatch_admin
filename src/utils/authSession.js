export const getAuthSession = () => ({
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  role: localStorage.getItem("user_role") || "",
  scope: localStorage.getItem("user_scope") || "platform",
  storeId: localStorage.getItem("user_store_id") || "",
  storeName: localStorage.getItem("user_store_name") || "",
  status: localStorage.getItem("user_status") || "Active",
});

export const getAssignedStorePath = () => {
  const { storeId } = getAuthSession();
  return storeId ? `/stores/details/${encodeURIComponent(storeId)}/dashboard` : "/";
};

export const setAuthSession = ({ token, refreshToken, user }) => {
  const role = user?.["role Name"] || user?.roleName || user?.role || "Manager";
  const scope = user?.scope || "platform";
  const storeId = user?.storeId || "";
  const storeName = user?.storeName || "";
  const status = user?.status || "Active";

  localStorage.setItem("token", token || "");
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken); // only update if provided (login/refresh)
  localStorage.setItem("user_role", role);
  localStorage.setItem("user_email", user?.Email || "");
  localStorage.setItem("user_name", user?.Name || "");
  localStorage.setItem("user_scope", scope);
  localStorage.setItem("user_store_id", storeId);
  localStorage.setItem("user_store_name", storeName);
  localStorage.setItem("user_status", status);
};

export const clearAuthSession = () => {
  [
    "token",
    "refreshToken",
    "user_role",
    "user_email",
    "user_name",
    "user_scope",
    "user_store_id",
    "user_store_name",
    "user_status",
  ].forEach((key) => localStorage.removeItem(key));
};
