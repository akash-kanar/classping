import {
  Box,
  Button,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

const prompts = [
  {
    key: "move",
    label: "Move a class",
    icon: <ScheduleRoundedIcon fontSize="small" />,
  },
  {
    key: "cancel",
    label: "Cancel a class",
    icon: <EventBusyRoundedIcon fontSize="small" />,
  },
  {
    key: "room",
    label: "Change room",
    icon: <MeetingRoomRoundedIcon fontSize="small" />,
  },
  {
    key: "faculty",
    label: "Change faculty",
    icon: <PersonRoundedIcon fontSize="small" />,
  },
];

const SuggestedPrompts = ({ onSelect }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.8,
          mb: 1.25,
        }}
      >
        <AutoAwesomeRoundedIcon
          sx={{ fontSize: 16, color: theme.palette.primary.main }}
        />
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{
            letterSpacing: 0.4,
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          Try asking
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {prompts.map((item) => (
          <Button
            key={item.key}
            variant="outlined"
            size="small"
            startIcon={item.icon}
            onClick={() => onSelect(item.key)}
            sx={{
              textTransform: "none",
              borderRadius: 2.5,
              px: 1.5,
              py: 0.75,
              fontSize: "0.82rem",
              fontWeight: 600,
              borderColor: theme.palette.divider,
              color: "text.secondary",
              bgcolor: theme.palette.background.paper,
              boxShadow: "none",
              transition: theme.transitions.create(
                ["border-color", "color", "background-color", "transform"],
                { duration: 180 },
              ),
              "&:hover": {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                transform: "translateY(-1px)",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default SuggestedPrompts;