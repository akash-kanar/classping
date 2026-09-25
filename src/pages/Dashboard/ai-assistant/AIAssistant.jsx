import { useEffect, useRef, useState } from "react";

import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";

import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import api from "../../../services/api";

import ChatMessage from "./ChatMessage";
import SuggestedPrompts from "./SuggestedPrompts";
import ScheduleProposalCard from "./ScheduleProposalCard";

const INTENT_LABELS = {
  move: "Move a class",
  cancel: "Cancel a class",
  room: "Change room",
  faculty: "Change faculty",
};

const FOLLOW_UPS = {
  move:
    "Certainly. I can help you reschedule a class.\n\n" +
    "Please provide the following details:\n" +
    "1. Class name or course code\n" +
    "2. Current day and time\n" +
    "3. New day and time\n\n" +
    'For example: "Move my DSA class on Monday 10 AM to Tuesday 2 PM."',
  cancel:
    "Understood. I can process a cancellation.\n\n" +
    "Please provide:\n" +
    "1. Class name or course code\n" +
    "2. Date or recurring day to cancel\n\n" +
    'For example: "Cancel my Web Development class on Friday."',
  room:
    "Certainly. I can update the room for a class.\n\n" +
    "Please provide:\n" +
    "1. Class name or course code\n" +
    "2. Date or day of the class\n" +
    "3. New room number or name\n\n" +
    'For example: "Change my DBMS class on Wednesday to Room B-204."',
  faculty:
    "Understood. I can reassign the faculty for a class.\n\n" +
    "Please provide:\n" +
    "1. Class name or course code\n" +
    "2. Date or day of the class\n" +
    "3. New faculty member's name\n\n" +
    'For example: "Assign Prof. Sharma to my OS class on Thursday."',
};

const AIAssistant = () => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! I'm your ClassPing AI Assistant. I can help you manage temporary changes to your class schedule.",
    },
    {
      id: 2,
      role: "assistant",
      content:
        'Try something like "Move my DSA class tomorrow to 2 PM" or "Cancel my Web Development class on Friday."',
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, proposal, loading]);

  const sendMessage = async (customMessage = null) => {
    // Guided follow-up flow for the four suggested intents
    if (customMessage && INTENT_LABELS[customMessage]) {
      const now = Date.now();
      setMessages((prev) => [
        ...prev,
        { id: now, role: "user", content: INTENT_LABELS[customMessage] },
        {
          id: now + 1,
          role: "assistant",
          content: FOLLOW_UPS[customMessage],
        },
      ]);
      setError("");
      return;
    }

    const message = (customMessage ?? input).trim();
    if (!message || loading) return;

    setError("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: message },
    ]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((item) => ({
        role: item.role,
        content: item.content,
      }));

      const response = await api.post("/ai-schedule/chat", {
        message,
        history,
      });

      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (data.type === "proposal") {
        setProposal(data.proposal);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content:
              data.message ||
              "I've prepared a schedule change for you. Please review it before confirming.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content:
              data.message || "Could you provide a little more information?",
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to contact the AI assistant.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!proposal || confirming) return;
    setConfirming(true);
    setError("");

    try {
      const response = await api.post("/ai-schedule/confirm", { proposal });
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Unable to confirm change.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content:
            "✅ Schedule change confirmed. Your effective schedule has been updated.",
        },
      ]);
      setProposal(null);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to confirm the schedule change.",
      );
    } finally {
      setConfirming(false);
    }
  };

  const handleCancelProposal = () => {
    setProposal(null);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "assistant",
        content: "No problem. I discarded that schedule change.",
      },
    ]);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: "New conversation started. How can I help with your schedule?",
      },
    ]);
    setProposal(null);
    setError("");
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 80px)",
        p: { xs: 1.5, sm: 2, md: 3 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: "md",
          minHeight: {
            xs: "calc(100vh - 110px)",
            md: "calc(100vh - 120px)",
          },
          display: "flex",
          flexDirection: "column",
          borderRadius: 1.5,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.75,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 20 }} />
            </Box>

            <Box>
              <Typography fontWeight={800} fontSize="0.98rem">
                ClassPing AI
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
                Smart schedule assistant
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={clearChat}
            title="Clear conversation"
            size="small"
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              transition: theme.transitions.create(
                ["border-color", "color"],
                { duration: 180 },
              ),
              "&:hover": {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
              },
            }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Chat */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: { xs: 1.5, sm: 3, md: 5 },
            py: { xs: 2, md: 3 },
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              borderRadius: 10,
              bgcolor: theme.palette.action.disabled,
            },
          }}
        >
          <Box sx={{ maxWidth: 780, mx: "auto" }}>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}

            {proposal && (
              <ScheduleProposalCard
                proposal={proposal}
                onConfirm={handleConfirm}
                onCancel={handleCancelProposal}
                confirming={confirming}
              />
            )}

            {loading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AutoAwesomeRoundedIcon
                    sx={{
                      color: theme.palette.primary.contrastText,
                      fontSize: 16,
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    px: 1.75,
                    py: 1.2,
                    borderRadius: "4px 16px 16px 16px",
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Thinking...
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {error && (
              <Box
                sx={{
                  mb: 2,
                  px: 1.75,
                  py: 1.2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.24)}`,
                }}
              >
                <Typography variant="body2" color="error" fontWeight={600}>
                  {error}
                </Typography>
              </Box>
            )}

            {!loading && !proposal && messages.length <= 2 && (
              <SuggestedPrompts onSelect={sendMessage} />
            )}

            <div ref={messagesEndRef} />
          </Box>
        </Box>

        {/* Composer */}
        <Box
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            px: { xs: 1.5, sm: 2, md: 2.5 },
            py: { xs: 1.25, sm: 1.5, md: 1.75 },
            flexShrink: 0,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 780, mx: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 0.75,
                p: 0.75,
                minHeight: 52,
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,
                transition: theme.transitions.create(
                  ["border-color", "box-shadow"],
                  { duration: 180 },
                ),
                "&:hover": {
                  borderColor: alpha(theme.palette.text.primary, 0.25),
                },
                "&:focus-within": {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 3px ${alpha(
                    theme.palette.primary.main,
                    0.12,
                  )}`,
                },
              }}
            >
                            <TextField
                fullWidth
                multiline
                maxRows={5}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                variant="standard"
                placeholder="Ask ClassPing to change your schedule..."
                slotProps={{
                  input: {
                    disableUnderline: true,
                  },
                }}
                sx={{
                  flex: 1,
                  minWidth: 0,

                  px: { xs: 0.8, sm: 1 },

                  "& .MuiInputBase-root": {
                    fontSize: {
                      xs: "0.85rem",
                      sm: "0.9rem",
                    },

                    lineHeight: 2,

                    py: { xs: 0.5, sm: 0.6 },

                    maxHeight: 130,

                    overflowY: "auto",

                    // Vertically center the input/placeholder
                    alignItems: "center",

                    "&::-webkit-scrollbar": {
                      width: 4,
                    },

                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: 10,
                      backgroundColor: theme.palette.action.disabled,
                    },
                  },

                  "& .MuiInputBase-input": {
                    minWidth: 0,

                    // Vertically center text
                    display: "flex",
                    alignItems: "center",

                    "&::placeholder": {
                      color: theme.palette.text.secondary,
                      opacity: 0.75,

                      // Prevent placeholder from overflowing
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  },
                }}
              />

              <IconButton
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                sx={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  transition: theme.transitions.create(
                    ["background-color", "transform"],
                    { duration: 180 },
                  ),
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                    transform: "translateY(-1px)",
                  },
                  "&:active": { transform: "translateY(0)" },
                  "&.Mui-disabled": {
                    bgcolor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled,
                  },
                }}
              >
                <SendRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AIAssistant;