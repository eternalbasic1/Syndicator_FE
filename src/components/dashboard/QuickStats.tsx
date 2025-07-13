import type { FunctionComponent } from "react";
import {
  Typography,
  Stack,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

interface QuickStatsProps {
  activeTransactions: number;
  pendingRequests: number;
}

const QuickStats: FunctionComponent<QuickStatsProps> = ({
  activeTransactions,
  pendingRequests,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: "12px",
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      }}
    >
      <Typography
        variant={isMobile ? "h6" : "h6"}
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: { xs: 1.5, sm: 2 },
          fontSize: { xs: "1rem", sm: "1.125rem" },
        }}
      >
        Portfolio Snapshot
      </Typography>
      <Stack spacing={{ xs: 1.5, sm: 2 }} mt={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Active Syndications
          </Typography>
          <Typography
            variant="h6"
            fontWeight="medium"
            sx={{ fontSize: { xs: "1.125rem", sm: "1.25rem" } }}
          >
            {activeTransactions}
          </Typography>
        </Stack>
        <Divider />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Pending Friend Requests
          </Typography>
          <Typography
            variant="h6"
            fontWeight="medium"
            sx={{ fontSize: { xs: "1.125rem", sm: "1.25rem" } }}
          >
            {pendingRequests}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default QuickStats;
