import React, { useState } from "react";
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
} from "@mui/material";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import SavingsIcon from "@mui/icons-material/Savings";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 2, sm: 3 } }}>{children}</Box>}
    </div>
  );
}

const AuthPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, #e0e7ff 50%, #f3e8ff 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          width: "100vw",
          p: 0,
          m: 0,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: { xs: 360, sm: 420 },
            borderRadius: "16px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.10)",
            p: 0,
            transition: "box-shadow 0.3s, background 0.3s",
          }}
        >
          {/* Brand Icon and Header */}
          <Stack alignItems="center" spacing={1} sx={{ pt: { xs: 3, sm: 4 } }}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.light,
                color: theme.palette.primary.main,
                width: 56,
                height: 56,
                mb: 1,
                boxShadow: 2,
              }}
            >
              <SavingsIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography
              component="h1"
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: 700, mb: 0.5, color: "text.primary" }}
            >
              Syndicator
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.95,
                fontSize: { xs: "0.95rem", sm: "1rem" },
                fontWeight: 500,
                color: "text.secondary",
                mb: 1,
              }}
            >
              Smart Financial Syndication Platform
            </Typography>
          </Stack>

          {/* Tabs */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              background: theme.palette.background.paper,
              px: { xs: 2, sm: 3 },
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChange}
              centered
              sx={{
                "& .MuiTab-root": {
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  fontWeight: 600,
                  minHeight: { xs: "48px", sm: "56px" },
                  color: theme.palette.text.primary,
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                  },
                },
                "& .MuiTabs-indicator": {
                  height: "3px",
                  borderRadius: "3px",
                  background: theme.palette.primary.main,
                },
              }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <LoginForm />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <RegisterForm onSwitchToLogin={() => setTabValue(0)} />
          </TabPanel>
        </Paper>
        <Typography
          variant="caption"
          sx={{
            mt: 3,
            color: "text.secondary",
            textAlign: "center",
            width: "100%",
            letterSpacing: 0.2,
          }}
        >
          © {new Date().getFullYear()} Syndicator. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default AuthPage;
