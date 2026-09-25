import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import {
  AccessTime,
  MeetingRoomOutlined,
  EventNote,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import api from "../../services/api";

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Each day gets its own accent color, used for the icon, the card's
// left accent bar, and the hover glow.
const DAY_ACCENTS = [
  "#4F46E5", // Monday - indigo
  "#0D9488", // Tuesday - teal
  "#DB2777", // Wednesday - pink
  "#D97706", // Thursday - amber
  "#7C3AED", // Friday - violet
  "#B4762E", // Saturday - bronze (weekend accent)
  "#E11D48", // Sunday - rose
];

const toMinutes = (time) => {
  if (!time) return 0;
  const match = String(time).match(/(\d+):(\d+)/);
  if (!match) return 0;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
};

const ViewTimetable = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [expandedDays, setExpandedDays] = useState({});

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/timetable");

      setTimetable(response.data.timetable);
    } catch (error) {
      console.error("Fetch timetable error:", error);

      setError(error.response?.data?.message || "Failed to load timetable.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await api.delete("/timetable");

      setTimetable(null);
      setDeleteDialog(false);
    } catch (error) {
      console.error("Delete timetable error:", error);

      setError(error.response?.data?.message || "Failed to delete timetable.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Group entries by day, ordered Mon -> Sun, each day's classes sorted by start time
  const groupedByDay = useMemo(() => {
    if (!timetable?.entries?.length) return [];

    const map = new Map();

    timetable.entries.forEach((entry) => {
      const day = entry.day || "Unscheduled";
      if (!map.has(day)) map.set(day, []);
      map.get(day).push(entry);
    });

    const known = DAY_ORDER.filter((d) => map.has(d));
    const unknown = [...map.keys()].filter((d) => !DAY_ORDER.includes(d));

    return [...known, ...unknown].map((day) => ({
      day,
      accent: DAY_ACCENTS[DAY_ORDER.indexOf(day)] || "#3E5C9A",
      entries: [...map.get(day)].sort(
        (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime),
      ),
    }));
  }, [timetable]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={2}>
          <CircularProgress
            size={32}
            thickness={4}
            sx={{ alignSelf: "center" }}
          />
          <Typography color="text.secondary">
            Loading your timetable…
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 6 },
        bgcolor: "background.default",
        px: { xs: 1, md: 1 },
      }}
    >
      <Container
        maxWidth="md"
        disableGutters
        sx={{ px: { xs: 1, sm: 3, md: 4 } }}
      >
        {/* Header */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 1,
            mb: 4,
            px: { xs: 2.5, sm: 4 },
            py: { xs: 2.5, sm: 3 },
            background: isDark
              ? "linear-gradient(120deg, #211f3b 0%, #241f3d 55%, #1d2036 100%)"
              : "linear-gradient(120deg, #eef1fb 0%, #f3f0fb 55%, #eef2fb 100%)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Decorative blurred circles */}
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: 90,
              width: 140,
              height: 140,
              borderRadius: "50%",
              bgcolor: alpha("#a78bfa", isDark ? 0.16 : 0.25),
              filter: "blur(4px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -30,
              width: 160,
              height: 160,
              borderRadius: "50%",
              bgcolor: alpha("#6366f1", isDark ? 0.14 : 0.18),
              filter: "blur(6px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -60,
              right: 180,
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: alpha("#93c5fd", isDark ? 0.14 : 0.25),
              filter: "blur(4px)",
            }}
          />

          <Stack
            direction="row"
            spacing={2}
            sx={{
              position: "relative",
              zIndex: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Left: icon + title */}
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <Box
                sx={{
                  position: "relative",
                  flexShrink: 0,
                  width: { xs: 46, sm: 64 },
                  height: { xs: 46, sm: 64 },
                  borderRadius: 1,
                  background: isDark
                    ? "linear-gradient(145deg, #2b2947 0%, #34314f 100%)"
                    : "linear-gradient(145deg, #ffffff 0%, #eef1ff 100%)",
                  boxShadow: isDark
                    ? "0 8px 20px rgba(0, 0, 0, 0.35)"
                    : "0 8px 20px rgba(99, 102, 241, 0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarMonthRoundedIcon
                  sx={{
                    fontSize: { xs: 28, sm: 36 },
                    color: isDark ? "#a5b4fc" : "#4f46e5",
                  }}
                />
              </Box>

              <Box sx={{ minWidth: 0, alignSelf: "center" }}>
                <Typography
                  variant="h4"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    fontSize: { xs: "1.2rem", sm: "2rem" },
                    lineHeight: 1.2,
                    color: "text.primary",
                  }}
                >
                  My Timetable
                </Typography>
                <Typography
                  noWrap
                  sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.8rem", sm: "1.05rem" },
                    color: "text.secondary",
                    mt: 0.3,
                  }}
                >
                  Your weekly class schedule
                </Typography>
              </Box>
            </Stack>

            {/* Right: Delete All button */}
            {timetable && (
              <Button
                variant="text"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={() => setDeleteDialog(true)}
                sx={{
                  border: "1px solid",
                  flexShrink: 0,
                  borderRadius: 1,
                  textTransform: "none",
                  fontWeight: 700,
                  px: { xs: 1, sm: 2.5 },
                  py: 1,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  bgcolor: alpha(
                    theme.palette.error.main,
                    isDark ? 0.18 : 0.12,
                  ),
                  borderColor: alpha(theme.palette.error.main, 0.3),
                  color: isDark ? "#f87171" : "#dc2626",
                  "&:hover": {
                    bgcolor: alpha(
                      theme.palette.error.main,
                      isDark ? 0.28 : 0.2,
                    ),
                  },
                }}
              >
                Delete All
              </Button>
            )}
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Empty state */}
        {!timetable ? (
          <Card
            variant="outlined"
            sx={{
              borderRadius: 1,
              textAlign: "center",
              py: 8,
              borderStyle: "dashed",
              borderColor: "grey.300",
              bgcolor: "background.paper",
            }}
          >
            <CardContent>
              <EventNote sx={{ fontSize: 56, color: "grey.400", mb: 1.5 }} />

              <Typography variant="h6" fontWeight={700} gutterBottom>
                No timetable saved yet
              </Typography>

              <Typography color="text.secondary" mb={3}>
                Add your class schedule to see it here.
              </Typography>

              <Button
                variant="contained"
                disableElevation
                onClick={() => navigate("/dashboard/timetable/upload")}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Add timetable
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Day-by-day schedule */}
            <Stack spacing={3}>
              {groupedByDay.map(({ day, entries, accent }) => {
                const isExpanded = expandedDays[day] !== false; // default true

                return (
                  <Box
                    key={day}
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                      mb: 1,
                      border: "1px solid",
                      borderColor: alpha(accent, isDark ? 0.28 : 0.18),
                      background: isDark
                        ? `linear-gradient(120deg, ${alpha(accent, 0.16)} 0%, ${alpha(
                            accent,
                            0.08,
                          )} 60%, ${alpha(accent, 0.12)} 100%)`
                        : `linear-gradient(120deg, ${alpha(accent, 0.09)} 0%, ${alpha(
                            accent,
                            0.06,
                          )} 60%, ${alpha(accent, 0.08)} 100%)`,
                      transition:
                        "border-color 0.22s ease, box-shadow 0.22s ease",
                      "&:hover": {
                        boxShadow: `0 12px 32px -20px ${alpha(accent, 0.45)}`,
                      },
                    }}
                  >
                    {/* Left accent bar */}
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background: `linear-gradient(180deg, ${accent} 0%, ${alpha(
                          accent,
                          0.55,
                        )} 100%)`,
                      }}
                    />

                    {/* Day header */}
                    <Stack
                      direction="row"
                      spacing={1.5}
                      onClick={() => toggleDay(day)}
                      sx={{
                        pl: { xs: 2.5, sm: 3 },
                        pr: { xs: 2, sm: 2.5 },
                        py: { xs: 1.25, sm: 1.5 },
                        cursor: "pointer",
                        userSelect: "none",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* Left: icon + day name + class count */}
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ minWidth: 0 }}
                      >
                        <Box
                          sx={{
                            flexShrink: 0,
                            width: { xs: 40, sm: 44 },
                            height: { xs: 40, sm: 44 },
                            borderRadius: 1,
                            bgcolor: alpha(accent, isDark ? 0.22 : 0.14),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CalendarMonthRoundedIcon
                            sx={{ fontSize: { xs: 20, sm: 22 }, color: accent }}
                          />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "1rem", sm: "1.15rem" },
                              letterSpacing: "-0.01em",
                              color: "text.primary",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: 1.25,
                            }}
                          >
                            {day}
                          </Typography>
                          <Typography
                            sx={{
                              fontWeight: 500,
                              fontSize: { xs: "0.8rem", sm: "0.85rem" },
                              color: "text.secondary",
                              lineHeight: 1.3,
                            }}
                          >
                            {entries.length}{" "}
                            {entries.length === 1 ? "class" : "classes"}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Right: round toggle button */}
                      <IconButton
                        size="small"
                        sx={{
                          flexShrink: 0,
                          width: { xs: 34, sm: 38 },
                          height: { xs: 34, sm: 38 },
                          bgcolor: "background.paper",
                          color: accent,
                          boxShadow: isDark
                            ? "0 4px 10px rgba(0, 0, 0, 0.4)"
                            : "0 4px 10px rgba(15, 23, 42, 0.08)",
                          "&:hover": {
                            bgcolor: "background.paper",
                          },
                        }}
                      >
                        {isExpanded ? (
                          <KeyboardArrowUpRoundedIcon fontSize="small" />
                        ) : (
                          <KeyboardArrowDownRoundedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Stack>

                    {/* Class grid */}
                    {isExpanded && (
                      <Box
                        sx={{
                          p: { xs: 1.5, sm: 2 },
                          pl: { xs: 2, sm: 2.5 },
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(2, 1fr)",
                          },
                          gap: 1.5,
                        }}
                      >
                        {entries.map((entry, index) => (
                          <ClassCard
                            key={index}
                            entry={entry}
                            accent={accent}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </>
        )}
      </Container>

      {/* Delete confirmation */}
      <Dialog
        open={deleteDialog}
        onClose={() => !deleting && setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete timetable?</DialogTitle>

        <DialogContent>
          <DialogContentText>
            This will permanently remove your saved timetable. You can upload a
            new one later.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            disabled={deleting}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            disableElevation
            onClick={handleDelete}
            disabled={deleting}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600 }}
            startIcon={
              deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteOutlineOutlinedIcon />
              )
            }
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const ClassCard = ({ entry, accent }) => {
  const isLab =
    entry.subject?.toLowerCase().includes("lab") ||
    entry.type?.toLowerCase() === "lab";

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        bgcolor: "background.paper",
        transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: alpha(accent, 0.4),
        },
      }}
    >
      {/* Left accent bar */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: `linear-gradient(180deg, ${accent} 0%, ${alpha(
            accent,
            0.55,
          )} 100%)`,
        }}
      />

      {/* Soft accent glow in corner */}
      <Box
        sx={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(
            accent,
            0.08,
          )} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <CardContent
        sx={{
          pl: 3,
          pr: 2.5,
          py: 2.25,
          position: "relative",
          "&:last-child": { pb: 2.25 },
        }}
      >
        {/* Top row: icon + subject on left, time pill on right */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 1.5, minHeight: 30, alignItems: "center" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              borderRadius: 1.25,
              bgcolor: alpha(accent, 0.1),
              color: accent,
              flexShrink: 0,
            }}
          >
            {isLab ? (
              <ComputerOutlinedIcon sx={{ fontSize: 14 }} />
            ) : (
              <MenuBookOutlinedIcon sx={{ fontSize: 14 }} />
            )}
          </Box>

          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1.05rem",
              letterSpacing: "-0.01em",
              lineHeight: 1.35,
              color: "text.primary",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              pr: { xs: 12, sm: 14 },
            }}
          >
            {entry.subject}
          </Typography>

          <Box
            sx={{
              position: "absolute",
              top: 18,
              right: 20,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.6,
              px: 1.1,
              py: 0.4,
              borderRadius: 1.5,
              bgcolor: alpha(accent, 0.08),
              border: "1px solid",
              borderColor: alpha(accent, 0.15),
              flexShrink: 0,
            }}
          >
            <AccessTime sx={{ fontSize: 13, color: accent }} />
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: accent,
                letterSpacing: "-0.005em",
                whiteSpace: "nowrap",
              }}
            >
              {entry.startTime} – {entry.endTime}
            </Typography>
          </Box>
        </Stack>

        {/* Meta row: faculty + room in a single row */}
        <Stack
          direction="row"
          spacing={2}
          sx={{ minWidth: 0, alignItems: "center" }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ minWidth: 0, alignItems: "center", flex: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 1,
                bgcolor: "grey.100",
                color: "text.secondary",
                flexShrink: 0,
              }}
            >
              <PersonOutlinedIcon sx={{ fontSize: 13 }} />
            </Box>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: "text.secondary",
                fontWeight: 500,
                lineHeight: 1.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {entry.faculty || "Not provided"}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={0.75}
            sx={{ minWidth: 0, alignItems: "center", flex: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 22,
                height: 22,
                borderRadius: 1,
                bgcolor: "grey.100",
                color: "text.secondary",
                flexShrink: 0,
              }}
            >
              <MeetingRoomOutlined sx={{ fontSize: 13 }} />
            </Box>
            <Typography
              sx={{
                fontSize: "0.82rem",
                color: "text.secondary",
                fontWeight: 500,
                lineHeight: 1.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {entry.room || "Not provided"}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ViewTimetable;
