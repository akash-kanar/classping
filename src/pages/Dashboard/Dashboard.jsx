import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, useMediaQuery, useTheme as useMuiTheme } from "@mui/material";

import { useTheme } from "../../context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MainDashboard from "./components/MainDashboard";
import BottomNav, { BOTTOM_NAV_HEIGHT } from "./components/Bottomnav";
import Profile from "../Profile";
import UploadTimetable from "../Timetable/UploadTimetable";
import TimetablePreview from "../Timetable/TimetablePreview";
import TimetableResult from "../Timetable/TimetableResult";
import UpcomingClasses from "../UpcomingClasses";

import MobileTopNav from "./components/MobileTopNav";

import api from "../../services/api";

// Holiday
import UploadHoliday from "../Holiday/UploadHoliday";
import HolidayReview from "../Holiday/HolidayReview";

// Storage
import Storage from "../Storage/Storage";
import ViewTimetable from "../Storage/ViewTimetable";
import ViewHoliday from "../Storage/ViewHoliday";
import Upload from "../Upload/Upload";

// AI Assistant
import AIAssistant from "../Dashboard/ai-assistant/AIAssistant";

// Profile sub-pages
import PersonalInformation from "../Profile/PersonalInformation";
import Settings from "../Profile/AppSettingsPage";
import HelpSupport from "../Profile/HelpSupport";
import PrivacySecurity from "../Profile/PrivacySecurity";
import AboutClassPing from "../Profile/About";
import AllNotifications from "../AllNotifications";

const Dashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [timetable, setTimetable] = useState(null);
  const [savingTimetable, setSavingTimetable] = useState(false);
  const [saveError, setSaveError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useTheme();

  const muiTheme = useMuiTheme();
  const isSmall = useMediaQuery(muiTheme.breakpoints.down("sm"));

  useEffect(() => {
    if (location.state?.timetable) {
      setTimetable(location.state.timetable);
    }
  }, [location.state]);

  /* ---------- Home route check ---------- */
  const isHomeRoute =
    location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  const renderContent = () => {
    if (location.pathname === "/dashboard/profile") {
      return <Profile />;
    }

    if (location.pathname === "/dashboard/settings") {
      return <Settings />;
    }

    if (location.pathname === "/dashboard/timetable/result") {
      return (
        <TimetableResult
          timetable={timetable}
          onEdit={() => navigateToTimetable("/dashboard/timetable/preview")}
          onConfirm={saveTimetable}
          saving={savingTimetable}
          error={saveError}
        />
      );
    }

    if (location.pathname === "/dashboard/timetable/preview") {
      return timetable ? (
        <TimetablePreview
          timetable={timetable}
          setTimetable={setTimetable}
          onSaveChanges={() =>
            navigateToTimetable("/dashboard/timetable/result")
          }
          onUploadAgain={() =>
            navigateToTimetable("/dashboard/timetable/upload")
          }
        />
      ) : (
        <UploadTimetable />
      );
    }

    if (location.pathname === "/dashboard/upcoming-classes") {
      return <UpcomingClasses />;
    }

    if (location.pathname === "/dashboard/upload") {
      return <Upload />;
    }

    if (location.pathname === "/dashboard/timetable/upload") {
      return <UploadTimetable />;
    }

    if (location.pathname === "/dashboard/holiday/upload") {
      return <UploadHoliday />;
    }

    if (location.pathname === "/dashboard/holiday/review") {
      return <HolidayReview />;
    }

    if (location.pathname === "/dashboard/storage") {
      return <Storage />;
    }

    if (
      location.pathname === "/dashboard/storage/timetable" ||
      location.pathname === "/dashboard/view/timetable"
    ) {
      return <ViewTimetable />;
    }

    if (
      location.pathname === "/dashboard/storage/holiday" ||
      location.pathname === "/dashboard/view/holiday"
    ) {
      return <ViewHoliday />;
    }

    if (location.pathname === "/dashboard/ai-assistant") {
      return <AIAssistant />;
    }

    if (location.pathname === "/dashboard/all-notifications") {
      return <AllNotifications />;
    }

    /* Profile sub-pages */
    if (location.pathname === "/dashboard/profile/personal-information") {
      return <PersonalInformation />;
    }

    if (location.pathname === "/dashboard/help") {
      return <HelpSupport />;
    }

    if (location.pathname === "/dashboard/privacy") {
      return <PrivacySecurity />;
    }

    if (location.pathname === "/dashboard/about") {
      return <AboutClassPing />;
    }

    return <MainDashboard />;
  };

  const navigateToTimetable = (path) => {
    navigate(path, { state: { timetable } });
  };

  const saveTimetable = async () => {
    if (!timetable?.entries?.length) {
      setSaveError("Please add at least one valid class before saving.");
      return;
    }

    try {
      setSavingTimetable(true);
      setSaveError("");

      const response = await api.post("/timetable/save", {
        title: timetable.title,
        semester: timetable.semester,
        entries: timetable.entries,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save timetable.");
      }

      setTimetable(response.data.timetable);
      navigate("/dashboard");
    } catch (error) {
      console.error("Timetable save error:", error);
      setSaveError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save timetable. Please try again.",
      );
    } finally {
      setSavingTimetable(false);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/*
          Header visibility:
          - Desktop (sm+): always visible
          - Mobile (xs):  only visible on the dashboard home route
        */}
        <Box
          sx={{
            display: {
              xs: isHomeRoute ? "flex" : "none",
              sm: "flex",
            },
          }}
        >
          <Header onMenuClick={() => setMobileOpen(true)} />
        </Box>

        {/*
          MobileTopNav:
          - Hides itself on desktop (returns null)
          - Hides itself on the home route (returns null)
          - Shows on all other mobile routes
        */}
        <MobileTopNav />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: 0,
            overflowY: "auto",
            pb: isSmall ? `${BOTTOM_NAV_HEIGHT + 12}px` : 0,
            scrollbarColor:
              mode === "dark" ? "#666 #1e1e1e" : "#b8c0cc #f5f7fa",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: 8,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: mode === "dark" ? "#1e1e1e" : "#f5f7fa",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: mode === "dark" ? "#666" : "#b8c0cc",
              borderRadius: 8,
            },
          }}
        >
          {renderContent()}
        </Box>

        <BottomNav />
      </Box>
    </Box>
  );
};

export default Dashboard;
