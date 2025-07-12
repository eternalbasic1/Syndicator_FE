import React from "react";
import {
  Paper,
  Box,
  Typography,
  CircularProgress,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  loading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: "12px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        "&:hover": {
          boxShadow: (theme) => theme.shadows[6],
          transform: "translateY(-4px)",
        },
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1.5, sm: 2 }}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Stack spacing={0.5}>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            fontWeight="medium"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          >
            {title}
          </Typography>
          {loading ? (
            <Box sx={{ pt: 1 }}>
              <CircularProgress size={isMobile ? 24 : 28} />
            </Box>
          ) : (
            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="div"
              fontWeight="bold"
              sx={{ fontSize: { xs: "1.125rem", sm: "1.5rem" } }}
            >
              {value}
            </Typography>
          )}
        </Stack>
        <Box
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: { xs: 44, sm: 52 },
            height: { xs: 44, sm: 52 },
            borderRadius: "12px",
            backgroundColor: theme.palette[color].light,
            color: theme.palette[color].main,
            "& svg": {
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
            },
          })}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
};

export default StatsCard;
