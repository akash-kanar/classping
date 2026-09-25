import { Avatar, Box, Typography, useTheme, alpha, keyframes } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const ChatMessage = ({ role, content }) => {
  const theme = useTheme();
  const isUser = role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 1,
        mb: 2,
        animation: `${fadeIn} 220ms ease-out`,
      }}
    >
      {!isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
            mt: 0,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: { xs: "85%", sm: "72%" },
          px: 1.75,
          py: 1.25,
          mt: 1,
          borderRadius: isUser
            ? "16px 4px 16px 16px"
            : "4px 16px 16px 16px",
          bgcolor: isUser
            ? theme.palette.primary.main
            : theme.palette.background.paper,
          color: isUser
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
          border: isUser
            ? "none"
            : `1px solid ${theme.palette.divider}`,
          boxShadow: isUser
            ? `0 4px 14px ${alpha(theme.palette.primary.main, 0.25)}`
            : `0 2px 10px ${alpha(theme.palette.common.black, 0.04)}`,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            lineHeight: 1.65,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "0.875rem",
          }}
        >
          {content}
        </Typography>
      </Box>

      {isUser && (
        <Avatar
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
            mb: 1.5,
            bgcolor: alpha(
              theme.palette.text.primary,
              theme.palette.mode === "dark" ? 0.12 : 0.06,
            ),
            color: theme.palette.text.secondary,
          }}
        >
          <PersonRoundedIcon sx={{ fontSize: 16 }} />
        </Avatar>
      )}
    </Box>
  );
};

export default ChatMessage;