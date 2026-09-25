import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
  Chip,
  Avatar,
  alpha,
  useTheme,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  CalendarMonth,
  Delete,
  Save,
  EventNote,
  ArrowBack,
  Search,
  Today,
} from "@mui/icons-material";
import dayjs from "dayjs";
import api from "../../services/api";

const HolidayReview = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const incomingHoliday = location.state?.holiday;

  const [title, setTitle] = useState(
    incomingHoliday?.title || "College Holidays",
  );
  const [year, setYear] = useState(
    incomingHoliday?.year || new Date().getFullYear(),
  );
  const [entries, setEntries] = useState(() =>
    (incomingHoliday?.entries || []).map((entry, index) => ({
      ...entry,
      id: entry.id || `entry-${index}`,
    })),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!incomingHoliday) {
      navigate("/dashboard/holiday/upload", { replace: true });
    }
  }, [incomingHoliday, navigate]);

  if (!incomingHoliday) {
    return null;
  }

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedEntries;
    return sortedEntries.filter((entry) => {
      const occasion = (entry.occasion || "").toLowerCase();
      const description = (entry.description || "").toLowerCase();
      const date = entry.date || "";
      return (
        occasion.includes(q) || description.includes(q) || date.includes(q)
      );
    });
  }, [sortedEntries, search]);

  const updateEntry = (id, field, value) => {
    setEntries((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      ),
    );
  };

  const deleteEntry = (id) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  const addEntry = () => {
    setEntries((current) => [
      ...current,
      {
        id: `entry-new-${Date.now()}`,
        date: `${year}-01-01`,
        occasion: "",
        description: "",
      },
    ]);
  };

  const handleConfirm = async () => {
    const validEntries = entries
      .filter((entry) => entry.date?.trim() && entry.occasion?.trim())
      .map(({ ...rest }) => rest);

    if (!validEntries.length) {
      setError("Please add at least one valid holiday.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const response = await api.post("/holiday/save", {
        title,
        year: Number(year),
        entries: validEntries,
      });

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to save holiday calendar.",
        );
      }

      navigate("/dashboard/holiday/view", {
        state: { message: "Holiday calendar saved successfully." },
      });
    } catch (err) {
      console.error("Save holiday error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save holiday calendar.",
      );
    } finally {
      setSaving(false);
    }
  };

  const pageSx = {
    width: "100%",
    maxWidth: 1100,
    mx: "auto",
    px: { xs: 2, sm: 3, md: 4 },
    py: { xs: 2, sm: 3, md: 4 },
    boxSizing: "border-box",
  };

  return (
    <Box sx={pageSx}>
      {/* ------------------------------------------------ */}
      {/* Header                                           */}
      {/* ------------------------------------------------ */}
      <Stack direction="row" spacing={1.5} mb={3} flexWrap="wrap" useFlexGap>
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
            width: 48,
            height: 48,
          }}
        >
          <CalendarMonth />
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Typography variant="h5" fontWeight={800} letterSpacing={-0.3}>
            Review Holiday Calendar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verify and edit AI-extracted holidays before saving.
          </Typography>
        </Box>

        <Chip
          icon={<EventNote fontSize="small" />}
          label={`${entries.length} ${
            entries.length === 1 ? "Holiday" : "Holidays"
          }`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
          sx={{ mb: 3, borderRadius: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* ------------------------------------------------ */}
      {/* Calendar details                                 */}
      {/* ------------------------------------------------ */}
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.5,
          mt: 3,
          mb: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color="text.secondary"
            sx={{ letterSpacing: 0.5, textTransform: "uppercase" }}
          >
            Calendar Details
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            <TextField
              fullWidth
              label="Calendar Title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventNote fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Year"
              type="number"
              value={year}
              onChange={(event) => setYear(event.target.value)}
              sx={{ width: { xs: "100%", sm: 180 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Today fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* ------------------------------------------------ */}
      {/* Holidays header + search                         */}
      {/* ------------------------------------------------ */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ justifyContent: "space-between", flexWrap: "wrap", mb: 2 }}
      >
        <Stack direction="row" spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            Holidays details
          </Typography>
        </Stack>

        <TextField
          size="small"
          placeholder="Search holidays..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ width: { xs: "100%", sm: 280 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      {/* ------------------------------------------------ */}
      {/* Holiday list                                     */}
      {/* ------------------------------------------------ */}
      {filteredEntries.length === 0 ? (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <CardContent>
            <Stack spacing={1.5} py={5}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  width: 56,
                  height: 56,
                }}
              >
                <EventNote />
              </Avatar>
              <Typography variant="h6" fontWeight={700}>
                {entries.length === 0 ? "No holidays yet" : "No matches found"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                
                maxWidth={360}
              >
                {entries.length === 0
                  ? "Click 'Add Holiday' to start building your calendar."
                  : "Try a different search term."}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={1.5}>
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              elevation={0}
              sx={{
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: alpha(theme.palette.primary.main, 0.35),
                  boxShadow: `0 6px 20px ${alpha(
                    theme.palette.common.black,
                    0.06,
                  )}`,
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 82,
                }}
              >
                {/* Date */}
                <Box
                  sx={{
                    width: { xs: 82, sm: 105 },
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRight: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={800}
                    color="primary"
                    textTransform="uppercase"
                  >
                    {entry.date ? dayjs(entry.date).format("MMM") : "—"}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 24,
                      fontWeight: 800,
                      lineHeight: 1.1,
                    }}
                  >
                    {entry.date ? dayjs(entry.date).format("DD") : "—"}
                  </Typography>
                </Box>

                {/* Main Content */}
                <Box
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    px: { xs: 1.5, sm: 2.5 },
                    py: 1.5,
                    mt: 1,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 3 }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                  >
                    {/* Date Input */}
                    <Box
                      sx={{
                        minWidth: { sm: 150 },
                      }}
                    >
                      <TextField
                        type="date"
                        value={entry.date || ""}
                        onChange={(event) =>
                          updateEntry(entry.id, "date", event.target.value)
                        }
                        size="small"
                        variant="standard"
                        slotProps={{
                          input: { disableUnderline: true },
                        }}
                        sx={{
                          "& .MuiInputBase-input": {
                            p: 0,
                            fontSize: 14,
                            fontWeight: 700,
                            cursor: "pointer",
                          },
                        }}
                      />

                      <Typography variant="caption" color="text.secondary">
                        {entry.date
                          ? dayjs(entry.date).format("dddd")
                          : "Select date"}
                      </Typography>
                    </Box>

                    {/* Occasion */}
                    <TextField
                      fullWidth
                      size="small"
                      label="Occasion / Festival"
                      placeholder="Enter holiday name"
                      value={entry.occasion || ""}
                      onChange={(event) =>
                        updateEntry(entry.id, "occasion", event.target.value)
                      }
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Stack>
                </Box>

                {/* Delete */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: { xs: 0.75, sm: 1.5 },
                  }}
                >
                  <Tooltip title="Remove holiday" arrow>
                    <IconButton
                      onClick={() => deleteEntry(entry.id)}
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        color: "text.secondary",
                        transition: "all 0.2s ease",

                        bgcolor: alpha(theme.palette.error.main, 0.08),
                        "&:hover": {
                          color: "error.main",
                        },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      )}

      {/* ------------------------------------------------ */}
      {/* Add holiday                                      */}
      {/* ------------------------------------------------ */}
      <Button
        variant="outlined"
        startIcon={<Add />}
        onClick={addEntry}
        sx={{
          mt: 2,
          borderRadius: 3,
          py: 1.2,
          px: 2.5,
          borderStyle: "dashed",
          fontWeight: 600,
          "&:hover": {
            borderStyle: "solid",
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        Add Holiday
      </Button>

      {/* ------------------------------------------------ */}
      {/* Actions                                          */}
      {/* ------------------------------------------------ */}
      <Divider sx={{ my: 4 }} />

      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        sx={{ justifyContent: "space-between", flexWrap: "wrap" }}
      >
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/dashboard/holiday/upload")}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          Upload Different PDF
        </Button>

        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<Save />}
          disabled={saving || entries.length === 0}
          onClick={handleConfirm}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.3,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
          }}
        >
          {saving ? <>Saving...</> : "Confirm & Save Holidays"}
        </Button>
      </Stack>
    </Box>
  );
};

export default HolidayReview;
