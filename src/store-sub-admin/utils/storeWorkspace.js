export const normalizeStoreValue = (value) => String(value || "").trim().toLowerCase();

export const matchesStoreRecord = (record, store) => {
  const storeId = normalizeStoreValue(store?.id);
  const storeName = normalizeStoreValue(store?.name);

  return [
    record?.storeId,
    record?.Store,
    record?.store,
    record?.storeName,
    record?.["Store Name"],
    record?.Details?.Store,
    record?.Details?.store,
    record?.["Select store"],
  ].some((candidate) => {
    const normalizedCandidate = normalizeStoreValue(candidate);
    return Boolean(
      normalizedCandidate &&
        ((storeId && normalizedCandidate === storeId) ||
          (storeName &&
            (normalizedCandidate === storeName ||
              normalizedCandidate.includes(storeName) ||
              storeName.includes(normalizedCandidate))))
    );
  });
};

export const formatStoreDate = (value) => {
  if (!value) return "N/A";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
