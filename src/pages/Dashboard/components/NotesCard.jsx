import { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";

import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

const quotes = [
  {
    text: "Arise, awake, and stop not till the goal is reached.",
    author: "Swami Vivekananda",
    color: "#f59e0b",
  },
  {
    text: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.",
    author: "Dr. A.P.J. Abdul Kalam",
    color: "#10b981",
  },
  {
    text: "The people who are crazy enough to think they can change the world are the ones who do.",
    author: "Steve Jobs",
    color: "#6366f1",
  },
  {
    text: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
    author: "Albert Einstein",
    color: "#ec4899",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Dr. A.P.J. Abdul Kalam",
    color: "#3b82f6",
  },
  {
    text: "You have to dream before your dreams can come true.",
    author: "Dr. A.P.J. Abdul Kalam",
    color: "#8b5cf6",
  },
  {
    text: "Take up one idea. Make that one idea your life — think of it, dream of it, live on that idea.",
    author: "Swami Vivekananda",
    color: "#f59e0b",
  },
  {
    text: "Stay hungry, stay foolish.",
    author: "Steve Jobs",
    color: "#6366f1",
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    color: "#0ea5e9",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
    color: "#10b981",
  },
  {
    text: "Do not wait to strike till the iron is hot; but make it hot by striking.",
    author: "Swami Vivekananda",
    color: "#ec4899",
  },
  {
    text: "Science is a way of thinking much more than it is a body of knowledge.",
    author: "Carl Sagan",
    color: "#8b5cf6",
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    color: "#f59e0b",
  },
  {
    text: "If you want to shine like a sun, first burn like a sun.",
    author: "Dr. A.P.J. Abdul Kalam",
    color: "#3b82f6",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    color: "#6366f1",
  },
  {
    text: "In a day, when you don't come across any problems — you can be sure that you are travelling in a wrong path.",
    author: "Swami Vivekananda",
    color: "#ec4899",
  },
  {
    text: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan",
    color: "#0ea5e9",
  },
  {
    text: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
    color: "#10b981",
  },
  {
    text: "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
    author: "Albert Einstein",
    color: "#8b5cf6",
  },
  {
    text: "Strength is Life, Weakness is Death.",
    author: "Swami Vivekananda",
    color: "#f59e0b",
  },
];

const QuoteCard = () => {
  const theme = useTheme();
  const [index, setIndex] = useState(0);

  const quote = quotes[index];

  const handleShuffle = () => {
    let next = index;
    while (next === index && quotes.length > 1) {
      next = Math.floor(Math.random() * quotes.length);
    }
    setIndex(next);
  };

  // Helper to get a soft tinted background based on the quote color
  const softBg = alpha(quote.color, 0.06);
  const softBgHover = alpha(quote.color, 0.1);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 2,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: alpha(quote.color, 0.2),
        overflow: "hidden",
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(8px)",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: alpha(quote.color, 0.4),
          boxShadow: `0 8px 32px ${alpha(quote.color, 0.12)}`,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 1.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          background: `linear-gradient(90deg, ${alpha(quote.color, 0.04)} 0%, transparent 100%)`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              background: `linear-gradient(135deg, ${alpha(quote.color, 0.15)}, ${alpha(quote.color, 0.05)})`,
              color: quote.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "rotate(-10deg) scale(1.05)",
              },
            }}
          >
            <AutoAwesomeRoundedIcon fontSize="small" />
          </Box>

          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                letterSpacing: "-0.02em",
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              Quote of the Day
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Shuffle quote" arrow>
          <IconButton
            size="small"
            onClick={handleShuffle}
            sx={{
              border: "1px solid",
              borderColor: alpha(quote.color, 0.3),
              backgroundColor: alpha(quote.color, 0.04),
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: alpha(quote.color, 0.12),
                borderColor: quote.color,
                transform: "rotate(180deg)",
              },
            }}
          >
            <RefreshRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ borderColor: alpha(quote.color, 0.12) }} />

      {/* Quote body */}
      <Box
        sx={{
          position: "relative",
          p: { xs: 2.5, sm: 3.5 },
          overflow: "hidden",
          background: `linear-gradient(135deg, ${softBg} 0%, transparent 60%)`,
          transition: "background 0.4s ease",
          "&:hover": {
            background: `linear-gradient(135deg, ${softBgHover} 0%, transparent 60%)`,
          },
        }}
      >
        {/* Decorative large quote mark */}
        <FormatQuoteRoundedIcon
          sx={{
            position: "absolute",
            top: -20,
            left: 4,
            fontSize: { xs: 100, sm: 130 },
            color: alpha(quote.color, 0.08),
            pointerEvents: "none",
            transition: "all 0.4s ease",
            ".MuiPaper-root:hover &": {
              color: alpha(quote.color, 0.12),
              transform: "scale(1.05)",
            },
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Quote text */}
          <Typography
            sx={{
              fontSize: { xs: "1rem", sm: "1.12rem" },
              lineHeight: 1.8,
              fontWeight: 600,
              fontStyle: "italic",
              color: "text.primary",
              mb: 2.5,
              pl: { xs: 1, sm: 1.5 },
              letterSpacing: "0.01em",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                top: 4,
                bottom: 4,
                width: 3,
                borderRadius: 4,
                background: `linear-gradient(180deg, ${quote.color}, ${alpha(quote.color, 0.2)})`,
              },
            }}
          >
            {quote.text}
          </Typography>

          {/* Author — right aligned */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
              pl: 1,
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 2,
                borderRadius: 2,
                background: alpha(quote.color, 0.4),
              }}
            />
            <Typography
              variant="body2"
              fontWeight={800}
              sx={{
                lineHeight: 1.3,
                color: alpha(theme.palette.text.primary, 0.8),
                letterSpacing: "0.02em",
              }}
            >
              {quote.author}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default QuoteCard;