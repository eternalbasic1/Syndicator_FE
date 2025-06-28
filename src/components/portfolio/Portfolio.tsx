import React from "react";
import {
  Typography,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Stack,
  Paper,
  Grid,
  Skeleton,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Percent as PercentIcon,
  MonetizationOn as MonetizationOnIcon,
  MonetizationOn as MonthlyEarningsIcon,
} from "@mui/icons-material";
import { formatCurrency, formatPercentage } from "../../utils/formatters";

interface PortfolioSummary {
  total_principal_amount: number;
  total_interest_amount: number;
  total_commission_earned: number;
  total_value: number;
  roi_percentage: number;
  active_transactions: number;
  monthly_earnings: number;
}

interface PortfolioProps {
  summary: PortfolioSummary;
  isLoading?: boolean;
}

const Portfolio: React.FC<PortfolioProps> = ({
  summary,
  isLoading = false,
}) => {
  const {
    total_principal_amount,
    total_interest_amount,
    total_commission_earned,
    total_value,
    roi_percentage,
    active_transactions,
    monthly_earnings,
  } = summary;

  const stats = [
    {
      title: "Total Principal",
      value: formatCurrency(total_principal_amount),
      icon: <AccountBalanceIcon />,
      color: "primary" as const,
    },
    {
      title: "Total Interest",
      value: formatCurrency(total_interest_amount),
      icon: <TrendingUpIcon />,
      color: "secondary" as const,
    },
    {
      title: "Total Commission",
      value: formatCurrency(total_commission_earned),
      icon: <MonetizationOnIcon />,
      color: "warning" as const,
    },
    {
      title: "Total Value",
      value: formatCurrency(total_value),
      icon: <PercentIcon />,
      color: "success" as const,
    },
    {
      title: "Monthly Earnings",
      value: formatCurrency(monthly_earnings),
      icon: <MonthlyEarningsIcon />,
      color: "info" as const,
    },
  ];

  if (isLoading) {
    return (
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Skeleton variant="text" width={250} height={40} />
          <Skeleton
            variant="rectangular"
            width={180}
            height={32}
            sx={{ borderRadius: "16px" }}
          />
        </Stack>
        <Grid container spacing={3}>
          {[...Array(5)].map((_, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Skeleton
                variant="rounded"
                height={150}
                sx={{ borderRadius: 4 }}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
          </Grid>
        </Grid>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h1" fontWeight="bold">
          Portfolio Summary
        </Typography>
        <Chip
          label={`${active_transactions} Active Transactions`}
          color="primary"
          variant="filled"
          sx={{ fontWeight: "bold" }}
        />
      </Stack>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Paper
              elevation={2}
              sx={{
                p: 2.5,
                borderRadius: 4,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Stack spacing={1}>
                <Avatar
                  sx={{
                    bgcolor: `${stat.color}.light`,
                    color: `${stat.color}.dark`,
                    width: 48,
                    height: 48,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h5" fontWeight="bold">
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Lower Section */}
      <Grid container spacing={3}>
        {/* Monthly Performance */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4, height: "100%" }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight="600">
                Performance Metrics
              </Typography>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1" color="text.secondary">
                  Avg. Monthly Earnings
                </Typography>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {formatCurrency(monthly_earnings)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="body1" color="text.secondary">
                  Overall ROI
                </Typography>
                <Chip
                  label={`${formatPercentage(roi_percentage)}`}
                  color={roi_percentage >= 0 ? "success" : "error"}
                  size="small"
                  sx={{ fontWeight: "bold" }}
                />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* Portfolio Health */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4, height: "100%" }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight="600">
                Portfolio Health
              </Typography>
              <Divider />
              <Stack spacing={2.5}>
                <Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={0.5}
                  >
                    <Typography variant="body1">
                      Interest vs Principal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatPercentage(
                        (total_interest_amount / total_principal_amount) * 100
                      )}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(
                      (total_interest_amount / total_principal_amount) * 100,
                      100
                    )}
                    color="primary"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Stack>
                <Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    mb={0.5}
                  >
                    <Typography variant="body1">
                      Active Transaction Load
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {active_transactions} / 10
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((active_transactions / 10) * 100, 100)}
                    color="warning"
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default Portfolio;
