import { useState } from "react";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
} from "@mui/material";

import {
  Add,
  Delete,
  Save,
  ExpandMore,
  EventNote,
  School,
  Person,
  MeetingRoom,
  AccessTime,
  CalendarMonth,
  CloudUpload,
  Schedule,
} from "@mui/icons-material";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const ReviewTimetable = ({
  timetable,
  setTimetable,
  onSaveChanges,
  onUploadAgain,
}) => {
  const [expandedDay, setExpandedDay] = useState("Monday");

  if (!timetable) {
    return null;
  }

  // Group entries by day
  const groupedByDay = DAYS.reduce((acc, day) => {
    acc[day] = (timetable.entries || []).filter(
      (entry) => entry.day === day
    );
    return acc;
  }, {});

  const updateEntryField = (globalIndex, field, value) => {
    setTimetable((previous) => ({
      ...previous,
      entries: previous.entries.map((entry, i) =>
        i === globalIndex ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  const addEntryForDay = (day) => {
    setTimetable((previous) => ({
      ...previous,
      entries: [
        ...previous.entries,
        {
          day,
          startTime: "",
          endTime: "",
          subject: "",
          faculty: "",
          room: "",
        },
      ],
    }));
    setExpandedDay(day);
  };

  const deleteEntry = (globalIndex) => {
    setTimetable((previous) => ({
      ...previous,
      entries: previous.entries.filter((_, i) => i !== globalIndex),
    }));
  };

  const toggleDay = (day) => {
    setExpandedDay((prev) => (prev === day ? null : day));
  };

  const totalClasses = timetable.entries?.length || 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : alpha(theme.palette.primary.main, 0.02),
        py: { xs: 3, sm: 4, md: 5 },
        px: { xs: 1.5, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 1000, mx: "auto", width: "100%" }}>
        {/* ================= HEADER ================= */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 3, sm: 4 },
          }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", mb: 0.5 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  boxShadow: (theme) =>
                    `0 6px 18px ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
              >
                <EventNote fontSize="small" />
              </Box>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                Review Timetable
              </Typography>
            </Stack>
            <Typography
              color="text.secondary"
              sx={{
                fontSize: { xs: "0.875rem", sm: "1rem" },
                maxWidth: 520,
              }}
            >
              Review your classes day by day and correct anything before saving.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={onUploadAgain}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              flexShrink: 0,
              borderColor: "divider",
              color: "text.primary",
              "&:hover": {
                borderColor: "primary.main",
                color: "primary.main",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            Upload Again
          </Button>
        </Stack>

        {/* ================= TIMETABLE INFO ================= */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(0,0,0,0.4)"
                : "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center", mb: 2.5 }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                }}
              >
                <School fontSize="small" />
              </Box>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
              >
                Timetable Information
              </Typography>
            </Stack>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Timetable Title"
                placeholder="e.g. Fall 2024 Schedule"
                value={timetable.title || ""}
                onChange={(e) =>
                  setTimetable((previous) => ({
                    ...previous,
                    title: e.target.value,
                  }))
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Semester"
                placeholder="e.g. Semester 5"
                value={timetable.semester || ""}
                onChange={(e) =>
                  setTimetable((previous) => ({
                    ...previous,
                    semester: e.target.value,
                  }))
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* ================= SUMMARY BAR ================= */}
        <Box
          sx={{
            mb: 2.5,
            px: { xs: 2, sm: 2.5 },
            py: 1.75,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: "center" }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.12),
                color: "secondary.main",
              }}
            >
              <Schedule fontSize="small" />
            </Box>
            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ lineHeight: 1.2 }}
              >
                {totalClasses} {totalClasses === 1 ? "class" : "classes found"}
              </Typography>
            </Box>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Tap a day to expand and edit its classes
          </Typography>
        </Box>

        {/* ================= DAY-WISE ACCORDIONS ================= */}
        <Stack spacing={1.5}>
          {DAYS.map((day) => {
            const dayEntries = groupedByDay[day];
            const isExpanded = expandedDay === day;
            const hasClasses = dayEntries.length > 0;

            return (
              <Accordion
                key={day}
                expanded={isExpanded}
                onChange={() => toggleDay(day)}
                elevation={0}
                disableGutters
                sx={{
                  borderRadius: 1.5,
                  border: "1px solid",
                  borderColor: isExpanded ? "primary.main" : "divider",
                  bgcolor: "background.paper",
                  transition: "all 0.25s ease",
                  overflow: "hidden",
                  "&:before": { display: "none" },
                  boxShadow: isExpanded
                    ? (theme) =>
                        `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`
                    : "none",
                  "&.Mui-expanded": {
                    margin: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMore
                      sx={{
                        transition: "transform 0.25s ease",
                        color: isExpanded ? "primary.main" : "text.secondary",
                      }}
                    />
                  }
                  sx={{
                    px: { xs: 1.75, sm: 2 },
                    py: 1,
                    minHeight: { xs: 64, sm: 68 },
                    "& .MuiAccordionSummary-content": {
                      margin: "12px 0",
                      alignItems: "center",
                    },
                    "&.Mui-expanded": {
                      minHeight: { xs: 64, sm: 68 },
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: "center", flex: 1, minWidth: 0 }}
                  >
                    {/* Day badge */}
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        bgcolor: isExpanded
                          ? "primary.main"
                          : (theme) => alpha(theme.palette.primary.main, 0.1),
                        color: isExpanded
                          ? "primary.contrastText"
                          : "primary.main",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <CalendarMonth fontSize="small" />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: { xs: "0.95rem", sm: "1.05rem" },
                          lineHeight: 1.2,
                        }}
                      >
                        {day}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {hasClasses
                          ? `${dayEntries.length} ${
                              dayEntries.length === 1 ? "class" : "classes"
                            }`
                          : "No classes"}
                      </Typography>
                    </Box>

                    {/* Day summary chips */}
                    {hasClasses && !isExpanded && (
                      <Stack
                        direction="row"
                        spacing={0.75}
                        sx={{
                          display: { xs: "none", md: "flex" },
                          mr: 1,
                        }}
                      >
                        {dayEntries.slice(0, 3).map((entry, i) => (
                          <Box
                            key={i}
                            sx={{
                              px: 1,
                              py: 0.25,
                              borderRadius: 1.5,
                              bgcolor: (theme) =>
                                alpha(theme.palette.primary.main, 0.08),
                              color: "primary.main",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              maxWidth: 100,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {entry.startTime || "—"}
                          </Box>
                        ))}
                        {dayEntries.length > 3 && (
                          <Box
                            sx={{
                              px: 1,
                              py: 0.25,
                              borderRadius: 1.5,
                              bgcolor: "action.hover",
                              color: "text.secondary",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                            }}
                          >
                            +{dayEntries.length - 3}
                          </Box>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </AccordionSummary>

                <AccordionDetails
                  sx={{
                    px: { xs: 1.75, sm: 2.5 },
                    pb: { xs: 2, sm: 2.5 },
                    pt: 0,
                  }}
                >
                  <Divider sx={{ mb: 2 }} />

                  {hasClasses ? (
                    <Stack spacing={1.5}>
                      {dayEntries.map((entry) => {
                        // Find global index for updates
                        const globalIndex = timetable.entries.findIndex(
                          (e) =>
                            e === entry ||
                            (e.day === entry.day &&
                              e.subject === entry.subject &&
                              e.startTime === entry.startTime &&
                              e.endTime === entry.endTime)
                        );

                        return (
                          <Box
                            key={globalIndex}
                            sx={{
                              p: { xs: 1.75, sm: 2 },
                              borderRadius: 2.5,
                              border: "1px solid",
                              borderColor: "divider",
                              bgcolor: (theme) =>
                                theme.palette.mode === "dark"
                                  ? alpha(theme.palette.background.paper, 0.5)
                                  : alpha(theme.palette.grey[50], 0.6),
                              transition: "all 0.2s ease",
                              "&:hover": {
                                borderColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.4),
                              },
                            }}
                          >
                            {/* Row header: time + delete */}
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{
                                alignItems: "center",
                                justifyContent: "space-between",
                                mb: 1.5,
                              }}
                            >
                              <Stack
                                direction="row"
                                spacing={0.75}
                                sx={{ alignItems: "center" }}
                              >
                                <AccessTime
                                  sx={{ fontSize: 16, color: "primary.main" }}
                                />
                                <Typography
                                  variant="caption"
                                  fontWeight={700}
                                  color="primary.main"
                                >
                                  {entry.startTime || "—"} –{" "}
                                  {entry.endTime || "—"}
                                </Typography>
                              </Stack>

                              <Tooltip title="Delete class" arrow>
                                <IconButton
                                  size="small"
                                  onClick={() => deleteEntry(globalIndex)}
                                  sx={{
                                    color: "text.secondary",
                                    "&:hover": {
                                      color: "error.main",
                                      bgcolor: (theme) =>
                                        alpha(theme.palette.error.main, 0.1),
                                    },
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>

                            {/* Form fields */}
                            <Stack spacing={1.5}>
                              {/* Times */}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: { xs: "column", sm: "row" },
                                  gap: 1.5,
                                }}
                              >
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Start Time"
                                  type="time"
                                  value={entry.startTime || ""}
                                  onChange={(e) =>
                                    updateEntryField(
                                      globalIndex,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  slotProps={{
                                    inputLabel: { shrink: true },
                                  }}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="End Time"
                                  type="time"
                                  value={entry.endTime || ""}
                                  onChange={(e) =>
                                    updateEntryField(
                                      globalIndex,
                                      "endTime",
                                      e.target.value
                                    )
                                  }
                                  slotProps={{
                                    inputLabel: { shrink: true },
                                  }}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                              </Box>

                              {/* Subject */}
                              <TextField
                                fullWidth
                                size="small"
                                required
                                label="Subject"
                                placeholder="e.g. Data Structures"
                                value={entry.subject || ""}
                                onChange={(e) =>
                                  updateEntryField(
                                    globalIndex,
                                    "subject",
                                    e.target.value
                                  )
                                }
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                  },
                                }}
                              />

                              {/* Faculty + Room */}
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: { xs: "column", md: "row" },
                                  gap: 1.5,
                                }}
                              >
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Faculty"
                                  placeholder="Not provided"
                                  value={entry.faculty || ""}
                                  onChange={(e) =>
                                    updateEntryField(
                                      globalIndex,
                                      "faculty",
                                      e.target.value
                                    )
                                  }
                                  slotProps={{
                                    input: {
                                      startAdornment: (
                                        <Person
                                          sx={{
                                            fontSize: 16,
                                            mr: 1,
                                            color: "text.secondary",
                                          }}
                                        />
                                      ),
                                    },
                                  }}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Room"
                                  placeholder="Not provided"
                                  value={entry.room || ""}
                                  onChange={(e) =>
                                    updateEntryField(
                                      globalIndex,
                                      "room",
                                      e.target.value
                                    )
                                  }
                                  slotProps={{
                                    input: {
                                      startAdornment: (
                                        <MeetingRoom
                                          sx={{
                                            fontSize: 16,
                                            mr: 1,
                                            color: "text.secondary",
                                          }}
                                        />
                                      ),
                                    },
                                  }}
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                              </Box>
                            </Stack>
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Box
                      sx={{
                        py: 3,
                        textAlign: "center",
                        borderRadius: 2.5,
                        border: "1px dashed",
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        No classes scheduled for {day}
                      </Typography>
                    </Box>
                  )}

                  {/* Add class button for this day */}
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => addEntryForDay(day)}
                    sx={{
                      mt: 2,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      borderStyle: "dashed",
                      borderWidth: 1.5,
                      borderColor: "divider",
                      color: "text.secondary",
                      "&:hover": {
                        borderStyle: "dashed",
                        borderWidth: 1.5,
                        borderColor: "primary.main",
                        color: "primary.main",
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    Add Class to {day}
                  </Button>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Stack>

        {/* ================= SAVE ================= */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={onSaveChanges}
          sx={{
            mt: 3,
            py: { xs: 1.4, sm: 1.6 },
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
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          Save Changes &amp; Preview
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewTimetable;