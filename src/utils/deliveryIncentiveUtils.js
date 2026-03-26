export const formatCurrency = (amount) =>
  `Rs ${Number(amount || 0).toLocaleString("en-IN")}`;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

export const extractApiResults = (response) =>
  response?.data?.results || response?.data?.data || response?.data || [];

export const normalizeLookupKey = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

export const formatBankUpiLabel = (bankUpi) => {
  if (!bankUpi) return "N/A";

  if (typeof bankUpi === "string") {
    return bankUpi;
  }

  const upi = bankUpi.upi || bankUpi.UPI;
  const accountNumber = bankUpi.accountNumber || bankUpi.accountNo;
  const ifsc = bankUpi.ifsc || bankUpi.IFSC;

  if (upi) {
    return `UPI: ${upi}`;
  }

  if (accountNumber || ifsc) {
    return `A/C: ${accountNumber || "N/A"} | IFSC: ${ifsc || "N/A"}`;
  }

  return "N/A";
};

export const normalizeIncentiveHistory = (history = []) =>
  (Array.isArray(history) ? history : [])
    .map((entry, index) => ({
      id: entry.id || entry._id || `${entry.referenceId || entry.ref || "txn"}-${index}`,
      date: entry.date || entry.createdAt || new Date().toISOString(),
      amount: Number(entry.amount || entry.Amount || 0),
      method: entry.method || entry.paymentMethod || entry["Payment Method"] || "N/A",
      ref: entry.ref || entry.referenceId || entry["Reference ID"] || "N/A",
      notes: entry.notes || entry.remarks || "",
      status: entry.status || "Success",
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

export const resolvePerOrderIncentive = (configDocuments = []) => {
  const configs = Array.isArray(configDocuments) ? configDocuments : [];
  const activeConfig =
    configs.find((item) => item?.active !== false && item?.Active !== false) ||
    configs[0] ||
    {};

  return toNumber(
    activeConfig?.perOrder ??
      activeConfig?.["Per Order Incentive"] ??
      activeConfig?.amountPerOrder ??
      activeConfig?.Amount ??
      activeConfig?.value,
    0
  );
};

export const resolveStoreControlledIncentive = (storeDocument = {}) =>
  toNumber(
    storeDocument?.["Driver Incentive"] ??
      storeDocument?.driverIncentive ??
      storeDocument?.Details?.["Driver Incentive"] ??
      storeDocument?.Details?.driverIncentive,
    0
  );

const extractStoreIdentity = (document = {}) => ({
  id: document?.id || document?._id || document?.storeId || "",
  name:
    document?.["Store Name"] ||
    document?.Store ||
    document?.storeName ||
    document?.name ||
    "",
});

const buildStoreIncentiveIndex = (storeDocuments = []) => {
  const index = new Map();

  (Array.isArray(storeDocuments) ? storeDocuments : []).forEach((storeDocument) => {
    const identity = extractStoreIdentity(storeDocument);
    const incentive = resolveStoreControlledIncentive(storeDocument);
    const entry = {
      id: String(identity.id || ""),
      name: identity.name || "",
      driverIncentive: incentive,
    };

    const keys = [normalizeLookupKey(entry.id), normalizeLookupKey(entry.name)].filter(Boolean);
    keys.forEach((key) => index.set(key, entry));
  });

  return index;
};

export const extractDeliveryBoyProfile = (driver = {}) => {
  const details = normalizeObject(driver.Details || driver.details);

  return {
    name:
      driver["Boy Name"] ||
      driver["Delivery Boy"] ||
      driver.boyName ||
      driver.name ||
      "",
    phone:
      driver["Boy Phone"] ||
      driver.Phone ||
      driver.Mobile ||
      driver.phone ||
      driver.boyMobile ||
      "N/A",
    address:
      details["Boy Address"] ||
      details.address ||
      driver.Address ||
      driver.address ||
      "N/A",
    bankUpi:
      driver["Bank/UPI"] ??
      details["Bank/UPI"] ??
      details.bankUpi ??
      details.upi ??
      null,
    city: details.City || details.city || driver.City || driver.city || "",
    store: details.Store || details.store || driver.Store || driver.store || "",
  };
};

export const extractDeliveryBoyNameFromOrder = (order = {}) =>
  order["Boy Name"] ||
  order["Delivery Boy"] ||
  order.Assign ||
  order["Assign"] ||
  order.deliveryBoy ||
  order["Boy"] ||
  "";

const buildCompletedOrderIndex = (completedOrders = []) => {
  const completedIndex = new Map();

  (Array.isArray(completedOrders) ? completedOrders : []).forEach((order) => {
    const name = extractDeliveryBoyNameFromOrder(order);
    const key = normalizeLookupKey(name);

    if (!key) {
      return;
    }

    const current = completedIndex.get(key) || {
      completedCount: 0,
      lastDeliveryDate: null,
      rawName: name,
      storeName: "",
      storeId: "",
    };

    current.completedCount += 1;
    current.rawName = current.rawName || name;
    current.storeName =
      current.storeName ||
      order?.Store ||
      order?.["Store Name"] ||
      order?.storeName ||
      order?.Details?.Store ||
      "";
    current.storeId =
      current.storeId ||
      order?.storeId ||
      order?.StoreId ||
      order?.storeID ||
      "";

    const candidateDate =
      order["Delivery Date"] || order.deliveryDate || order.updatedAt || order.createdAt;

    if (
      candidateDate &&
      (!current.lastDeliveryDate ||
        new Date(candidateDate).getTime() > new Date(current.lastDeliveryDate).getTime())
    ) {
      current.lastDeliveryDate = candidateDate;
    }

    completedIndex.set(key, current);
  });

  return completedIndex;
};

export const buildSyncedIncentiveRecords = ({
  existingRecords = [],
  deliveryBoys = [],
  completedOrders = [],
  perOrderIncentive = 0,
  storeDocuments = [],
  syncedAt = new Date().toISOString(),
}) => {
  const existingByKey = new Map();
  const deliveryBoyByKey = new Map();
  const completedOrderIndex = buildCompletedOrderIndex(completedOrders);
  const storeIncentiveIndex = buildStoreIncentiveIndex(storeDocuments);
  const keys = new Set();

  (Array.isArray(existingRecords) ? existingRecords : []).forEach((record) => {
    const key = normalizeLookupKey(record?.["Delivery Boy"]);
    if (!key) return;
    existingByKey.set(key, record);
    keys.add(key);
  });

  (Array.isArray(deliveryBoys) ? deliveryBoys : []).forEach((driver) => {
    const profile = extractDeliveryBoyProfile(driver);
    const key = normalizeLookupKey(profile.name);
    if (!key) return;
    deliveryBoyByKey.set(key, profile);
    keys.add(key);
  });

  completedOrderIndex.forEach((_, key) => keys.add(key));

  return Array.from(keys)
    .map((key) => {
      const existingRecord = existingByKey.get(key) || {};
      const driverProfile = deliveryBoyByKey.get(key) || {};
      const completedSummary = completedOrderIndex.get(key) || {};
      const normalizedExisting = normalizeIncentiveRecord(existingRecord);
      const normalizedExistingDetails = normalizeObject(existingRecord?.Details);
      const resolvedStoreName =
        driverProfile.store ||
        completedSummary.storeName ||
        normalizedExistingDetails.Store ||
        "";
      const resolvedStoreId =
        normalizedExistingDetails.storeId ||
        completedSummary.storeId ||
        "";
      const matchedStoreSetting =
        storeIncentiveIndex.get(normalizeLookupKey(resolvedStoreId)) ||
        storeIncentiveIndex.get(normalizeLookupKey(resolvedStoreName)) ||
        null;
      const resolvedPerOrderIncentive = matchedStoreSetting
        ? matchedStoreSetting.driverIncentive
        : toNumber(
            existingRecord?.["Per Order Incentive"] ?? perOrderIncentive,
            0
          );

      const completedCount = Math.max(
        toNumber(completedSummary.completedCount, 0),
        toNumber(existingRecord?.["Orders Delivered"], 0)
      );
      const computedTotal = completedCount * resolvedPerOrderIncentive;
      const paidIncentive = normalizedExisting.paidIncentive;
      const outstandingFloor = paidIncentive + normalizedExisting.pendingIncentive;
      const totalIncentive = Math.max(
        computedTotal,
        normalizedExisting.totalIncentive,
        outstandingFloor
      );
      const pendingIncentive = Math.max(totalIncentive - paidIncentive, 0);
      const settlementStatus =
        pendingIncentive === 0
          ? "Settled"
          : paidIncentive > 0
            ? "Partially Settled"
            : "Pending";

      const payload = {
        "Delivery Boy":
          existingRecord?.["Delivery Boy"] ||
          driverProfile.name ||
          completedSummary.rawName ||
          "Unassigned Driver",
        Phone: existingRecord?.Phone || driverProfile.phone || "N/A",
        Address: existingRecord?.Address || driverProfile.address || "N/A",
        "Bank/UPI":
          existingRecord?.["Bank/UPI"] ?? driverProfile.bankUpi ?? "Not Added",
        "Total Incentive": totalIncentive,
        "Paid Incentive": paidIncentive,
        "Pending Incentive": pendingIncentive,
        "Orders Delivered": completedCount,
        "Per Order Incentive": resolvedPerOrderIncentive,
        "Settlement Status": settlementStatus,
        "Sync Source": "completed orders",
        "Last Synced At": syncedAt,
        "Last Delivery Date":
          completedSummary.lastDeliveryDate ||
          existingRecord?.["Last Delivery Date"] ||
          null,
        Details: {
          ...normalizedExistingDetails,
          City:
            driverProfile.city ||
            normalizedExistingDetails.City ||
            "",
          Store:
            resolvedStoreName || normalizedExistingDetails.Store || "",
          storeId: resolvedStoreId || normalizedExistingDetails.storeId || "",
        },
        History: normalizeIncentiveHistory(
          existingRecord?.History || existingRecord?.history || []
        ),
      };

      const document = {
        ...existingRecord,
        ...payload,
        _id: existingRecord?._id || "",
      };

      return {
        key,
        id: existingRecord?._id || "",
        payload,
        document,
      };
    })
    .filter((record) => normalizeLookupKey(record?.payload?.["Delivery Boy"]));
};

export const normalizeIncentiveRecord = (document) => {
  const totalIncentive = Number(document?.["Total Incentive"] || 0);
  const paidIncentive = Number(document?.["Paid Incentive"] || 0);
  const pendingIncentive =
    document?.["Pending Incentive"] != null
      ? Number(document["Pending Incentive"] || 0)
      : Math.max(totalIncentive - paidIncentive, 0);

  return {
    id: document?._id || "",
    name: document?.["Delivery Boy"] || "N/A",
    phone: document?.Phone || document?.Mobile || "N/A",
    address: document?.Address || "N/A",
    bankUpi: document?.["Bank/UPI"] || null,
    bankDetailsLabel: formatBankUpiLabel(document?.["Bank/UPI"]),
    totalIncentive,
    paidIncentive,
    pendingIncentive,
    ordersDelivered: toNumber(document?.["Orders Delivered"] || 0),
    perOrderIncentive: toNumber(document?.["Per Order Incentive"] || 0),
    settlementStatus: document?.["Settlement Status"] || "Pending",
    syncSource: document?.["Sync Source"] || "N/A",
    lastSyncedAt: document?.["Last Synced At"] || null,
    lastDeliveryDate: document?.["Last Delivery Date"] || null,
    details: normalizeObject(document?.Details),
    history: normalizeIncentiveHistory(document?.History || document?.history || []),
  };
};
