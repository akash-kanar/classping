import { Box } from "@mui/material";

import WelcomeCard from "./WelcomeCard";
import StatsCards from "./StatsCards";
import ClassToday from "./ClassToday";
import QuickActions from "./QuickActions";
import NotesCard from "./NotesCard";

const MainDashboard = () => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        py: {
          xs: 0.15,
          sm: 2,
        },
        px: {
          xs: 0.5,
          sm: 1.5,
          md: 2,
          lg: 2.5,
        },
        boxSizing: "border-box",
      }}
    >
      {/* Welcome */}
      <WelcomeCard />

      {/* Statistics */}
      <StatsCards />

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: {
            xs: "column",
            lg: "row",
          },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        {/* Today's Classes */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <ClassToday />
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            width: {
              xs: "100%",
              lg: 360,
            },
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <QuickActions />
        </Box>
      </Box>

      <NotesCard />
    </Box>
  );
};

export default MainDashboard;
