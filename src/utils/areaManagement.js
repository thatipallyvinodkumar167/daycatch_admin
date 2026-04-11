const isPresent = (value) => value !== undefined && value !== null && value !== "";

const normalizeString = (value, fallback = "") => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
};

const toTitleCase = (value) =>
  value
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());

const compactObject = (value) =>
  Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => isPresent(entryValue))
  );

const dedupePayloads = (payloads) => {
  const seen = new Set();

  return payloads.filter((payload) => {
    const compacted = compactObject(payload);
    const key = JSON.stringify(compacted);

    if (!Object.keys(compacted).length || seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

export const unwrapApiPayload = (value) => {
  let currentValue = value;
  let depth = 0;

  while (
    currentValue &&
    typeof currentValue === "object" &&
    !Array.isArray(currentValue) &&
    Object.prototype.hasOwnProperty.call(currentValue, "data") &&
    depth < 5
  ) {
    currentValue = currentValue.data;
    depth += 1;
  }

  return currentValue;
};

export const extractCollection = (response, preferredKeys = []) => {
    const payload = unwrapApiPayload(response);

    if (Array.isArray(payload)) {
        return payload;
    }

    if (!payload || typeof payload !== "object") {
        return [];
    }

    const allPreferredKeys = [...preferredKeys, "data", "results"];

    for (const key of allPreferredKeys) {
        if (Array.isArray(payload[key])) {
            return payload[key];
        }
    }

    const firstArray = Object.values(payload).find((entry) => Array.isArray(entry));
    return Array.isArray(firstArray) ? firstArray : [];
};

export const pickFirstValue = (source, keys = []) => {
  if (!source || typeof source !== "object") {
    return undefined;
  }

  for (const key of keys) {
    if (isPresent(source[key])) {
      return source[key];
    }
  }

  return undefined;
};

export const normalizeStatus = (value) => {
  if (typeof value === "boolean") {
    return value ? "Active" : "Inactive";
  }

  if (typeof value === "number") {
    return value === 1 ? "Active" : "Inactive";
  }

  if (typeof value === "string") {
    return value.trim() ? toTitleCase(value.trim()) : "Active";
  }

  return "Active";
};

export const getErrorMessage = (error, fallbackMessage) => {
  const payload = unwrapApiPayload(error?.response?.data);

  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (payload && typeof payload === "object") {
    const directMessage = pickFirstValue(payload, [
      "message",
      "error",
      "details",
      "msg",
    ]);

    if (typeof directMessage === "string" && directMessage.trim()) {
      return directMessage.trim();
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
};

const formatCode = (prefix, rawValue, index) => {
  const normalizedValue = normalizeString(rawValue);

  if (normalizedValue) {
    return normalizedValue.length <= 12
      ? normalizedValue
      : `${prefix}-${normalizedValue.slice(-6).toUpperCase()}`;
  }

  return `${prefix}-${String(index + 1).padStart(3, "0")}`;
};

export const getCityNameFromRecord = (record) => {
  const directCityName = normalizeString(
    pickFirstValue(record, ["City Name", "cityName", "city_name"])
  );

  if (directCityName) {
    return directCityName;
  }

  const cityReference = record?.city;

  const nestedCity =
    cityReference && typeof cityReference === "object"
      ? cityReference
      : pickFirstValue(record, ["cityDetails", "cityData", "cityId"]);

  if (nestedCity && typeof nestedCity === "object") {
    return normalizeString(
      pickFirstValue(nestedCity, ["name", "cityName", "city", "title"])
    );
  }

  return "";
};

export const getCityIdFromRecord = (record) => {
  const directCityId = pickFirstValue(record, ["cityId", "city_id", "cityID"]);

  if (isPresent(directCityId) && typeof directCityId !== "object") {
    return String(directCityId);
  }

  const cityReference = record?.city;

  if (typeof cityReference === "string" && cityReference.trim()) {
    return cityReference.trim();
  }

  if (cityReference && typeof cityReference === "object") {
    const nestedId = pickFirstValue(cityReference, [
      "_id",
      "id",
      "cityId",
      "cityID",
    ]);

    if (isPresent(nestedId)) {
      return String(nestedId);
    }
  }

  if (directCityId && typeof directCityId === "object") {
    const nestedId = pickFirstValue(directCityId, [
      "_id",
      "id",
      "cityId",
      "cityID",
    ]);

    if (isPresent(nestedId)) {
      return String(nestedId);
    }
  }

  return "";
};

export const normalizeCityRecord = (record, index) => {
  const entityId = pickFirstValue(record, ["_id", "id", "cityId", "city_id", "cityID"]);
  const id = isPresent(entityId) ? String(entityId) : `city-${index + 1}`;

  return {
    id,
    backendId: id,
    code: formatCode(
      "CTY",
      pickFirstValue(record, ["city_id", "City ID", "cityId", "cityID", "cityCode", "code"]),
      index
    ),
    name: normalizeString(
      pickFirstValue(record, ["city_name", "City Name", "cityName", "name", "city", "title"]),
      `City ${index + 1}`
    ),
    status: normalizeStatus(
      pickFirstValue(record, ["status", "isActive", "active"])
    ),
    raw: record,
  };
};

export const normalizeAreaRecord = (record, index) => {
  const entityId = pickFirstValue(record, ["_id", "id", "areaId", "areaID"]);
  const id = isPresent(entityId) ? String(entityId) : `area-${index + 1}`;

  return {
    id,
    backendId: id,
    name: normalizeString(
      pickFirstValue(record, [
        "society_name",
        "Society Name",
        "areaName",
        "name",
        "area",
        "societyName",
        "society",
        "title",
      ]),
      `Area ${index + 1}`
    ),
    cityId: getCityIdFromRecord(record),
    cityName: getCityNameFromRecord(record),
    status: normalizeStatus(
      pickFirstValue(record, ["status", "isActive", "active"])
    ),
    raw: record,
  };
};

export const buildCityPayloads = (name) => {
  const normalizedName = normalizeString(name);

  return dedupePayloads([
    { city_name: normalizedName, "City Name": normalizedName, cityName: normalizedName }
  ]).map(compactObject);
};

export const buildAreaPayloads = ({ name, cityId, cityName }) => {
  const normalizedAreaName = normalizeString(name);
  const normalizedCityId = normalizeString(cityId);
  const normalizedCityName = normalizeString(cityName);

  return dedupePayloads([
    {
      city_name: normalizedCityName,
      society_name: normalizedAreaName,
      "City Name": normalizedCityName,
      "Society Name": normalizedAreaName,
    },
    {
      cityId: normalizedCityId,
      cityName: normalizedCityName,
      areaName: normalizedAreaName,
    },
  ]).map(compactObject);
};

export const runRequestWithPayloads = async (request, payloads) => {
  let lastError;

  for (let index = 0; index < payloads.length; index += 1) {
    try {
      return await request(payloads[index]);
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      const isValidationError =
        status === 400 || status === 404 || status === 409 || status === 422;

      if (!isValidationError || index === payloads.length - 1) {
        throw error;
      }
    }
  }

  throw lastError;
};
