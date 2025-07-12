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
} from "@mui/material";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

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

// Enhanced animated background component
const AnimatedBackground: React.FC = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Floating dollar signs */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={`dollar-${i}`}
          sx={{
            position: "absolute",
            fontSize: { xs: "16px", sm: "20px" },
            fontWeight: "bold",
            color: "rgba(255, 215, 0, 0.7)",
            animation: `floatDollar ${4 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
            left: `${5 + i * 12}%`,
            top: `${10 + i * 8}%`,
            "@keyframes floatDollar": {
              "0%, 100%": {
                transform: "translateY(0px) rotate(0deg) scale(1)",
                opacity: 0.7,
              },
              "25%": {
                transform: "translateY(-30px) rotate(90deg) scale(1.2)",
                opacity: 1,
              },
              "50%": {
                transform: "translateY(-60px) rotate(180deg) scale(0.8)",
                opacity: 0.5,
              },
              "75%": {
                transform: "translateY(-30px) rotate(270deg) scale(1.1)",
                opacity: 0.9,
              },
            },
          }}
        >
          $
        </Box>
      ))}

      {/* Floating coins with different sizes */}
      {[...Array(12)].map((_, i) => (
        <Box
          key={`coin-${i}`}
          sx={{
            position: "absolute",
            width: { xs: `${16 + (i % 3) * 4}px`, sm: `${20 + (i % 3) * 6}px` },
            height: {
              xs: `${16 + (i % 3) * 4}px`,
              sm: `${20 + (i % 3) * 6}px`,
            },
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${
              i % 2 === 0 ? "#FFD700" : "#FFA500"
            }, ${i % 2 === 0 ? "#FFA500" : "#FF8C00"})`,
            opacity: 0.6,
            animation: `floatCoin ${3 + i * 0.2}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            left: `${8 + i * 7}%`,
            top: `${15 + i * 6}%`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.3)",
            },
            "@keyframes floatCoin": {
              "0%, 100%": {
                transform: "translateY(0px) rotate(0deg)",
              },
              "33%": {
                transform: "translateY(-25px) rotate(120deg)",
              },
              "66%": {
                transform: "translateY(-50px) rotate(240deg)",
              },
            },
          }}
        />
      ))}

      {/* Animated chart lines */}
      {[...Array(3)].map((_, i) => (
        <Box
          key={`chart-${i}`}
          sx={{
            position: "absolute",
            width: "60px",
            height: "40px",
            left: `${20 + i * 25}%`,
            top: `${30 + i * 20}%`,
            opacity: 0.4,
            animation: `chartGrow ${5 + i}s ease-in-out infinite`,
            animationDelay: `${i * 1}s`,
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "0%",
              background:
                "linear-gradient(to top, rgba(255, 215, 0, 0.6), rgba(255, 165, 0, 0.3))",
              animation: `chartFill ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            },
            "@keyframes chartGrow": {
              "0%, 100%": { transform: "scale(1) rotate(0deg)" },
              "50%": { transform: "scale(1.1) rotate(5deg)" },
            },
            "@keyframes chartFill": {
              "0%, 100%": { height: "20%" },
              "50%": { height: "80%" },
            },
          }}
        />
      ))}

      {/* Floating percentage signs */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={`percent-${i}`}
          sx={{
            position: "absolute",
            fontSize: { xs: "14px", sm: "18px" },
            fontWeight: "bold",
            color: "rgba(76, 175, 80, 0.7)",
            animation: `floatPercent ${6 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
            left: `${70 + i * 6}%`,
            top: `${25 + i * 15}%`,
            "@keyframes floatPercent": {
              "0%, 100%": {
                transform: "translateY(0px) scale(1)",
                opacity: 0.7,
              },
              "25%": {
                transform: "translateY(-20px) scale(1.1)",
                opacity: 1,
              },
              "50%": {
                transform: "translateY(-40px) scale(0.9)",
                opacity: 0.5,
              },
              "75%": {
                transform: "translateY(-20px) scale(1.05)",
                opacity: 0.8,
              },
            },
          }}
        >
          +{15 + i * 5}%
        </Box>
      ))}

      {/* Animated sparkles */}
      {[...Array(15)].map((_, i) => (
        <Box
          key={`sparkle-${i}`}
          sx={{
            position: "absolute",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.8)",
            left: `${10 + i * 6}%`,
            top: `${20 + i * 5}%`,
            animation: `sparkle ${2 + i * 0.2}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
            "@keyframes sparkle": {
              "0%, 100%": {
                transform: "scale(0) rotate(0deg)",
                opacity: 0,
              },
              "50%": {
                transform: "scale(1) rotate(180deg)",
                opacity: 1,
              },
            },
          }}
        />
      ))}

      {/* Floating numbers (amounts) */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={`amount-${i}`}
          sx={{
            position: "absolute",
            fontSize: { xs: "12px", sm: "14px" },
            fontWeight: "600",
            color: "rgba(255, 255, 255, 0.6)",
            animation: `floatAmount ${7 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.6}s`,
            left: `${5 + i * 18}%`,
            top: `${60 + i * 8}%`,
            "@keyframes floatAmount": {
              "0%, 100%": {
                transform: "translateY(0px) translateX(0px)",
                opacity: 0.6,
              },
              "33%": {
                transform: "translateY(-15px) translateX(10px)",
                opacity: 1,
              },
              "66%": {
                transform: "translateY(-30px) translateX(-5px)",
                opacity: 0.8,
              },
            },
          }}
        >
          ₹{(1000 + i * 500).toLocaleString()}
        </Box>
      ))}
    </Box>
  );
};

const AuthPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      {/* Fullscreen animated background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#000", // Pure black background
          zIndex: 0,
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "none", // Remove any overlay gradients
            zIndex: 1,
          },
        }}
      >
        <AnimatedBackground />
      </Box>
      {/* Overlay for centering the card, now scrollable on mobile */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "auto",
          py: { xs: 2, sm: 4 },
        }}
      >
        <Container
          component="main"
          maxWidth="sm"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            my: { xs: 2, sm: 4 },
            position: "relative",
            zIndex: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "450px" },
              borderRadius: "20px",
              overflow: "hidden",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
              position: "relative",
            }}
          >
            {/* Card Header - now white with black text */}
            <Box
              sx={{
                textAlign: "center",
                pt: { xs: 3, sm: 4 },
                pb: { xs: 2, sm: 3 },
                px: { xs: 2, sm: 3 },
                background: "#fff",
                color: "#111",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  component="h1"
                  variant={isMobile ? "h5" : "h4"}
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    textShadow: "none",
                    color: "#111",
                  }}
                >
                  Syndicator
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.95,
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 500,
                    color: "#222",
                  }}
                >
                  Smart Financial Syndication Platform
                </Typography>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    opacity: 0.8,
                  }}
                >
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.6)",
                      animation: "bounce 2s infinite",
                      animationDelay: "0s",
                    }}
                  />
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.6)",
                      animation: "bounce 2s infinite",
                      animationDelay: "0.2s",
                    }}
                  />
                  <Box
                    sx={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.6)",
                      animation: "bounce 2s infinite",
                      animationDelay: "0.4s",
                    }}
                  />
                  <style>
                    {`
                      @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1); }
                      }
                    `}
                  </style>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                background: "#fff",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleChange}
                centered
                sx={{
                  "& .MuiTab-root": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 600,
                    minHeight: { xs: "48px", sm: "56px" },
                    color: "#111",
                    "&.Mui-selected": {
                      color: "#111",
                      borderBottom: "2px solid #111",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    height: "3px",
                    borderRadius: "3px",
                    background: "#111",
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
        </Container>
      </Box>
    </>
  );
};

export default AuthPage;
