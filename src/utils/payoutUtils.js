const hasValue = (value) => value !== undefined && value !== null && value !== "";

export const toNumber = (value, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.replace(/[^0-9.-]/g, "");
    const parsedValue = Number(normalizedValue);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return fallback;
};

export const formatCurrency = (value) =>
  `${String.fromCharCode(8377)}${toNumber(value, 0).toLocaleString("en-IN")}`;

export const formatDate = (value, includeTime = false) => {
  if (!value) {
    return "N/A";
  }

  const dateValue = new Date(value);

  if (Number.isNaN(dateValue.getTime())) {
    return "N/A";
  }

  return dateValue.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
        }
      : {}),
  });
};

export const getCollectionResults = (response) => {
  const payload = response?.data;

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
};

export const extractBankDetails = (bankDetails) => {
  if (typeof bankDetails === "string") {
    return {
      summary: bankDetails || "N/A",
      accountNumber: "N/A",
      ifsc: "N/A",
      branch: "N/A",
      upi: "N/A",
    };
  }

  if (!bankDetails || typeof bankDetails !== "object") {
    return {
      summary: "N/A",
      accountNumber: "N/A",
      ifsc: "N/A",
      branch: "N/A",
      upi: "N/A",
    };
  }

  const accountNumber =
    bankDetails.accountNumber ||
    bankDetails["Account Number"] ||
    bankDetails.accountNo ||
    bankDetails.number ||
    "N/A";

  const ifsc =
    bankDetails.ifsc || bankDetails.IFSC || bankDetails["IFSC Code"] || "N/A";

  const branch = bankDetails.branch || bankDetails.Branch || "N/A";
  const upi = bankDetails.upi || bankDetails.UPI || bankDetails["UPI ID"] || "N/A";

  const summaryParts = [];

  if (hasValue(accountNumber) && accountNumber !== "N/A") {
    summaryParts.push(`A/C: ${accountNumber}`);
  }

  if (hasValue(ifsc) && ifsc !== "N/A") {
    summaryParts.push(`IFSC: ${ifsc}`);
  }

  if (hasValue(upi) && upi !== "N/A") {
    summaryParts.push(`UPI: ${upi}`);
  }

  return {
    summary: summaryParts.join(" | ") || "N/A",
    accountNumber,
    ifsc,
    branch,
    upi,
  };
};

export const normalizePayoutRequest = (item, index = 0) => {
  const totalRevenue = toNumber(item?.["Total Revenue"], 0);
  const alreadyPaid = toNumber(item?.["Already Paid"] ?? item?.["Paid Amount"], 0);
  const requestedAmount = toNumber(item?.Amount ?? item?.["Requested Amount"], 0);
  const explicitPendingBalance = item?.["Pending Balance"];
  const pendingBalance = hasValue(explicitPendingBalance)
    ? toNumber(explicitPendingBalance, 0)
    : Math.max(totalRevenue - alreadyPaid, requestedAmount, 0);

  const status = item?.Status || "Pending";
  const normalizedStatus = typeof status === "string" ? status : "Pending";
  const auditStatus =
    item?.["Audit Status"] ||
    (normalizedStatus.toLowerCase() === "approved"
      ? "Pending Verification"
      : "N/A");
  const bankDetails = extractBankDetails(
    item?.["Bank Account Details"] ||
      item?.["Bank Details"] ||
      item?.["Bank/UPI"]
  );

  return {
    id: item?._id || `payout-${index + 1}`,
    storeName: item?.Store || item?.["Store Name"] || "Direct Store",
    phone: item?.Phone || item?.Mobile || "N/A",
    address: item?.Address || "N/A",
    totalRevenue,
    alreadyPaid,
    pendingBalance,
    requestedAmount,
    status: normalizedStatus,
    auditStatus,
    requestDate: item?.["Requested At"] || item?.createdAt || item?.updatedAt || null,
    updatedAt: item?.updatedAt || item?.["Approved At"] || null,
    paymentMethod: item?.["Payment Method"] || "N/A",
    referenceId: item?.["Reference ID"] || "N/A",
    notes: item?.Notes || "",
    rejectedReason: item?.["Rejected Reason"] || "",
    paidAmount: toNumber(item?.["Paid Amount"], requestedAmount),
    bankDetails,
    raw: item,
  };
};
