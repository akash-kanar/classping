import { useState } from "react";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Stack,
  Divider,
  Box,
  alpha,
  useTheme,
} from "@mui/material";
import {
  AccessTimeRounded,
  MeetingRoomRounded,
} from "@mui/icons-material";
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

import ScopePicker from "../components/ScopePicker";

const RescheduleDialogContent = ({
  open,
  onClose,
  onConfirm,
  entry,
  dateKey,
}) => {
  const theme = useTheme();

  const [scope, setScope] = useState("today");
  const [fromDate, setFromDate] = useState(
    dateKey || dayjs().format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(dateKey || dayjs().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState(entry?.startTime || "09:00");
  const [endTime, setEndTime] = useState(entry?.endTime || "10:00");
  const [room, setRoom] = useState(entry?.room || "");

  const invalidRange =
    startTime && endTime && endTime.localeCompare(startTime) <= 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 1.5,
            overflow: "hidden",
            backgroundImage: "none",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: theme.shadows[8],
          },
        },
      }}
    >
      {/* ============ Header ============ */}
      <DialogTitle sx={{ px: { xs: 2.5, sm: 3 }, py: 2 }}>
        <Stack direction="row"  spacing={1.5}>
          <Box
            sx={{
              width: 40,
              height: 40,
              flexShrink: 0,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
            }}
          >
            <ChangeCircleIcon sx={{ fontSize: 20 }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1rem",
                lineHeight: 1.2,
                letterSpacing: "-0.015em",
              }}
            >
              Reschedule Class
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.25, fontSize: "0.75rem" }}
            >
              Pick a new time and room
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <Divider />

      {/* ============ Body ============ */}
      <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, py: 2.5 }}>
        <Stack spacing={2.25}>
          {/* ---------- CURRENT (compact summary) ---------- */}
          <Box
  sx={{
    p: 1.75,
    borderRadius: 2,
    bgcolor: "action.hover",
    display: "flex",
    alignItems: "flex-start",
    gap: 1.5,
  }}
>
  {/* Icon */}
  <Box
    sx={{
      width: 36,
      height: 36,
      borderRadius: 1.5,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "background.paper",
      color: "text.secondary",
      border: "1px solid",
      borderColor: "divider",
    }}
  >
    <AccessTimeRounded sx={{ fontSize: 18 }} />
  </Box>

  {/* Details */}
  <Box sx={{ minWidth: 0, flex: 1 }}>

    {/* Subject — primary emphasis */}
    <Typography
      sx={{
        fontWeight: 800,
        fontSize: "0.92rem",
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
        color: "text.primary",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {entry?.subject || "Class"}
    </Typography>

    {/* Teacher · Room · Time — secondary line */}
    <Stack
      direction="row"
      
      spacing={0.75}
      sx={{ mt: 0.35, minWidth: 0, flexWrap: "wrap", rowGap: 0.25 }}
    >
      <Typography
        sx={{
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "text.secondary",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: { xs: 140, sm: 180 },
        }}
      >
        {entry?.faculty || "No faculty"} •
      </Typography>

      <Typography
        sx={{
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "text.secondary",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: { xs: 100, sm: 140 },
        }}
      >
        Room: {entry?.room || "No room"} •
      </Typography> 

      <Typography
        sx={{
          fontSize: "0.78rem",
          fontWeight: 700,
          color: "text.primary",
          whiteSpace: "nowrap",
        }}
      >
        Time: {entry?.startTime} – {entry?.endTime}
      </Typography>
    </Stack>
  </Box>
</Box>

          {/* ---------- Transition arrow ---------- */}
<Divider
  sx={{
    "& .MuiDivider-wrapper": {
      px: 1.5,
    },
  }}
>
  <Typography
    sx={{
      fontSize: "0.75rem",
      fontWeight: 600,
      color: "text.secondary",
      letterSpacing: 0.3,
      whiteSpace: "nowrap",
    }}
  >
    Reschedule Details
  </Typography>
</Divider>  

          {/* ---------- NEW (editable, flat) ---------- */}
          <Box>

            <Stack spacing={1.5}>
              {/* Time row */}
              <Stack direction="row" spacing={1.5}>
                <TextField
                  type="time"
                  label="Start"
                  size="small"
                  fullWidth
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: (
                        <AccessTimeRounded
                          sx={{ mr: 0.75, fontSize: 16, color: "text.secondary" }}
                        />
                      ),
                    },
                  }}
                  sx={fieldSx}
                />
                <TextField
                  type="time"
                  label="End"
                  size="small"
                  fullWidth
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  error={invalidRange}
                  helperText={invalidRange ? "Must be after start" : " "}
                  slotProps={{
                    inputLabel: { shrink: true },
                    input: {
                      startAdornment: (
                        <AccessTimeRounded
                          sx={{ mr: 0.75, fontSize: 16, color: "text.secondary" }}
                        />
                      ),
                    },
                  }}
                  sx={fieldSx}
                />
              </Stack>

              {/* Room */}
              <TextField
                label="Room"
                size="small"
                fullWidth
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. B-203"
                slotProps={{
                  input: {
                    startAdornment: (
                      <MeetingRoomRounded
                        sx={{ mr: 0.75, fontSize: 16, color: "text.secondary" }}
                      />
                    ),
                  },
                }}
                sx={fieldSx}
              />
            </Stack>
          </Box>

          <Divider />

          {/* ---------- Scope ---------- */}
          <ScopePicker
            scope={scope}
            setScope={setScope}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
          />
        </Stack>
      </DialogContent>

      <Divider />

      {/* ============ Footer ============ */}
      <DialogActions sx={{ px: { xs: 2.5, sm: 3 }, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
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
          disableElevation
          disabled={invalidRange}
          onClick={() =>
            onConfirm({ scope, fromDate, toDate, startTime, endTime, room })
          }
          sx={{
            borderRadius: 2,
            px: 2.75,
            py: 1,
            textTransform: "none",
            fontWeight: 700,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          }}
        >
          Confirm Reschedule
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* Shared TextField style */
const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "background.paper",
    fontSize: "0.9rem",
    transition: "all 0.18s ease",
    "& fieldset": { borderColor: "divider" },
    "&:hover fieldset": { borderColor: "rgba(99,102,241,0.4)" },
    "&.Mui-focused fieldset": { borderColor: "primary.main" },
  },
  "& .MuiInputBase-input": {
    fontWeight: 600,
  },
  "& .MuiFormHelperText-root": {
    fontSize: "0.68rem",
    mt: 0.5,
    mx: 0,
  },
};

const RescheduleDialog = (props) => (
  <RescheduleDialogContent
    key={`${props.open}-${props.dateKey}-${
      props.entry?.id ?? props.entry?.subject ?? ""
    }`}
    {...props}
  />
);

export default RescheduleDialog;