import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Fade,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import api from "../../services/api";

/* Rotated in order while the request is in flight. */
const PROCESSING_MESSAGES = [
  "Uploading your timetable...",
  "Reading through the schedule...",
  "Identifying subjects and faculty...",
  "Extracting classes with AI...",
  "Cross-checking timings and rooms...",
  "Almost done, finalizing the timetable...",
];

const MESSAGE_INTERVAL_MS = 2800;

const UploadTimetable = () => {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  // eslint-disable-next-line no-unused-vars
  const [timetable, setTimetable] = useState(null);

  const allowedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  const maxFileSize = 15 * 1024 * 1024;

  /* Rotate processing messages while the dialog is open */
  useEffect(() => {
    if (!converting) {
      setMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMessageIndex((current) =>
        current < PROCESSING_MESSAGES.length - 1 ? current + 1 : current,
      );
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [converting]);

  /* Warn on refresh/close/back while the request is running */
  useEffect(() => {
    if (!converting) return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [converting]);

  const validateFile = (selectedFile) => {
    setError("");
    if (!selectedFile) return false;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        "Invalid file type. Please upload a PDF, JPG, PNG, XLS, XLSX or CSV file.",
      );
      return false;
    }
    if (selectedFile.size > maxFileSize) {
      setError("File size must be less than 15 MB.");
      return false;
    }
    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (!validateFile(selectedFile)) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setFile(selectedFile);

    if (
      selectedFile.type.startsWith("image/") ||
      selectedFile.type === "application/pdf"
    ) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl("");
    }
  };

  const handleInputChange = (event) => {
    handleFileSelect(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    handleFileSelect(event.dataTransfer.files?.[0]);
  };

  const handleRemoveFile = (event) => {
    event.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl("");
    setError("");
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a timetable file first.");
      return;
    }

    try {
      setError("");
      setConverting(true);

      const formData = new FormData();
      formData.append("timetable", file);

      const response = await api.post("/timetable/convert", formData);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to convert timetable.",
        );
      }

      const convertedTimetable = response.data.timetable;
      setTimetable(convertedTimetable);

      navigate("/dashboard/timetable/preview", {
        state: {
          timetable: convertedTimetable,
          fileName: file.name,
        },
      });
    } catch (error) {
      console.error("Timetable conversion error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while converting the timetable.";
      setError(message);
    } finally {
      setConverting(false);
    }
  };

  const getFileIcon = () => {
    if (!file)
      return <CloudUploadIcon sx={{ fontSize: { xs: 36, sm: 44, md: 52 } }} />;
    if (file.type === "application/pdf")
      return <PictureAsPdfIcon sx={{ fontSize: { xs: 36, sm: 44, md: 52 } }} />;
    if (file.type.startsWith("image/"))
      return <ImageIcon sx={{ fontSize: { xs: 36, sm: 44, md: 52 } }} />;
    if (
      file.type.includes("spreadsheet") ||
      file.type.includes("excel") ||
      file.type === "text/csv"
    )
      return <TableChartIcon sx={{ fontSize: { xs: 36, sm: 44, md: 52 } }} />;
    return (
      <InsertDriveFileIcon sx={{ fontSize: { xs: 36, sm: 44, md: 52 } }} />
    );
  };

  const isImage = file && file.type.startsWith("image/") && previewUrl;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        px: { xs: 1, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 5 },
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : alpha(theme.palette.primary.main, 0.02),
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 880,
          mx: "auto",
          px: { xs: 0, sm: 1, md: 3 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            mb: { xs: 1, sm: 2.5 },
            p: { xs: 2.5, sm: 3 },
            borderRadius: 1,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.75, sm: 2.25 },
            border: "1px solid",
            borderColor: "divider",
            background: (theme) =>
              theme.palette.mode === "light"
                ? `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.06,
                  )} 0%, ${alpha(
                    theme.palette.primary.main,
                    0.02,
                  )} 55%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                : `linear-gradient(135deg, ${alpha(
                    theme.palette.primary.main,
                    0.12,
                  )} 0%, ${alpha(
                    theme.palette.primary.main,
                    0.04,
                  )} 55%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`,
            boxShadow: (theme) =>
              theme.palette.mode === "light"
                ? `0 10px 30px ${alpha(theme.palette.primary.main, 0.06)}`
                : `0 10px 30px ${alpha("#000", 0.25)}`,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              top: -90,
              right: -60,
              background: (theme) => alpha(theme.palette.primary.main, 0.08),
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              width: 120,
              height: 120,
              borderRadius: "50%",
              bottom: -70,
              right: 120,
              background: (theme) => alpha(theme.palette.primary.main, 0.05),
              pointerEvents: "none",
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              flexShrink: 0,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "primary.contrastText",
              boxShadow: `0 8px 22px ${alpha(
                theme.palette.primary.main,
                0.22,
              )}`,
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: { xs: 25, sm: 29 } }} />
          </Box>

          <Box sx={{ position: "relative", zIndex: 1, minWidth: 0 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.45rem", sm: "1.75rem", md: "2.15rem" },
                letterSpacing: "-0.025em",
                lineHeight: 1.2,
              }}
            >
              Upload Timetable
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                lineHeight: 1.5,
                fontSize: { xs: "0.82rem", sm: "0.9rem" },
              }}
            >
              Upload your timetable PDF and let AI extract the schedule for you.
            </Typography>
          </Box>
        </Box>

        {/* Error */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 1.5,
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              bgcolor: alpha(theme.palette.error.main, 0.04),
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        <Card
          elevation={0}
          sx={{
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            bgcolor: "background.paper",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 24px rgba(0,0,0,0.4)"
                : "0 4px 24px rgba(0,0,0,0.04)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box
              onDragOver={(event) => {
                event.preventDefault();
                if (!file) setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => {
                if (!file) fileInputRef.current?.click();
              }}
              sx={{
                minHeight: { xs: 260, sm: 300, md: 340 },
                border: "2px dashed",
                borderColor: dragging
                  ? "primary.main"
                  : file
                    ? "success.main"
                    : "divider",
                borderRadius: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                cursor: file ? "default" : "pointer",
                p: { xs: 2, sm: 3, md: 4 },
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                bgcolor: dragging
                  ? (theme) => alpha(theme.palette.primary.main, 0.06)
                  : file
                    ? (theme) => alpha(theme.palette.success.main, 0.03)
                    : "transparent",
                position: "relative",
                "&:hover": {
                  borderColor: file ? "success.main" : "primary.main",
                  bgcolor: file
                    ? (theme) => alpha(theme.palette.success.main, 0.05)
                    : (theme) => alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              {file && !converting && (
                <Tooltip title="Remove file" arrow>
                  <IconButton
                    onClick={handleRemoveFile}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: { xs: 8, sm: 12 },
                      right: { xs: 8, sm: 12 },
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                      boxShadow: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "error.main",
                        color: "white",
                        borderColor: "error.main",
                        transform: "scale(1.08)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {isImage && (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Timetable preview"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: { xs: 120, sm: 160 },
                    borderRadius: 2,
                    mb: 2,
                    objectFit: "contain",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
              )}

              <Box
                sx={{
                  width: { xs: 72, sm: 88, md: 100 },
                  height: { xs: 72, sm: 88, md: 100 },
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: file ? "success.main" : "primary.main",
                  color: "#fff",
                  mb: 2.5,
                  transition: "all 0.25s ease",
                  boxShadow: (theme) =>
                    file
                      ? `0 8px 24px ${alpha(theme.palette.success.main, 0.35)}`
                      : `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                {getFileIcon()}
              </Box>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  fontSize: { xs: "1rem", sm: "1.15rem", md: "1.3rem" },
                  wordBreak: "break-word",
                  px: 2,
                  color: file ? "success.main" : "text.primary",
                }}
              >
                {file ? file.name : "Upload your timetable"}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.75, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
              >
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                  : "Drag & drop your file here or click to browse"}
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".xls,.xlsx,.csv,.pdf,.jpg,.jpeg,.png"
                onChange={handleInputChange}
              />

              {!file && (
                <Button
                  variant="outlined"
                  sx={{
                    mt: 3,
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.06),
                    },
                  }}
                  startIcon={<CloudUploadIcon />}
                  onClick={(event) => {
                    event.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Files
                </Button>
              )}

              {file && !converting && (
                <Button
                  variant="outlined"
                  onClick={(event) => {
                    event.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  sx={{
                    mt: 3,
                    textTransform: "none",
                    borderRadius: 2.5,
                    fontWeight: 600,
                    px: 3,
                    borderColor: "divider",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "primary.main",
                      color: "primary.main",
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  Replace File
                </Button>
              )}
            </Box>

            {/* Supported Formats */}
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ mt: 3, flexWrap: "wrap", justifyContent: "center" }}
            >
              <Chip
                label="PDF"
                size="small"
                sx={{ fontWeight: 600, borderRadius: 1.5 }}
              />
              <Chip
                label="JPG/PNG"
                size="small"
                sx={{ fontWeight: 600, borderRadius: 1.5 }}
              />
              <Chip
                label="XLS"
                size="small"
                sx={{ fontWeight: 600, borderRadius: 1.5 }}
              />
              <Chip
                label="XLSX"
                size="small"
                sx={{ fontWeight: 600, borderRadius: 1.5 }}
              />
              <Chip
                label="CSV"
                size="small"
                sx={{ fontWeight: 600, borderRadius: 1.5 }}
              />
              <Chip
                label="Max 15 MB"
                size="small"
                variant="outlined"
                sx={{
                  fontWeight: 600,
                  borderRadius: 1.5,
                  borderStyle: "dashed",
                }}
              />
            </Stack>

            {/* Convert Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              disabled={!file || converting}
              onClick={handleConvert}
              startIcon={converting ? null : <AutoAwesomeIcon />}
              sx={{
                mt: 3.5,
                py: { xs: 1.3, sm: 1.6 },
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                textTransform: "none",
                boxShadow: (theme) =>
                  `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: (theme) =>
                    `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
                "&.Mui-disabled": { boxShadow: "none" },
              }}
            >
              {converting ? "Extracting..." : "Extract Timetable"}
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* ============================================
          Blocking processing dialog
         ============================================ */}
      <Dialog
        open={converting}
        onClose={() => {}}
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 4,
              overflow: "hidden",
            },
          },
        }}
      >
        <LinearProgress
          sx={{
            height: 4,
            "& .MuiLinearProgress-bar": {
              transition: "transform 0.4s linear",
            },
          }}
        />
        <DialogContent
          sx={{
            p: { xs: 3, sm: 4.5 },
            minWidth: { sm: 440 },
          }}
        >
          <Stack
            sx={{
              alignItems: "center",
              justifyContent: "center",
              spacing: 3,
              textAlign: "center",
              width: "100%",
            }}
          >
            {/* AI Processing Icon */}
            <Box
              sx={{
                position: "relative",
                width: 82,
                height: 82,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: -8,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                }}
              />
              <CircularProgress
                size={76}
                thickness={2.5}
                sx={{
                  position: "absolute",
                  inset: 3,
                  color: "primary.main",
                }}
              />
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                  position: "relative",
                }}
              >
                <AutoAwesomeIcon
                  sx={{
                    fontSize: 26,
                    color: "primary.main",
                    display: "block",
                  }}
                />
              </Box>
            </Box>

            {/* Heading */}
            <Stack
              sx={{
                spacing: 0.75,
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                width: "100%",
                maxWidth: 360,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  fontWeight: 800,
                  textAlign: "center",
                  letterSpacing: "-0.3px",
                  width: "100%",
                }}
              >
                Analyzing your timetable
              </Typography>
            </Stack>

            {/* Processing Status */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
                px: 2,
                py: 1.5,
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="center"
                spacing={1.25}
                sx={{ width: "100%", textAlign: "center" }}
              >
                <Fade in key={messageIndex} timeout={400}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      textAlign: "center",
                      minHeight: 20,
                    }}
                  >
                    {PROCESSING_MESSAGES[messageIndex]}
                  </Typography>
                </Fade>
              </Stack>
            </Box>

            {/* Info Alert */}
            <Alert
              severity="info"
              variant="outlined"
              sx={{
                width: "100%",
                mt: 2,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 2.5,
                bgcolor: alpha(theme.palette.info.main, 0.025),
                borderColor: alpha(theme.palette.info.main, 0.18),
                "& .MuiAlert-icon": { flexShrink: 0, mr: 1 },
                "& .MuiAlert-message": {
                  flex: "initial",
                  textAlign: "center",
                },
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  lineHeight: 1.55,
                }}
              >
                Please keep this tab open while your timetable is being
                processed. Larger files may take a little longer.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UploadTimetable;
