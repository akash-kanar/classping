import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import {
  AccessTimeRounded,
  CloseRounded,
  EditRounded,
  MeetingRoomRounded,
  PersonRounded,
  SaveRounded,
} from "@mui/icons-material";
import api from "../services/api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EditClassDialog = ({ open, onClose, entry, onSaved }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timetable, setTimetable] = useState(null);

  const [form, setForm] = useState({
    day: "",
    subject: "",
    startTime: "",
    endTime: "",
    faculty: "",
    room: "",
  });

  /* ---------- Load latest timetable ---------- */
  useEffect(() => {
    if (!open || !entry) return;

    const fetchLatestTimetable = async () => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await api.get("/timetable");
        const latestTimetable = response.data.timetable;
        setTimetable(latestTimetable);

        const matchedEntry =
          latestTimetable?.entries?.find((item) => {
            return (
              item.subject?.trim().toLowerCase() ===
                entry.subject?.trim().toLowerCase() &&
              item.day?.trim().toLowerCase() ===
                entry.day?.trim().toLowerCase() &&
              item.startTime === entry.startTime
            );
          }) || entry;

        setForm({
          day: matchedEntry.day || "",
          subject: matchedEntry.subject || "",
          startTime: matchedEntry.startTime || "",
          endTime: matchedEntry.endTime || "",
          faculty: matchedEntry.faculty || "",
          room: matchedEntry.room || "",
        });
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to load the latest timetable."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLatestTimetable();
  }, [open, entry]);

  /* ---------- Handlers ---------- */
  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setError("");
    setSuccess("");
  };

  const handleClose = () => {
    if (saving) return;
    setError("");
    setSuccess("");
    onClose();
  };

  const validateForm = () => {
    if (!form.subject.trim()) return "Subject name is required.";
    if (!form.day) return "Please select a day.";
    if (!form.startTime) return "Start time is required.";
    if (!form.endTime) return "End time is required.";
    if (form.startTime >= form.endTime)
      return "End time must be later than start time.";
    return "";
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!timetable?.entries?.length) {
      setError("Timetable data is unavailable.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const entryIndex = timetable.entries.findIndex((item) => {
        return (
          item.subject?.trim().toLowerCase() ===
            entry.subject?.trim().toLowerCase() &&
          item.day?.trim().toLowerCase() === entry.day?.trim().toLowerCase() &&
          item.startTime === entry.startTime
        );
      });

      if (entryIndex === -1) {
        throw new Error(
          "The selected class could not be found in the latest timetable."
        );
      }

      const updatedEntries = timetable.entries.map((item, index) => {
        if (index !== entryIndex) return item;
        return {
          ...item,
          day: form.day.trim(),
          subject: form.subject.trim(),
          startTime: form.startTime,
          endTime: form.endTime,
          faculty: form.faculty.trim(),
          room: form.room.trim(),
        };
      });

      const response = await api.post("/timetable/save", {
        title: timetable.title,
        semester: timetable.semester,
        entries: updatedEntries,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update timetable.");
      }

      setSuccess("Class updated successfully.");

      if (onSaved) {
        onSaved(
          response.data.timetable || { ...timetable, entries: updatedEntries }
        );
      }

      setTimeout(() => onClose(), 500);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Failed to update the class."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Reusable field styles ---------- */
  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1,
      bgcolor: "background.paper",
      transition: "all 0.18s ease",
      "& fieldset": {
        borderColor: "divider",
      },
      "&:hover fieldset": {
        borderColor: alpha(theme.palette.primary.main, 0.4),
      },
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
        borderWidth: "1.5px",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.85rem",
      fontWeight: 600,
    },
    "& .MuiInputBase-input": {
      fontSize: "0.9rem",
      fontWeight: 500,
    },
  };

  const adornmentIconSx = {
    mr: 1,
    color: "text.secondary",
    fontSize: 18,
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 1.5,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            backgroundImage: "none",
            boxShadow: theme.shadows[10],
          },
        },
      }}
    >
      {/* ============ Header ============ */}
      <DialogTitle
  sx={{
    px: { xs: 2.5, sm: 3 },
    py: 2,
    pb: 1.75,
  }}
>
  <Stack
    direction="row"
    spacing={2}
    sx={{ alignItems: "center", justifyContent: "space-between" }}
  >
    {/* Left: icon + title block */}
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
      <Box
        sx={{
          width: 42,
          height: 42,
          flexShrink: 0,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "primary.contrastText",
          boxShadow: `0 6px 14px ${alpha(theme.palette.primary.main, 0.25)}`,
        }}
      >
        <EditRounded sx={{ fontSize: 20 }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          fontWeight={800}
          sx={{
            fontSize: { xs: "1rem", sm: "1.1rem" },
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
            color: "text.primary",
          }}
        >
          Edit Class
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.25,
            fontSize: "0.75rem",
            color: "text.secondary",
            lineHeight: 1.3,
          }}
        >
          Update your saved timetable
        </Typography>
      </Box>
    </Stack>

    {/* Right: close button */}
    <IconButton
      onClick={handleClose}
      disabled={saving}
      size="small"
      aria-label="Close"
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        color: "text.secondary",
        bgcolor: "action.hover",
        transition: "all 0.18s ease",
        "&:hover": {
          bgcolor: (t) => alpha(t.palette.text.primary, 0.1),
          color: "text.primary",
          transform: "rotate(90deg)",
        },
        "&.Mui-disabled": {
          bgcolor: "transparent",
          color: "text.disabled",
        },
      }}
    >
      <CloseRounded sx={{ fontSize: 18 }} />
    </IconButton>
  </Stack>
</DialogTitle>

      <Divider />

      {/* ============ Body ============ */}
      <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
        {loading ? (
          <Box
            sx={{
              minHeight: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary">
              Loading class from your timetable...
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2.5}>
            {/* Alerts */}
            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{ borderRadius: 2 }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            
            {/* ====== Section: Class Details ====== */}
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Class Details
            </Typography>

            <TextField
              label="Subject Name"
              value={form.subject}
              onChange={handleChange("subject")}
              fullWidth
              required
              size="small"
              placeholder="e.g. Data Structures & Algorithms"
              sx={fieldSx}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                select
                label="Day"
                value={form.day}
                onChange={handleChange("day")}
                fullWidth
                required
                size="small"
                sx={fieldSx}
              >
                {DAYS.map((day) => (
                  <MenuItem key={day} value={day} sx={{ fontSize: "0.9rem" }}>
                    {day}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Start Time"
                type="time"
                value={form.startTime}
                onChange={handleChange("startTime")}
                fullWidth
                required
                size="small"
                sx={fieldSx}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <AccessTimeRounded sx={adornmentIconSx} />
                    ),
                  },
                }}
              />
              <TextField
                label="End Time"
                type="time"
                value={form.endTime}
                onChange={handleChange("endTime")}
                fullWidth
                required
                size="small"
                sx={fieldSx}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: (
                      <AccessTimeRounded sx={adornmentIconSx} />
                    ),
                  },
                }}
              />
            </Stack>

            {/* ====== Section: Location & Faculty ====== */}
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Faculty & Room Details
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Faculty Name"
                value={form.faculty}
                onChange={handleChange("faculty")}
                fullWidth
                size="small"
                placeholder="e.g. Dr. S. Patra"
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <PersonRounded sx={adornmentIconSx} />
                    ),
                  },
                }}
              />
              <TextField
                label="Room / Lab"
                value={form.room}
                onChange={handleChange("room")}
                fullWidth
                size="small"
                placeholder="e.g. B-203"
                sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: (
                      <MeetingRoomRounded sx={adornmentIconSx} />
                    ),
                  },
                }}
              />
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <Divider />

      {/* ============ Footer ============ */}
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3 },
          py: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={saving}
          color="inherit"
          sx={{
            borderRadius: 2,
            px: 2.25,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={
            saving ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SaveRounded />
            )
          }
          onClick={handleSave}
          disabled={loading || saving}
          disableElevation
          sx={{
            borderRadius: 2,
            px: 2.75,
            py: 1,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditClassDialog;