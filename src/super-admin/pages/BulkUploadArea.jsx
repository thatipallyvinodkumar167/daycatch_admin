import React, { useState } from "react";
import {
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
  Divider,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationCityOutlinedIcon from "@mui/icons-material/LocationCityOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { genericApi } from "../../api/genericApi";
import { getAllAreas, getAllCities } from "../../api/areaManagementApi";
import {
  extractCollection,
  normalizeAreaRecord,
  normalizeCityRecord,
} from "../../utils/areaManagement";

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

  if (!nonEmptyRows.length) {
    return [];
  }

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

    if (value) {
      return value.trim();
    }
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
    existingCityIds.add(
      normalizeLookupKey(city.raw?.["City ID"] || city.code || city.id || "")
    );
    existingCityNames.add(normalizeLookupKey(city.name));
  });

  rows.forEach((row) => {
    const cityName = getRowValue(row, ["City Name", "City", "Name"]);

    if (!cityName) {
      issues.push(`Row ${row.__rowNumber}: City Name is required.`);
      return;
    }

    const cityId =
      getRowValue(row, ["City ID", "City Code", "Code", "ID"]) ||
      buildGeneratedCityId(cityName);

    const cityIdKey = normalizeLookupKey(cityId);
    const cityNameKey = normalizeLookupKey(cityName);

    if (
      existingCityIds.has(cityIdKey) ||
      existingCityNames.has(cityNameKey) ||
      seenCityIds.has(cityIdKey) ||
      seenCityNames.has(cityNameKey)
    ) {
      skippedCount += 1;
      return;
    }

    seenCityIds.add(cityIdKey);
    seenCityNames.add(cityNameKey);

    payloads.push({
      "City ID": cityId,
      "City Name": cityName,
    });
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
    cityById.set(
      normalizeLookupKey(city.raw?.["City ID"] || city.code || city.id || ""),
      city
    );
    cityByName.set(normalizeLookupKey(city.name), city);
  });

  existingAreas.forEach((area) => {
    existingAreaKeys.add(
      `${normalizeLookupKey(area.name)}::${normalizeLookupKey(area.cityName)}`
    );
  });

  rows.forEach((row) => {
    const areaName = getRowValue(row, [
      "Society Name",
      "Area Name",
      "Area",
      "Society",
      "Name",
    ]);

    if (!areaName) {
      issues.push(`Row ${row.__rowNumber}: Society Name is required.`);
      return;
    }

    const requestedCityId = getRowValue(row, ["City ID", "City Code", "Code"]);
    const requestedCityName = getRowValue(row, ["City Name", "City"]);
    const matchedCity =
      (requestedCityId && cityById.get(normalizeLookupKey(requestedCityId))) ||
      (requestedCityName && cityByName.get(normalizeLookupKey(requestedCityName)));

    if (!matchedCity) {
      issues.push(
        `Row ${row.__rowNumber}: No city matched "${requestedCityId || requestedCityName}".`
      );
      return;
    }

    const duplicateKey = `${normalizeLookupKey(areaName)}::${normalizeLookupKey(
      matchedCity.name
    )}`;

    if (existingAreaKeys.has(duplicateKey) || seenAreaKeys.has(duplicateKey)) {
      skippedCount += 1;
      return;
    }

    seenAreaKeys.add(duplicateKey);

    payloads.push({
      "Society Name": areaName,
      "City Name": matchedCity.name,
    });
  });

  return { payloads, issues, skippedCount };
};

const formatImportSummary = (label, insertedCount, skippedCount) => {
  if (!insertedCount) {
    return `No new ${label} were imported. ${skippedCount} duplicate rows were skipped.`;
  }

  if (!skippedCount) {
    return `${insertedCount} ${label} imported successfully.`;
  }

  return `${insertedCount} ${label} imported successfully. ${skippedCount} duplicate rows were skipped.`;
};

const BulkUploadArea = () => {
  const [cityFile, setCityFile] = useState(null);
  const [societyFile, setSocietyFile] = useState(null);
  const [uploadingCity, setUploadingCity] = useState(false);
  const [uploadingSociety, setUploadingSociety] = useState(false);
  const [cityProgress, setCityProgress] = useState(0);
  const [societyProgress, setSocietyProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCityFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setCityFile(selectedFile);
    event.target.value = "";
  };

  const handleSocietyFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setSocietyFile(selectedFile);
    event.target.value = "";
  };

  const handleCityUpload = async () => {
    if (!cityFile) {
      return;
    }

    setUploadingCity(true);
    setCityProgress(10);

    try {
      const csvRows = parseCsvRows(await cityFile.text());

      if (!csvRows.length) {
        throw new Error("City CSV is empty or headers are invalid.");
      }

      setCityProgress(35);
      const existingCitiesResponse = await getAllCities({ limit: 500 });
      const existingCities = extractCollection(existingCitiesResponse, [
        "cities",
        "cityList",
      ]).map((item, index) => normalizeCityRecord(item, index));

      setCityProgress(60);
      const { payloads, issues, skippedCount } = buildCityUploadPayloads(
        csvRows,
        existingCities
      );

      if (issues.length) {
        throw new Error(issues.slice(0, 4).join(" "));
      }

      if (!payloads.length) {
        showSnackbar(formatImportSummary("cities", 0, skippedCount), "success");
        return;
      }

      setCityProgress(85);
      await genericApi.bulkCreate("cities", payloads);
      setCityProgress(100);
      showSnackbar(
        formatImportSummary("cities", payloads.length, skippedCount),
        "success"
      );
      setCityFile(null);
    } catch (error) {
      console.error("Error importing city CSV:", error);
      showSnackbar(error.message || "Failed to import cities.", "error");
    } finally {
      setUploadingCity(false);
      setTimeout(() => setCityProgress(0), 300);
    }
  };

  const handleSocietyUpload = async () => {
    if (!societyFile) {
      return;
    }

    setUploadingSociety(true);
    setSocietyProgress(10);

    try {
      const csvRows = parseCsvRows(await societyFile.text());

      if (!csvRows.length) {
        throw new Error("Area CSV is empty or headers are invalid.");
      }

      setSocietyProgress(30);
      const [existingCitiesResponse, existingAreasResponse] = await Promise.all([
        getAllCities({ limit: 500 }),
        getAllAreas({ limit: 500 }),
      ]);

      const existingCities = extractCollection(existingCitiesResponse, [
        "cities",
        "cityList",
      ]).map((item, index) => normalizeCityRecord(item, index));
      const existingAreas = extractCollection(existingAreasResponse, [
        "areas",
        "areaList",
      ]).map((item, index) => normalizeAreaRecord(item, index));

      setSocietyProgress(60);
      const { payloads, issues, skippedCount } = buildAreaUploadPayloads(
        csvRows,
        existingCities,
        existingAreas
      );

      if (issues.length) {
        throw new Error(issues.slice(0, 4).join(" "));
      }

      if (!payloads.length) {
        showSnackbar(formatImportSummary("areas", 0, skippedCount), "success");
        return;
      }

      setSocietyProgress(85);
      await genericApi.bulkCreate("area", payloads);
      setSocietyProgress(100);
      showSnackbar(
        formatImportSummary("areas", payloads.length, skippedCount),
        "success"
      );
      setSocietyFile(null);
    } catch (error) {
      console.error("Error importing area CSV:", error);
      showSnackbar(error.message || "Failed to import areas.", "error");
    } finally {
      setUploadingSociety(false);
      setTimeout(() => setSocietyProgress(0), 300);
    }
  };

  const downloadCityTemplate = () => {
    const headers = "City ID,City Name,Status";
    const blob = new Blob([headers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Daycatch_Cities_Template.csv";
    anchor.click();
    showSnackbar("City template downloaded successfully.", "success");
  };

  const downloadSocietyTemplate = () => {
    const headers = "Society Name,City ID,City Name,Status";
    const blob = new Blob([headers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "Daycatch_Areas_Template.csv";
    anchor.click();
    showSnackbar("Area template downloaded successfully.", "success");
  };

  const commonCardStyles = {
    p: 4,
    borderRadius: "28px",
    background: "#fff",
    border: "1px solid #e0e5f2",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
    position: "relative",
    overflow: "hidden",
  };

  const uploadBoxStyles = {
    border: "2px dashed #e0e5f2",
    borderRadius: "20px",
    p: 6,
    backgroundColor: "#f4f7fe",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      borderColor: "#4318ff",
      backgroundColor: "#eff2ff",
      "& .upload-icon": {
        transform: "translateY(-5px)",
        color: "#4318ff",
      },
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const primaryBtnStyles = {
    backgroundColor: "#4318ff",
    color: "white",
    borderRadius: "16px",
    px: 4,
    py: 2,
    textTransform: "none",
    fontWeight: "800",
    fontSize: "1rem",
    boxShadow: "0 10px 20px rgba(67, 24, 255, 0.15)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#3311cc",
      boxShadow: "0 12px 25px rgba(67, 24, 255, 0.25)",
    },
    "&:disabled": {
      backgroundColor: "#f4f7fe",
      color: "#a3aed0",
    },
  };

  const secondaryBtnStyles = {
    borderRadius: "14px",
    px: 3,
    py: 1.5,
    textTransform: "none",
    fontWeight: "800",
    fontSize: "0.9rem",
    color: "#4318ff",
    backgroundColor: "#f4f7fe",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "#e0e7ff",
    },
  };

  const InstructionList = ({ extraInfo }) => (
    <List spacing={1} sx={{ mt: 2 }}>
      {[
        "Use standard CSV files.",
        "First row must contain headers.",
        "Include all required fields.",
        "Duplicate rows are skipped automatically.",
        ...(extraInfo || []),
      ].map((text, idx) => (
        <ListItem key={idx} sx={{ px: 0, py: 0.8 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <CheckCircleIcon sx={{ fontSize: 20, color: "#24d164" }} />
          </ListItemIcon>
          <ListItemText
            primary={text}
            primaryTypographyProps={{
              fontSize: "0.9rem",
              color: "#1b2559",
              fontWeight: "600",
            }}
          />
        </ListItem>
      ))}
    </List>
  );

  const snackbarColors = {
    success: "#00d26a",
    warning: "#ffb800",
    info: "#2d60ff",
    error: "#ff4d49",
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#f4f7fe" }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="800" color="#2b3674" sx={{ letterSpacing: "-1px" }}>
          Bulk Area Upload
        </Typography>
        <Typography variant="body2" color="#a3aed0" fontWeight="600">
          Upload CSV files to add multiple cities and areas at once.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Stack spacing={4}>
            <Paper sx={commonCardStyles}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ p: 1.5, borderRadius: "14px", backgroundColor: "#f4f7fe" }}>
                    <LocationCityOutlinedIcon sx={{ color: "#4318ff" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="800" color="#1b2559">
                    City Upload Instructions
                  </Typography>
                </Stack>
                <Button
                  startIcon={<FileDownloadIcon />}
                  sx={secondaryBtnStyles}
                  onClick={downloadCityTemplate}
                >
                  Sample
                </Button>
              </Stack>
              <Divider sx={{ mb: 2, opacity: 0.1 }} />
              <InstructionList extraInfo={["Include a stable City ID for every row."]} />
            </Paper>

            <Paper sx={commonCardStyles}>
              <Typography
                variant="subtitle1"
                fontWeight="800"
                color="#1b2559"
                sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
              >
                <CloudUploadIcon sx={{ color: "#4318ff", fontSize: 20 }} /> Bulk City Upload
              </Typography>
              <Box sx={uploadBoxStyles} onClick={() => document.getElementById("cityInput").click()}>
                {cityFile ? (
                  <>
                    <FilePresentIcon className="upload-icon" sx={{ fontSize: 60, color: "#4318ff", mb: 2 }} />
                    <Typography variant="h6" fontWeight="800" color="#1b2559">
                      {cityFile.name}
                    </Typography>
                    <Typography variant="caption" color="#a3aed0" fontWeight="600">
                      Click to change selection
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudUploadIcon
                      className="upload-icon"
                      sx={{ fontSize: 60, color: "#a3aed0", mb: 2, transition: "0.3s" }}
                    />
                    <Typography variant="body1" fontWeight="800" color="#1b2559">
                      Select CSV File
                    </Typography>
                    <Typography variant="caption" color="#a3aed0" fontWeight="600">
                      Drag and drop or browse...
                    </Typography>
                  </>
                )}
                <input type="file" id="cityInput" hidden accept=".csv" onChange={handleCityFileChange} />
              </Box>

              <Button
                variant="contained"
                fullWidth
                disabled={!cityFile || uploadingCity}
                onClick={handleCityUpload}
                sx={{ ...primaryBtnStyles, mt: 4 }}
              >
                {uploadingCity ? "Uploading cities..." : "Start Upload"}
              </Button>

              {uploadingCity && (
                <Box sx={{ mt: 4 }}>
                  <LinearProgress
                    variant="determinate"
                    value={cityProgress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#f4f7fe",
                      "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="700">
                      Saving data...
                    </Typography>
                    <Typography variant="caption" fontWeight="800" color="#4318ff">
                      {cityProgress}%
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={4}>
            <Paper sx={commonCardStyles}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ p: 1.5, borderRadius: "14px", backgroundColor: "#f4f7fe" }}>
                    <GroupsOutlinedIcon sx={{ color: "#4318ff" }} />
                  </Box>
                  <Typography variant="h6" fontWeight="800" color="#1b2559">
                    Area Upload Instructions
                  </Typography>
                </Stack>
                <Button
                  startIcon={<FileDownloadIcon />}
                  sx={secondaryBtnStyles}
                  onClick={downloadSocietyTemplate}
                >
                  Sample
                </Button>
              </Stack>
              <Divider sx={{ mb: 2, opacity: 0.1 }} />
              <InstructionList
                extraInfo={[
                  "Link areas using exact City ID or exact City Name.",
                  "Areas are matched against existing city records before import.",
                ]}
              />
            </Paper>

            <Paper sx={commonCardStyles}>
              <Typography
                variant="subtitle1"
                fontWeight="800"
                color="#1b2559"
                sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
              >
                <CloudUploadIcon sx={{ color: "#4318ff", fontSize: 20 }} /> Bulk Area Upload
              </Typography>
              <Box sx={uploadBoxStyles} onClick={() => document.getElementById("societyInput").click()}>
                {societyFile ? (
                  <>
                    <FilePresentIcon className="upload-icon" sx={{ fontSize: 60, color: "#4318ff", mb: 2 }} />
                    <Typography variant="h6" fontWeight="800" color="#1b2559">
                      {societyFile.name}
                    </Typography>
                    <Typography variant="caption" color="#a3aed0" fontWeight="600">
                      Click to change selection
                    </Typography>
                  </>
                ) : (
                  <>
                    <CloudUploadIcon
                      className="upload-icon"
                      sx={{ fontSize: 60, color: "#a3aed0", mb: 2, transition: "0.3s" }}
                    />
                    <Typography variant="body1" fontWeight="800" color="#1b2559">
                      Select CSV File
                    </Typography>
                    <Typography variant="caption" color="#a3aed0" fontWeight="600">
                      Drag and drop or browse...
                    </Typography>
                  </>
                )}
                <input
                  type="file"
                  id="societyInput"
                  hidden
                  accept=".csv"
                  onChange={handleSocietyFileChange}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                disabled={!societyFile || uploadingSociety}
                onClick={handleSocietyUpload}
                sx={{ ...primaryBtnStyles, mt: 4 }}
              >
                {uploadingSociety ? "Uploading areas..." : "Start Upload"}
              </Button>

              {uploadingSociety && (
                <Box sx={{ mt: 4 }}>
                  <LinearProgress
                    variant="determinate"
                    value={societyProgress}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: "#f4f7fe",
                      "& .MuiLinearProgress-bar": { backgroundColor: "#4318ff" },
                    }}
                  />
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
                    <Typography variant="caption" color="#a3aed0" fontWeight="700">
                      Saving data...
                    </Typography>
                    <Typography variant="caption" fontWeight="800" color="#4318ff">
                      {societyProgress}%
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Paper
        sx={{
          mt: 6,
          p: 3,
          borderRadius: "20px",
          border: "1px dashed #4318ff",
          backgroundColor: "rgba(67, 24, 255, 0.02)",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <InfoOutlinedIcon sx={{ color: "#4318ff" }} />
        <Typography variant="body2" color="#1b2559" fontWeight="700">
          Important: Check CSV format before uploading. Bulk uploads skip duplicates,
          but invalid rows are rejected before import.
        </Typography>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            borderRadius: "14px",
            fontWeight: "700",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            bgcolor: snackbarColors[snackbar.severity] || snackbarColors.info,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BulkUploadArea;


