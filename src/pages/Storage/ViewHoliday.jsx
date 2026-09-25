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
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";

import {
  EventAvailable,
  CalendarMonth,
  Celebration,
  DescriptionOutlined,
  Search,
  Close,
  FilterList,
  KeyboardArrowDown,
  Check,
  CheckCircle,
  EventBusy,
} from "@mui/icons-material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import api from "../../services/api";
import { useTheme as useAppTheme } from "../../context/ThemeContext";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ViewHoliday = () => {
  const theme = useTheme();
  const { mode } = useAppTheme();
  const navigate = useNavigate();

  const [holiday, setHoliday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const isDark = theme.palette.mode === "dark";

  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "today" | "upcoming" | "passed"
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [statusAnchor, setStatusAnchor] = useState(null);
  const filterOpen = Boolean(filterAnchor);
  const statusOpen = Boolean(statusAnchor);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchHoliday();
  }, []);

  const fetchHoliday = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/holiday");
      setHoliday(response.data.holiday);
    } catch (error) {
      console.error("Fetch holiday error:", error);
      setError(
        error.response?.data?.message || "Failed to load holiday calendar.",
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = useMemo(() => {
    if (!holiday?.entries?.length) return [];

    const query = search.trim().toLowerCase();

    return holiday.entries.filter((entry) => {
      const parsed = new Date(entry.date);

      const monthMatches =
        monthFilter === "all" ||
        (!Number.isNaN(parsed.getTime()) && parsed.getMonth() === monthFilter);

      if (!monthMatches) return false;

      if (statusFilter !== "all") {
        const status = getHolidayStatus(entry.date);
        if (status !== statusFilter) return false;
      }

      if (!query) return true;

      const haystack =
        `${entry.occasion || ""} ${entry.description || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [holiday, search, monthFilter, statusFilter]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete("/holiday");
      setHoliday(null);
      setDeleteDialog(false);
    } catch (error) {
      console.error("Delete holiday error:", error);
      setError(
        error.response?.data?.message || "Failed to delete holiday calendar.",
      );
    } finally {
      setDeleting(false);
    }
  };

  // Months that actually have holidays, in calendar order — used to build the filter chips.
  const monthsPresent = useMemo(() => {
    if (!holiday?.entries?.length) return [];

    const found = new Set();
    holiday.entries.forEach((entry) => {
      const parsed = new Date(entry.date);
      if (!Number.isNaN(parsed.getTime())) {
        found.add(parsed.getMonth());
      }
    });

    return MONTHS.map((name, index) => ({ index, name })).filter((m) =>
      found.has(m.index),
    );
  }, [holiday]);

  const hasActiveFilters =
    search.trim() !== "" || monthFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setMonthFilter("all");
    setStatusFilter("all");
  };

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
          <CircularProgress color="success" sx={{ alignSelf: "center" }} />
          <Typography sx={{ color: "text.secondary" }}>
            Loading your holiday calendar...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
        background:
          mode === "dark"
            ? "linear-gradient(135deg, #121212 0%, #102a22 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #ecfdf5 100%)",
      }}
    >
      <Container
        maxWidth="lg"
        disableGutters
        sx={{ px: { xs: 1, sm: 3, md: 4 } }}
      >
        {/* ── Header ── */}
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
                <CalendarMonth
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
                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                    lineHeight: 1.2,
                    color: "text.primary",
                  }}
                >
                  Holiday Calendar
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
                  Your scheduled holidays at a glance
                </Typography>
              </Box>
            </Stack>

            {/* Right: Delete All button */}
            {holiday && (
              <Button
                variant="text"
                startIcon={<DeleteOutlineOutlinedIcon />}
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
          <Alert
            severity="error"
            onClose={() => setError("")}
            sx={{
              mb: 3,
              borderRadius: 2.5,
              border: "1px solid",
              borderColor: alpha(theme.palette.error.main, 0.2),
            }}
          >
            {error}
          </Alert>
        )}

        {/* Empty state — no calendar saved at all */}
        {!holiday ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              textAlign: "center",
              py: { xs: 6, sm: 8 },
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(theme.palette.success.main, 0.08),
                  mb: 2.5,
                }}
              >
                <EventAvailable sx={{ fontSize: 40, color: "success.main" }} />
              </Box>

              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1, letterSpacing: "-0.01em" }}
              >
                No holiday calendar saved
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 3.5,
                  maxWidth: 420,
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                Upload your college holiday calendar to prevent reminders on
                holidays.
              </Typography>

              <Button
                variant="contained"
                color="success"
                onClick={() => navigate("/dashboard/holiday/upload")}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  boxShadow: `0 6px 18px ${alpha(theme.palette.success.main, 0.3)}`,
                  "&:hover": {
                    boxShadow: `0 8px 24px ${alpha(theme.palette.success.main, 0.4)}`,
                  },
                }}
              >
                Add Holiday Calendar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Summary */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 1.5,
                mb: 3,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3.5, md: 4 } }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: `linear-gradient(135deg, ${alpha(
                          theme.palette.success.main,
                          0.12,
                        )}, ${alpha(theme.palette.success.main, 0.2)})`,
                        color: "success.main",
                        border: "1px solid",
                        borderColor: alpha(theme.palette.success.main, 0.2),
                        flexShrink: 0,
                      }}
                    >
                      <CalendarMonth />
                    </Box>

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          letterSpacing: "-0.015em",
                          fontSize: { xs: "1.1rem", sm: "1.25rem" },
                        }}
                      >
                        {holiday.title || "College Holidays"}
                      </Typography>

                      <Typography
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.875rem",
                          mt: 0.25,
                        }}
                      >
                        Holiday calendar for {holiday.year}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <SummaryItem
                    icon={<Celebration />}
                    label="Total Holidays"
                    value={holiday.entries?.length || 0}
                  />
                  <SummaryItem
                    icon={<CalendarMonth />}
                    label="Year"
                    value={holiday.year || "N/A"}
                  />
                  <SummaryItem
                    icon={<DescriptionOutlined />}
                    label="Status"
                    value="Verified"
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Search + month filter */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 1.5,
                mb: 3,
                border: "1px solid",
                borderColor: "divider",

                bgcolor: "background.paper",
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <TextField
                    fullWidth
                    placeholder="Search holidays by name or description"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search
                              sx={{ fontSize: 20, color: "text.secondary" }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: search && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearch("")}
                            >
                              <Close sx={{ fontSize: 16 }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        bgcolor: "background.default",
                      },
                    }}
                  />

                  {/* Filter row — stays on one line on mobile */}
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      flexShrink: 0,
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    {/* Status filter */}
                    <Button
                      onClick={(e) => setStatusAnchor(e.currentTarget)}
                      startIcon={<FilterList sx={{ fontSize: 18 }} />}
                      endIcon={<KeyboardArrowDown sx={{ fontSize: 18 }} />}
                      sx={{
                        flex: 1,
                        justifyContent: "space-between",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        borderRadius: 1,
                        px: 2,
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        border: "1px solid",
                        borderColor:
                          statusFilter !== "all" ? "success.main" : "divider",
                        bgcolor:
                          statusFilter !== "all"
                            ? alpha(theme.palette.success.main, 0.08)
                            : "background.default",
                        color:
                          statusFilter !== "all"
                            ? "success.dark"
                            : "text.primary",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.success.main, 0.12),
                          borderColor: "success.main",
                        },
                      }}
                    >
                      {statusFilter === "all"
                        ? "All status"
                        : statusFilter === "today"
                          ? "Today"
                          : statusFilter === "upcoming"
                            ? "Upcoming"
                            : "Passed"}
                    </Button>

                    <Menu
                      anchorEl={statusAnchor}
                      open={statusOpen}
                      onClose={() => setStatusAnchor(null)}
                      slotProps={{
                        paper: {
                          sx: {
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: `0 16px 40px -12px ${alpha(
                              theme.palette.common.black,
                              0.18,
                            )}`,
                            mt: 0.5,
                            minWidth: 200,
                          },
                        },
                      }}
                    >
                      {[
                        { value: "all", label: "All status" },
                        { value: "today", label: "Today" },
                        { value: "upcoming", label: "Upcoming" },
                        { value: "passed", label: "Passed" },
                      ].map((opt) => (
                        <MenuItem
                          key={opt.value}
                          onClick={() => {
                            setStatusFilter(opt.value);
                            setStatusAnchor(null);
                          }}
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: statusFilter === opt.value ? 700 : 400,
                          }}
                        >
                          <ListItemText>{opt.label}</ListItemText>
                          {statusFilter === opt.value && (
                            <ListItemIcon
                              sx={{ minWidth: "auto", color: "success.main" }}
                            >
                              <Check sx={{ fontSize: 18 }} />
                            </ListItemIcon>
                          )}
                        </MenuItem>
                      ))}
                    </Menu>

                    {/* Month filter */}
                    <Button
                      onClick={(e) => setFilterAnchor(e.currentTarget)}
                      startIcon={<FilterList sx={{ fontSize: 18 }} />}
                      endIcon={<KeyboardArrowDown sx={{ fontSize: 18 }} />}
                      sx={{
                        flex: 1,
                        justifyContent: "space-between",
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        borderRadius: 1,
                        px: 2,
                        minWidth: 0,
                        whiteSpace: "nowrap",
                        border: "1px solid",
                        borderColor:
                          monthFilter !== "all" ? "success.main" : "divider",
                        bgcolor:
                          monthFilter !== "all"
                            ? alpha(theme.palette.success.main, 0.08)
                            : "background.default",
                        color:
                          monthFilter !== "all"
                            ? "success.dark"
                            : "text.primary",
                        "&:hover": {
                          bgcolor: alpha(theme.palette.success.main, 0.12),
                          borderColor: "success.main",
                        },
                      }}
                    >
                      {monthFilter === "all"
                        ? "All months"
                        : MONTHS[monthFilter]}
                    </Button>

                    <Menu
                      anchorEl={filterAnchor}
                      open={filterOpen}
                      onClose={() => setFilterAnchor(null)}
                      slotProps={{
                        paper: {
                          sx: {
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: `0 16px 40px -12px ${alpha(
                              theme.palette.common.black,
                              0.18,
                            )}`,
                            mt: 0.5,
                            minWidth: 200,
                            maxHeight: 360,
                          },
                        },
                      }}
                    >
                      <MenuItem
                        onClick={() => {
                          setMonthFilter("all");
                          setFilterAnchor(null);
                        }}
                        sx={{
                          fontSize: "0.875rem",
                          fontWeight: monthFilter === "all" ? 700 : 400,
                        }}
                      >
                        <ListItemText>All months</ListItemText>
                        {monthFilter === "all" && (
                          <ListItemIcon
                            sx={{ minWidth: "auto", color: "success.main" }}
                          >
                            <Check sx={{ fontSize: 18 }} />
                          </ListItemIcon>
                        )}
                      </MenuItem>

                      <Divider sx={{ my: 0.5 }} />

                      {monthsPresent.map((m) => (
                        <MenuItem
                          key={m.index}
                          onClick={() => {
                            setMonthFilter(m.index);
                            setFilterAnchor(null);
                          }}
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: monthFilter === m.index ? 700 : 400,
                          }}
                        >
                          <ListItemText>{m.name}</ListItemText>
                          {monthFilter === m.index && (
                            <ListItemIcon
                              sx={{ minWidth: "auto", color: "success.main" }}
                            >
                              <Check sx={{ fontSize: 18 }} />
                            </ListItemIcon>
                          )}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* List header */}
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              {/* Left: title + count */}
              <Stack direction="row" spacing={1} sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.015em",
                    fontSize: { xs: "1.15rem", sm: "1.25rem" },
                    lineHeight: 1.2,
                  }}
                >
                  Total Holidays
                </Typography>
              </Stack>

              {/* Right: clear filters */}
              {hasActiveFilters && (
                <Button
                  size="small"
                  onClick={clearFilters}
                  startIcon={<CloseRoundedIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    color: "success.main",
                    borderRadius: 999,
                    px: 1.4,
                    py: 0.3,
                    minHeight: 26,
                    lineHeight: 1,
                    bgcolor: "rgba(16,185,129,0.08)",
                    border: "1px solid",
                    borderColor: "rgba(16,185,129,0.22)",
                    "&:hover": {
                      bgcolor: "rgba(16,185,129,0.14)",
                      borderColor: "rgba(16,185,129,0.35)",
                    },
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Stack>

            {/* Holiday list */}
            {filteredEntries.length === 0 ? (
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  textAlign: "center",
                  py: 6,
                  border: "1px dashed",
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>
                  No holidays match your search
                </Typography>
                <Typography
                  sx={{ color: "text.secondary", fontSize: "0.9rem" }}
                >
                  Try a different keyword or month.
                </Typography>
              </Card>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {filteredEntries.map((entry, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: {
                        xs: "1 1 100%",
                        sm: "1 1 calc(50% - 8px)",
                        md: "1 1 calc(33.333% - 11px)",
                      },
                      minWidth: 0,
                    }}
                  >
                    <HolidayCard entry={entry} theme={theme} mode={mode} />
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Delete confirmation */}
      <Dialog
        open={deleteDialog}
        onClose={() => !deleting && setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 0.5 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: "1.15rem", pb: 1 }}>
          Delete Holiday Calendar?
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "0.9rem",
              color: "text.secondary",
              lineHeight: 1.6,
            }}
          >
            This will permanently remove your saved holiday calendar from
            ClassPing. You can upload a new one later.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setDeleteDialog(false)}
            disabled={deleting}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteOutlineOutlinedIcon />
              )
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 2.5,
              boxShadow: "none",
              "&:hover": {
                boxShadow: `0 4px 14px ${alpha(theme.palette.error.main, 0.35)}`,
              },
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const SummaryItem = ({ icon, label, value }) => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        flex: 1,
        p: 2,
        borderRadius: 1.5,
        bgcolor: alpha(theme.palette.success.main, 0.05),
        border: "1px solid",
        borderColor: alpha(theme.palette.success.main, 0.1),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.success.main, 0.12),
          color: "success.main",
          flexShrink: 0,
          "& svg": { fontSize: 18 },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 600,
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "text.primary",
            lineHeight: 1.3,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};

const HolidayCard = ({ entry, theme, mode }) => {
  const status = getHolidayStatus(entry.date);
  const isPassed = status === "passed";
  const isToday = status === "today";

  // Colors: passed = gray, today = success (highlighted), upcoming = success
  const accentColor = isPassed
    ? theme.palette.text.secondary
    : theme.palette.success.main;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: isPassed
          ? "divider"
          : alpha(accentColor, isToday ? 0.45 : 0.2),
        bgcolor: isPassed
          ? alpha(theme.palette.text.primary, mode === "dark" ? 0.08 : 0.025)
          : isToday
            ? alpha(theme.palette.success.main, mode === "dark" ? 0.1 : 0.04)
            : "background.paper",
        opacity: isPassed ? 0.75 : 1,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: isPassed
            ? alpha(theme.palette.text.secondary, 0.3)
            : alpha(accentColor, 0.55),
          boxShadow: isPassed
            ? `0 16px 36px -16px ${alpha(theme.palette.text.secondary, 0.25)}`
            : `0 16px 36px -16px ${alpha(accentColor, 0.4)}`,
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          "&:last-child": { pb: 2.5 },
        }}
      >
        <Stack spacing={2} sx={{ height: "100%" }}>
          {/* Top row: icon + status chip */}
          <Stack direction="row" sx={{ width: "100%" }}>
            {/* Left icon */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isPassed
                  ? `linear-gradient(135deg, ${alpha(
                      theme.palette.text.secondary,
                      0.08,
                    )}, ${alpha(theme.palette.text.secondary, 0.14)})`
                  : `linear-gradient(135deg, ${alpha(
                      theme.palette.success.main,
                      0.12,
                    )}, ${alpha(theme.palette.success.main, 0.22)})`,
                color: isPassed ? "text.secondary" : "success.main",
                border: "1px solid",
                borderColor: isPassed
                  ? alpha(theme.palette.text.secondary, 0.15)
                  : alpha(theme.palette.success.main, 0.2),
                transition: "all 0.25s ease",
                flexShrink: 0,
              }}
            >
              {isPassed ? (
                <EventBusy sx={{ fontSize: 22 }} />
              ) : (
                <Celebration sx={{ fontSize: 22 }} />
              )}
            </Box>

            {/* Top-right status */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                px: 1.2,
                height: 26,
                borderRadius: 1.5,
                fontWeight: 600,
                fontSize: "0.7rem",
                lineHeight: 1,
                ...(isPassed
                  ? {
                      bgcolor: alpha(theme.palette.text.secondary, 0.08),
                      color: "text.secondary",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.text.secondary, 0.18),
                    }
                  : isToday
                    ? {
                        bgcolor: alpha(theme.palette.success.main, 0.18),
                        color: "success.dark",
                        border: "1px solid",
                        borderColor: alpha(theme.palette.success.main, 0.5),
                        boxShadow: `0 0 0 3px ${alpha(
                          theme.palette.success.main,
                          0.12,
                        )}`,
                      }
                    : {
                        bgcolor: alpha(theme.palette.success.main, 0.08),
                        color: "success.dark",
                        border: "1px solid",
                        borderColor: alpha(theme.palette.success.main, 0.2),
                      }),
              }}
            >
              {isPassed && (
                <CheckCircle
                  sx={{
                    fontSize: 14,
                    color: "inherit",
                    flexShrink: 0,
                  }}
                />
              )}

              <Box component="span">
                {isPassed ? "Passed" : isToday ? "Today" : "Upcoming"}
              </Box>
            </Box>
          </Stack>

          {/* Body */}
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={0.75} sx={{ mb: 0.5 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.35,
                  color: isPassed ? "text.secondary" : "text.primary",
                  textDecoration: isPassed ? "line-through" : "none",
                  textDecorationColor: alpha(theme.palette.text.secondary, 0.4),
                  textDecorationThickness: "1px",
                }}
              >
                {entry.occasion}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.75}
              sx={{ mt: 0.75, lineHeight: 1 }}
            >
              <CalendarMonth
                sx={{
                  fontSize: 13,
                  color: "text.disabled",
                  display: "block",
                  flexShrink: 0,
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: "text.secondary",
                  lineHeight: 1.2,
                  fontWeight: 500,
                }}
              >
                {formatFullDate(entry.date)}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

/* Helper — returns "today" | "passed" | "upcoming" */
const getHolidayStatus = (date) => {
  if (!date) return "upcoming";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "upcoming";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const holidayDate = new Date(parsed);
  holidayDate.setHours(0, 0, 0, 0);

  if (holidayDate.getTime() === today.getTime()) return "today";
  if (holidayDate < today) return "passed";
  return "upcoming";
};

const formatFullDate = (date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default ViewHoliday;
