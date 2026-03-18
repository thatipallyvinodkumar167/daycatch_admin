export const DELIVERY_BOY_STATUS = {
  ON_DUTY: "onDuty",
  OFF_DUTY: "offDuty",
};

export const DELIVERY_BOY_ID_TYPES = [
  { value: "Aadhar", label: "Aadhar" },
  { value: "Pan", label: "PAN Card" },
  { value: "Driving License", label: "Driving License" },
  { value: "Voter ID", label: "Voter ID" },
  { value: "Other", label: "Other" },
];

const ID_TYPE_ALIASES = {
  aadhar: "Aadhar",
  "aadhar card": "Aadhar",
  pan: "Pan",
  "pan card": "Pan",
  "driving license": "Driving License",
  "driving licence": "Driving License",
  "voter id": "Voter ID",
  other: "Other",
  "business proof": "Other",
};

const STATUS_ALIASES = {
  onduty: DELIVERY_BOY_STATUS.ON_DUTY,
  "on duty": DELIVERY_BOY_STATUS.ON_DUTY,
  active: DELIVERY_BOY_STATUS.ON_DUTY,
  offduty: DELIVERY_BOY_STATUS.OFF_DUTY,
  "off duty": DELIVERY_BOY_STATUS.OFF_DUTY,
  inactive: DELIVERY_BOY_STATUS.OFF_DUTY,
};

const toLookupKey = (value) => String(value || "").trim().toLowerCase();

export const normalizeDeliveryBoyIdType = (value) => {
  const key = toLookupKey(value);

  if (!key) {
    return "";
  }

  return ID_TYPE_ALIASES[key] || "Other";
};

export const normalizeDeliveryBoyStatus = (value) => {
  const key = toLookupKey(value);

  if (!key) {
    return DELIVERY_BOY_STATUS.ON_DUTY;
  }

  return STATUS_ALIASES[key] || DELIVERY_BOY_STATUS.ON_DUTY;
};

export const formatDeliveryBoyIdType = (value) => {
  const normalizedValue = normalizeDeliveryBoyIdType(value);
  const matchedType = DELIVERY_BOY_ID_TYPES.find(
    (type) => type.value === normalizedValue
  );

  return matchedType?.label || "N/A";
};

export const formatDeliveryBoyStatus = (value) =>
  normalizeDeliveryBoyStatus(value) === DELIVERY_BOY_STATUS.OFF_DUTY
    ? "Off Duty"
    : "On Duty";

export const isDeliveryBoyOffDuty = (value) =>
  normalizeDeliveryBoyStatus(value) === DELIVERY_BOY_STATUS.OFF_DUTY;
