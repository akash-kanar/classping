import {
  Box,
  Button,
  Chip,
  Divider,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const TYPE_LABELS = {
  rescheduled: "Class Rescheduled",
  cancelled: "Class Cancelled",
  room_changed: "Room Changed",
  faculty_changed: "Faculty Changed",
  custom: "Schedule Updated",
};

const formatDate = (date) => {
  if (!date) return "";
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const DetailRow = ({ icon, label, children }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.4, mb: 1.5 }}>
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            letterSpacing: 0.3,
            textTransform: "uppercase",
            fontSize: "0.68rem",
          }}
        >
          {label}
        </Typography>
        <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.45 }}>
          {children}
        </Typography>
      </Box>
    </Box>
  );
};

const ScheduleProposalCard = ({
  proposal,
  onConfirm,
  onCancel,
  confirming = false,
}) => {
  const theme = useTheme();
  const typeLabel = TYPE_LABELS[proposal.type] || "Schedule Change";

  const isTimeChange =
    proposal.type === "rescheduled" || proposal.type === "custom";

  const dateText =
    proposal.dateFrom === proposal.dateTo
      ? formatDate(proposal.dateFrom)
      : `${formatDate(proposal.dateFrom)} – ${formatDate(proposal.dateTo)}`;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 560,
        mb: 3,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        overflow: "hidden",
        boxShadow: `0 8px 26px ${alpha(theme.palette.common.black, 0.06)}`,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.2,
          py: 1.6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AutoAwesomeRoundedIcon
            sx={{ color: theme.palette.primary.main, fontSize: 20 }}
          />
          <Typography fontWeight={800} fontSize="0.95rem">
            Schedule Change
          </Typography>
        </Box>

        <Chip
          label="AI Proposal"
          size="small"
          sx={{
            borderRadius: 1.5,
            fontWeight: 700,
            fontSize: "0.68rem",
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
          }}
        />
      </Box>

      <Box sx={{ p: 2.2 }}>
        <Typography variant="h6" fontWeight={800} sx={{ mb: 0.3 }}>
          {proposal.subject}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.8 }}>
          {typeLabel}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <DetailRow
          icon={<CalendarMonthRoundedIcon sx={{ fontSize: 16 }} />}
          label="Date"
        >
          {dateText}
        </DetailRow>

        {isTimeChange && (
          <DetailRow
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 16 }} />}
            label="Time"
          >
            <Box
              component="span"
              sx={{ color: "text.secondary", fontWeight: 600 }}
            >
              {proposal.originalStartTime}–{proposal.originalEndTime}
            </Box>
            <Box component="span" sx={{ mx: 1, color: "text.disabled" }}>
              →
            </Box>
            <Box component="span" sx={{ color: "primary.main" }}>
              {proposal.newStartTime || proposal.originalStartTime}–
              {proposal.newEndTime || proposal.originalEndTime}
            </Box>
          </DetailRow>
        )}

        {proposal.newRoom && (
          <DetailRow
            icon={<MeetingRoomRoundedIcon sx={{ fontSize: 16 }} />}
            label="New Room"
          >
            {proposal.newRoom}
          </DetailRow>
        )}

        {proposal.newFaculty && (
          <DetailRow
            icon={<PersonRoundedIcon sx={{ fontSize: 16 }} />}
            label="New Faculty"
          >
            {proposal.newFaculty}
          </DetailRow>
        )}

        {proposal.type === "cancelled" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1.2,
              mb: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.error.main, 0.08),
              color: theme.palette.error.main,
            }}
          >
            <EventBusyRoundedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" fontWeight={700}>
              This class will be cancelled.
            </Typography>
          </Box>
        )}

        {proposal.reason && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                letterSpacing: 0.3,
                textTransform: "uppercase",
                fontSize: "0.68rem",
              }}
            >
              Reason
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.3 }}>
              {proposal.reason}
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 1.5, lineHeight: 1.55 }}
        >
          Review this change before confirming. Your original timetable will
          remain unchanged.
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<CloseRoundedIcon />}
            onClick={onCancel}
            disabled={confirming}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              borderColor: theme.palette.divider,
              color: "text.secondary",
              "&:hover": {
                borderColor: theme.palette.text.secondary,
                bgcolor: alpha(theme.palette.text.primary, 0.03),
              },
            }}
          >
            Discard
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={<CheckRoundedIcon />}
            onClick={onConfirm}
            disabled={confirming}
            disableElevation
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {confirming ? "Confirming..." : "Confirm Change"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ScheduleProposalCard;