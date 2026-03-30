import React, { useState } from "react";
import {
  alpha,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Stack,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  InfoOutlined as InfoIcon,
  LocationCityOutlined as CityIcon,
  GroupsOutlined as AreaIcon,
} from "@mui/icons-material";
import { genericApi } from "../../api/genericApi";
import { getAllAreas, getAllCities } from "../../api/areaManagementApi";
import {
  extractCollection,
  normalizeAreaRecord,
  normalizeCityRecord,
} from "../../utils/areaManagement";

/* ─── CSV helpers (unchanged logic) ─── */

const normalizeCsvHeader = (value = "") =>
  value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const normalizeLookupKey = (value = "") => value.trim().toLowerCase();

const buildGeneratedCityId = (cityName) =>
  `CITY-${cityName
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;

const parseCsvRows = (csvText) => {
  const normalizedCsvText = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const parsedRows = [];
  let currentCell = "";
  let currentRow = [];
  let inQuotes = false;

  for (let index = 0; index < normalizedCsvText.length; index += 1) {
    const character = normalizedCsvText[index];
    const nextCharacter = normalizedCsvText[index + 1];

    if (character === '"') {
      if (inQuotes && nextCharacter === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (character === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if (character === "\n" && !inQuotes) {
      currentRow.push(currentCell);
      parsedRows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += character;
  }

  if (currentCell || currentRow.length) {
    currentRow.push(currentCell);
    parsedRows.push(currentRow);
  }

  const nonEmptyRows = parsedRows
    .map((row) => row.map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell.length));

  if (!nonEmptyRows.length) return [];

  const headers = nonEmptyRows[0].map(normalizeCsvHeader);

  return nonEmptyRows.slice(1).map((row, rowIndex) => {
    const document = { __rowNumber: rowIndex + 2 };
    headers.forEach((header, headerIndex) => {
      document[header] = row[headerIndex]?.trim() || "";
    });
    return document;
  });
};

const getRowValue = (row, keys) => {
  for (const key of keys) {
    const value = row[normalizeCsvHeader(key)];
    if (value) return value.trim();
  }
  return "";
};

const buildCityUploadPayloads = (rows, existingCities) => {
  const existingCityIds = new Set();
  const existingCityNames = new Set();
  const seenCityIds = new Set();
  const seenCityNames = new Set();
  const payloads = [];
  const issues = [];
  let skippedCount = 0;

  existingCities.forEach((city) => {
    existingCityIds.add(normalizeLookupKey(city.raw?.["City ID"] || city.code || city.id || ""));
    existingCityNames.add(normalizeLookupKey(city.name));
  });

  rows.forEach((row) => {
    const cityName = getRowValue(row, ["City Name", "City", "Name"]);
    if (!cityName) { issues.push(`Row ${row.__rowNumber}: City Name is required.`); return; }

    const cityId = getRowValue(row, ["City ID", "City Code", "Code", "ID"]) || buildGeneratedCityId(cityName);
    const cityIdKey = normalizeLookupKey(cityId);
    const cityNameKey = normalizeLookupKey(cityName);

    if (existingCityIds.has(cityIdKey) || existingCityNames.has(cityNameKey) || seenCityIds.has(cityIdKey) || seenCityNames.has(cityNameKey)) {
      skippedCount += 1;
      return;
    }

    seenCityIds.add(cityIdKey);
    seenCityNames.add(cityNameKey);
    payloads.push({ "City ID": cityId, "City Name": cityName });
  });

  return { payloads, issues, skippedCount };
};

const buildAreaUploadPayloads = (rows, existingCities, existingAreas) => {
  const cityById = new Map();
  const cityByName = new Map();
  const existingAreaKeys = new Set();
  const seenAreaKeys = new Set();
  const payloads = [];
  const issues = [];
  let skippedCount = 0;

  existingCities.forEach((city) => {
    cityById.set(normalizeLookupKey(city.raw?.["City ID"] || city.code || city.id || ""), city);
    cityByName.set(normalizeLookupKey(city.name), city);
  });

  existingAreas.forEach((area) => {
    existingAreaKeys.add(`${normalizeLookupKey(area.name)}::${normalizeLookupKey(area.cityName)}`);
  });

  rows.forEach((row) => {
    const areaName = getRowValue(row, ["Society Name", "Area Name", "Area", "Society", "Name"]);
    if (!areaName) { issues.push(`Row ${row.__rowNumber}: Society Name is required.`); return; }

    const requestedCityId = getRowValue(row, ["City ID", "City Code", "Code"]);
    const requestedCityName = getRowValue(row, ["City Name", "City"]);
    const matchedCity =
      (requestedCityId && cityById.get(normalizeLookupKey(requestedCityId))) ||
      (requestedCityName && cityByName.get(normalizeLookupKey(requestedCityName)));

    if (!matchedCity) { issues.push(`Row ${row.__rowNumber}: No city matched "${requestedCityId || requestedCityName}".`); return; }

    const duplicateKey = `${normalizeLookupKey(areaName)}::${normalizeLookupKey(matchedCity.name)}`;
    if (existingAreaKeys.has(duplicateKey) || seenAreaKeys.has(duplicateKey)) { skippedCount += 1; return; }

    seenAreaKeys.add(duplicateKey);
    payloads.push({ "Society Name": areaName, "City Name": matchedCity.name });
  });

  return { payloads, issues, skippedCount };
};

const formatImportSummary = (label, insertedCount, skippedCount) => {
  if (!insertedCount) return `No new ${label} were imported. ${skippedCount} duplicate rows were skipped.`;
  if (!skippedCount) return `${insertedCount} ${label} imported successfully.`;
  return `${insertedCount} ${label} imported successfully. ${skippedCount} duplicate rows were skipped.`;
};

/* ─── Component ─── */

const BulkUploadArea = () => {
  const [activeTab, setActiveTab] = useState("Cities");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const options = [
    { id: "Cities", title: "City Ingestion", icon: <CityIcon />, subtitle: "Upload cities in batch via CSV" },
    { id: "Areas", title: "Area / Society Sync", icon: <AreaIcon />, subtitle: "Bulk import societies linked to cities" },
  ];

  /* ─── Workspace Section (mirrors StoreBulkUpdate) ─── */
  const WorkspaceSection = ({ type }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
      if (e.target.files[0]) setFile(e.target.files[0]);
      e.target.value = "";
    };

    const downloadTemplate = () => {
      let headers = "City ID,City Name,Status";
      if (type === "Areas") headers = "Society Name,City ID,City Name,Status";

      const blob = new Blob([headers], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Daycatch_${type}_Template.csv`;
      a.click();
      showSnackbar(`${type} template downloaded.`, "success");
    };

    const handleUpload = async () => {
      if (!file) { showSnackbar("Please select a CSV file first.", "error"); return; }

      setUploading(true);
      setProgress(10);

      try {
        const csvRows = parseCsvRows(await file.text());
        if (!csvRows.length) throw new Error("CSV is empty or headers are invalid.");

        setProgress(35);

        if (type === "Cities") {
          const existingCitiesResponse = await getAllCities({ limit: 500 });
          const existingCities = extractCollection(existingCitiesResponse, ["cities", "cityList"]).map((item, index) => normalizeCityRecord(item, index));

          setProgress(60);
          const { payloads, issues, skippedCount } = buildCityUploadPayloads(csvRows, existingCities);
          if (issues.length) throw new Error(issues.slice(0, 4).join(" "));
          if (!payloads.length) { showSnackbar(formatImportSummary("cities", 0, skippedCount), "success"); setUploading(false); return; }

          setProgress(85);
          await genericApi.bulkCreate("cities", payloads);
          setProgress(100);
          showSnackbar(formatImportSummary("cities", payloads.length, skippedCount), "success");
        } else {
          const [existingCitiesResponse, existingAreasResponse] = await Promise.all([
            getAllCities({ limit: 500 }),
            getAllAreas({ limit: 500 }),
          ]);

          const existingCities = extractCollection(existingCitiesResponse, ["cities", "cityList"]).map((item, index) => normalizeCityRecord(item, index));
          const existingAreas = extractCollection(existingAreasResponse, ["areas", "areaList"]).map((item, index) => normalizeAreaRecord(item, index));

          setProgress(60);
          const { payloads, issues, skippedCount } = buildAreaUploadPayloads(csvRows, existingCities, existingAreas);
          if (issues.length) throw new Error(issues.slice(0, 4).join(" "));
          if (!payloads.length) { showSnackbar(formatImportSummary("areas", 0, skippedCount), "success"); setUploading(false); return; }

          setProgress(85);
          await genericApi.bulkCreate("area", payloads);
          setProgress(100);
          showSnackbar(formatImportSummary("areas", payloads.length, skippedCount), "success");
        }

        setFile(null);
      } catch (error) {
        console.error(`Error importing ${type} CSV:`, error);
        showSnackbar(error.message || `Failed to import ${type.toLowerCase()}.`, "error");
      } finally {
        setUploading(false);
        setTimeout(() => setProgress(0), 300);
      }
    };

    const instructions = type === "Cities"
      ? [
          "CSV format with standard headers is required.",
          "Include a stable City ID for every row.",
          "Duplicate city names or IDs are skipped automatically.",
          "Max threshold: 5,000 cities per ingestion cycle.",
        ]
      : [
          "CSV format with standard headers is required.",
          "Link areas using exact City ID or exact City Name.",
          "Areas are matched against existing city records before import.",
          "Max threshold: 5,000 areas per ingestion cycle.",
        ];

    return (
      <Paper sx={{ p: 5, borderRadius: "32px", border: "1px solid #e0e5f2", boxShadow: "0 20px 60px rgba(0,0,0,0.05)", bgcolor: "#fff" }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <Box sx={{ bgcolor: "#fafbfc", p: 4, borderRadius: "24px", border: "1px solid #f0f4f8", height: "100%" }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box sx={{ p: 1.5, borderRadius: "12px", bgcolor: alpha("#E53935", 0.1) }}>
                  <InfoIcon sx={{ color: "#E53935", fontSize: 24 }} />
                </Box>
                <Typography variant="h5" fontWeight="900" color="#1b2559">Sync Protocol</Typography>
              </Stack>
              <List spacing={1}>
                {instructions.map((text, i) => (
                  <ListItem key={i} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: "32px" }}>
                      <CheckCircleIcon sx={{ color: "#05cd99", fontSize: 18 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={<Typography variant="body2" fontWeight="700" color="#707eae">{text}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>

              <Button
                variant="text"
                startIcon={<DownloadIcon />}
                onClick={downloadTemplate}
                sx={{ mt: 3, color: "#E53935", fontWeight: 900, textTransform: "none", fontSize: "15px" }}
              >
                Download {type} Template
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="caption" fontWeight="900" color="#a3aed0" sx={{ mb: 1.5, display: "block", textTransform: "uppercase", letterSpacing: "1px" }}>Data Source (CSV)</Typography>
                <Box
                  sx={{
                    border: "3px dashed #e0e5f2",
                    borderRadius: "24px",
                    p: 6,
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "0.2s",
                    bgcolor: file ? alpha("#E53935", 0.02) : "transparent",
                    "&:hover": { borderColor: "#E53935", bgcolor: alpha("#E53935", 0.04) }
                  }}
                  onClick={() => document.getElementById(`file-${type}`).click()}
                >
                  <UploadIcon sx={{ color: file ? "#E53935" : "#d1d9e2", fontSize: 56, mb: 2 }} />
                  <Typography variant="h5" fontWeight="900" color="#1b2559">
                    {file ? file.name : "Select or Drop CSV File"}
                  </Typography>
                  <Typography variant="body2" color="#a3aed0" fontWeight="700" sx={{ mt: 1 }}>
                    Only .csv formats are permitted for high-speed ingestion.
                  </Typography>
                  <input type="file" id={`file-${type}`} hidden accept=".csv" onChange={handleFileChange} />
                </Box>
              </Box>

              {uploading && (
                <Box>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Typography variant="caption" fontWeight="900" color="#1b2559">Verification Progress</Typography>
                    <Typography variant="caption" fontWeight="900" color="#E53935">{progress}%</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 16, borderRadius: 8, bgcolor: "#f4f7fe", "& .MuiLinearProgress-bar": { bgcolor: "#E53935" } }} />
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handleUpload}
                disabled={!file || uploading}
                sx={{ py: 2.2, borderRadius: "20px", bgcolor: "#E53935", fontWeight: 900, fontSize: "17px", boxShadow: "0 10px 30px rgba(229, 57, 53, 0.22)", "&:hover": { bgcolor: "#d32f2f" } }}
              >
                {uploading ? "Executing Batch Sync..." : `Finalize ${type} Import`}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 5 }, backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1600px", mx: "auto" }}>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" fontWeight="900" color="#1b2559" sx={{ letterSpacing: "-3px", mb: 1 }}>
            Bulk Area Upload
          </Typography>
          <Typography variant="body1" color="#a3aed0" fontWeight="700">
            Choose an upload model to import cities or areas in batch via CSV.
          </Typography>
        </Box>

        {/* Option Selector Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }} alignItems="stretch">
          {options.map((opt) => (
            <Grid item xs={12} md={6} key={opt.id}>
              <Paper
                onClick={() => setActiveTab(opt.id)}
                sx={{
                  p: 4,
                  borderRadius: "32px",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.3s all cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "2px solid",
                  borderColor: activeTab === opt.id ? "#E53935" : "transparent",
                  backgroundImage: activeTab === opt.id ? `linear-gradient(135deg, ${alpha("#E53935", 0.05)}, #fff)` : "#fff",
                  boxShadow: activeTab === opt.id ? "0 20px 40px rgba(229, 57, 53, 0.08)" : "0 10px 30px rgba(0,0,0,0.02)",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }
                }}
              >
                <Stack spacing={2} alignItems="center" textAlign="center">
                  <Box sx={{
                    p: 2.5,
                    borderRadius: "20px",
                    bgcolor: activeTab === opt.id ? "#E53935" : alpha("#a3aed0", 0.1),
                    color: activeTab === opt.id ? "#fff" : "#a3aed0",
                    transition: "0.3s"
                  }}>
                    {opt.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="900" color={activeTab === opt.id ? "#E53935" : "#1b2559"}>
                      {opt.title}
                    </Typography>
                    <Typography variant="caption" fontWeight="800" color="#a3aed0">
                      {opt.subtitle}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Active Model Workspace */}
        <Box sx={{ position: "relative" }}>
          <Typography variant="caption" fontWeight="900" color="#E53935" sx={{ mb: 2, display: "block", textTransform: "uppercase", letterSpacing: "2px" }}>
            Active Environment: {activeTab}
          </Typography>
          <WorkspaceSection type={activeTab} key={activeTab} />
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: "18px", fontWeight: "900", px: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkUploadArea;
