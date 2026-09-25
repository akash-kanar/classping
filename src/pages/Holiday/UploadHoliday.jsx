import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Fade,
  LinearProgress,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  CalendarMonth,
  CloudUpload,
  PictureAsPdf,
  InfoOutlined,
  AutoAwesome,
} from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import api from "../../services/api";

/* * Rotated in order while the request is in flight. * Kept generic on purpose — actual extraction time varies by PDF size, * so these describe progress without promising a specific duration. */
const PROCESSING_MESSAGES = [
  "Uploading your PDF...",
  "Reading through the calendar...",
  "Identifying holidays and dates...",
  "Extracting occasions with AI...",
  "Cross-checking dates and days...",
  "Almost done, finalizing the list...",
];

const MESSAGE_INTERVAL_MS = 2800;

const UploadHoliday = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  /* * Rotate the processing message while the dialog is open. */
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

  /* * Warn on refresh/close/back navigation while the request is running, * since a lost connection means the student has to re-upload and * re-run extraction from scratch. */
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
    if (!selectedFile) return false;
    const extension = selectedFile.name.split(".").pop().toLowerCase();
    if (extension !== "pdf") {
      setError("Only PDF holiday calendars are allowed.");
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return false;
    }
    setError("");
    return true;
  };

  const handleFileSelect = (selectedFile) => {
    if (!validateFile(selectedFile)) return;
    setFile(selectedFile);
  };

  const handleInputChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleConvert = async () => {
    if (!file) {
      setError("Please select a holiday calendar PDF.");
      return;
    }
    try {
      setConverting(true);
      setError("");
      const formData = new FormData();
      formData.append("holiday", file);
      const response = await api.post("/holiday/convert", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to convert holiday calendar.",
        );
      }
      navigate("/dashboard/holiday/review", {
        state: {
          holiday: {
            title: response.data.title || "College Holidays",
            year: response.data.year,
            entries: response.data.holidays,
          },
          fileName: response.data.fileName,
        },
      });
    } catch (error) {
      console.error("Holiday conversion error:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to convert holiday calendar.",
      );
    } finally {
      setConverting(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        px: { xs: 1, sm: 3, md: 4 },
        py: { xs: 3, md: 5 },
      }}
    >
      {/* Header Card */}
      <Box
        sx={{
          position: "relative",
          mb: 2,
          p: { xs: 3, sm: 4, md: 4.5 },
          borderRadius: 1,
          overflow: "hidden",
          border: "1px solid",
          borderColor: alpha(theme.palette.primary.main, 0.15),
          background: `
      linear-gradient(
        135deg,
        ${alpha(theme.palette.primary.main, 0.1)} 0%,
        ${alpha(theme.palette.background.paper, 0.95)} 55%,
        ${alpha(theme.palette.primary.dark, 0.06)} 100%
      )
    `,
          boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.08)}`,
        }}
      >
        {/* Decorative Background */}
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            top: -120,
            right: -70,
            background: alpha(theme.palette.primary.main, 0.08),
            filter: "blur(2px)",
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            bottom: -90,
            left: -50,
            background: alpha(theme.palette.primary.main, 0.05),
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "center", sm: "center" }}
          spacing={{ xs: 2.5, sm: 3 }}
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: { xs: 68, sm: 76 },
              height: { xs: 68, sm: 76 },
              flexShrink: 0,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              // Center the icon container on mobile
              alignSelf: { xs: "center", sm: "flex-start" },

              background: `linear-gradient(
      135deg,
      ${theme.palette.primary.main} 0%,
      ${theme.palette.primary.dark} 100%
    )`,

              color: "#fff",

              boxShadow: `0 10px 28px ${alpha(
                theme.palette.primary.main,
                0.3,
              )}`,
            }}
          >
            <CalendarMonth
              sx={{
                fontSize: { xs: 36, sm: 40 },
                display: "block",
              }}
            />
          </Box>

          {/* Text */}
          <Box
            sx={{
              textAlign: { xs: "center", sm: "left" },
              flex: 1,
            }}
          >
            <Stack direction="row" spacing={1} sx={{ mb: 0.8 }}>
              <Typography
                variant="h4"
                fontWeight={800}
                letterSpacing="-0.6px"
                sx={{
                  fontSize: { xs: "1.65rem", sm: "2rem" },
                }}
              >
                Upload Holiday Calendar
              </Typography>
            </Stack>

            <Typography
              color="text.secondary"
              variant="body1"
              sx={{
                maxWidth: 680,
                lineHeight: 1.65,
                fontSize: { xs: "0.92rem", sm: "1rem" },
              }}
            >
              Upload your college holiday calendar in PDF format. ClassPing will
              intelligently extract the dates and occasions, then let you review
              and correct them before saving.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Error */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            bgcolor: alpha(theme.palette.error.main, 0.04),
          }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Upload Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
          overflow: "hidden",
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.background.paper,
            0.8,
          )} 0%, ${theme.palette.background.paper} 100%)`,
          backdropFilter: "blur(20px)",
          boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.04)}`,
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
          {/* Drop Zone */}
          <Box
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              position: "relative",
              border: "2px dashed",
              borderColor: dragging
                ? theme.palette.primary.main
                : file
                  ? alpha(theme.palette.success.main, 0.5)
                  : theme.palette.divider,
              borderRadius: 1,
              minHeight: { xs: 260, sm: 300 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              bgcolor: dragging
                ? alpha(theme.palette.primary.main, 0.06)
                : file
                  ? alpha(theme.palette.success.main, 0.03)
                  : alpha(theme.palette.background.default, 0.5),
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                borderColor: theme.palette.primary.main,
                transform: "translateY(-2px)",
                boxShadow: `0 8px 24px ${alpha(
                  theme.palette.primary.main,
                  0.12,
                )}`,
              },
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              hidden
              onChange={handleInputChange}
            />
            <Stack spacing={2.5} px={3} py={2}>
              {file ? (
                <>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      // Center the icon container on mobile
                      alignSelf: "center",
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ fontSize: 40, color: theme.palette.success.main }}
                    />
                  </Box>
                  <Stack spacing={0.5}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        width: "100%",
                      }}
                    >
                      <PictureAsPdf
                        sx={{
                          fontSize: 22,
                          color: theme.palette.error.main,
                          display: "block",
                          flexShrink: 0,
                        }}
                      />

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          maxWidth: { xs: 200, sm: 400 },
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          lineHeight: 1.2,
                          display: "block",
                        }}
                      >
                        {file.name}
                      </Typography>
                    </Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ justifyContent: "center", display: "flex" }}
                    >
                      File size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    Choose Another PDF
                  </Button>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      alignSelf: "center",
                      mx: "auto",
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      flexShrink: 0,
                    }}
                  >
                    <CloudUpload
                      sx={{
                        fontSize: 40,
                        color: theme.palette.primary.main,
                        display: "block",
                      }}
                    />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>
                    Drop your holiday PDF here
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    sx={{
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      boxShadow: `0 4px 14px ${alpha(
                        theme.palette.primary.main,
                        0.35,
                      )}`,
                      "&:hover": {
                        boxShadow: `0 6px 20px ${alpha(
                          theme.palette.primary.main,
                          0.45,
                        )}`,
                      },
                    }}
                  >
                    Select PDF
                  </Button>
                </>
              )}
            </Stack>
          </Box>

          <Divider sx={{ my: 3.5 }} />

          {/* Footer Actions */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2.5}
            sx={{ justifyContent: { xs: "stretch", sm: "space-between" } }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 2,
                border: "1px solid",
                borderColor: alpha(theme.palette.error.main, 0.12),
                bgcolor: alpha(theme.palette.error.main, 0.035),
              }}
            >
              {/* PDF Icon */}
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: 2.25,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                }}
              >
                <PictureAsPdf
                  sx={{
                    fontSize: 23,
                    color: theme.palette.error.main,
                  }}
                />
              </Box>

              {/* Details */}
              <Box>
                <Typography
                  variant="body2"
                  fontWeight={700}
                  sx={{ lineHeight: 1.4 }}
                >
                  PDF document
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ lineHeight: 1.4 }}
                >
                  Only pdf files allowed & Maximum 10 MB
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              size="large"
              disabled={!file || converting}
              startIcon={
                converting ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <PlayForWorkIcon />
                )
              }
              onClick={handleConvert}
              sx={{
                minWidth: { xs: "100%", sm: 300 },
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
                py: 1.2,
                boxShadow: file
                  ? `0 4px 16px ${alpha(theme.palette.primary.main, 0.35)}`
                  : "none",
                "&:hover": {
                  boxShadow: file
                    ? `0 6px 24px ${alpha(theme.palette.primary.main, 0.45)}`
                    : "none",
                },
              }}
            >
              {converting ? "Reading PDF..." : "Extract Holidays"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Information */}
      <Alert
        severity="info"
        icon={<InfoOutlined />}
        sx={{
          mt: 4,
          borderRadius: 1,
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          bgcolor: alpha(theme.palette.info.main, 0.04),
          "& .MuiAlert-icon": {
            color: theme.palette.info.main,
          },
        }}
      >
        <Typography variant="body2" fontWeight={500}>
          Your holiday list will be extracted first. You can review and edit the
          holidays before confirming them.
        </Typography>
      </Alert>

      {/* Blocking processing dialog — no close affordance while converting is true */}
      <Dialog
        open={converting}
        onClose={() => {}}
        disableEscapeKeyDown
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
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
              {/* Outer Glow */}
              <Box
                sx={{
                  position: "absolute",
                  inset: -8,
                  borderRadius: "50%",
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                }}
              />

              {/* Progress Ring */}
              <CircularProgress
                size={76}
                thickness={2.5}
                sx={{
                  position: "absolute",
                  inset: 3,
                  color: "primary.main",
                }}
              />

              {/* Icon Container */}
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
                <AutoAwesome
                  sx={{
                    fontSize: 26,
                    color: "primary.main",
                    display: "block",
                  }}
                />
              </Box>
            </Box>

            {/* Heading + Description */}
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
                Analyzing your calendar
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
                sx={{
                  direction: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  spacing: 1.25,
                  width: "100%",
                  textAlign: "center",
                }}
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
                "& .MuiAlert-icon": {
                  flexShrink: 0,
                  mr: 1,
                },
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
                Please keep this tab open while your calendar is being
                processed. Larger PDFs may take a little longer.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UploadHoliday;
