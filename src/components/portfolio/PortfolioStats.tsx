//TODO: Grid fix
// /* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Typography,
  Grid,
  Chip,
  Avatar,
  Paper,
  Stack,
  Divider,
  Skeleton,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Percent,
  Timeline,
  Group,
  InfoOutlined,
} from "@mui/icons-material";
import type { Transaction } from "../../types/transaction.types";
import { formatCurrency, formatPercentage } from "../../utils/formatters";

interface PortfolioStatsProps {
  transactions: Transaction[];
  totalPrincipal: number;
  totalInterest: number;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "primary" | "secondary" | "success" | "warning" | "error" | "info";
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4, height: "100%" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            bgcolor: `${color}.light`,
            color: `${color}.dark`,
            width: 56,
            height: 56,
          }}
        >
          {icon}
        </Avatar>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight="600">
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Stack>
      </Stack>
      {trend && (
        <Stack direction="row" alignItems="center" spacing={0.5} mt={1.5}>
          {trend.isPositive ? (
            <TrendingUp sx={{ color: "success.main", fontSize: "1rem" }} />
          ) : (
            <TrendingDown sx={{ color: "error.main", fontSize: "1rem" }} />
          )}
          <Typography
            variant="caption"
            sx={{
              color: trend.isPositive ? "success.dark" : "error.dark",
              fontWeight: "bold",
            }}
          >
            {trend.value}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};

const PortfolioStats: React.FC<PortfolioStatsProps> = ({
  transactions,
  totalPrincipal,
  totalInterest,
  loading = false,
}) => {
  const stats = React.useMemo(() => {
    if (transactions.length === 0) {
      return {
        totalTransactions: 0,
        averageTransaction: 0,
        totalSyndicators: 0,
        averageInterestRate: 0,
        maxTransaction: 0,
        minTransaction: 0,
        recentTransactions: 0,
        roi: 0,
      };
    }
    console.log("transactions=", transactions);
    const amounts = transactions.map((t) => t.total_principal_amount);
    const totalSyndicators = transactions.reduce(
      (sum, t) => sum + t.syndicators.length,
      0
    );
    const averageInterestRate =
      transactions.reduce((sum, t) => sum + t.total_interest, 0) /
      transactions.length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTransactions = transactions.filter(
      (t) => new Date(t.created_at) >= thirtyDaysAgo
    ).length;

    const roi = totalPrincipal > 0 ? (totalInterest / totalPrincipal) * 100 : 0;

    return {
      totalTransactions: transactions.length,
      averageTransaction: totalPrincipal / transactions.length,
      totalSyndicators,
      averageInterestRate,
      maxTransaction: Math.max(...amounts),
      minTransaction: Math.min(...amounts),
      recentTransactions,
      roi,
    };
  }, [transactions, totalPrincipal, totalInterest]);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton variant="rounded" height={120} sx={{ borderRadius: 4 }} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Skeleton variant="rounded" height={150} sx={{ borderRadius: 4 }} />
        </Grid>
      </Grid>
    );
  }

  const insights = [
    stats.recentTransactions > 0 &&
      `+${stats.recentTransactions} new deals this month`,
    stats.averageInterestRate > 15 && "Portfolio contains high-yield assets",
    stats.totalSyndicators > stats.totalTransactions * 1.5 &&
      "Strong syndication network",
    stats.roi > 20 && "Exceeding ROI targets",
  ].filter(Boolean) as string[];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          Detailed Statistics
        </Typography>
      </Grid>

      {/* Stat Cards */}
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={<Timeline />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Avg. Transaction Value"
          value={formatCurrency(stats.averageTransaction)}
          icon={<AccountBalance />}
          color="warning"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Total Syndicators"
          value={stats.totalSyndicators}
          icon={<Group />}
          color="info"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Largest Transaction"
          value={formatCurrency(stats.maxTransaction)}
          icon={<TrendingUp />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Smallest Transaction"
          value={formatCurrency(stats.minTransaction)}
          icon={<TrendingDown />}
          color="error"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Overall ROI"
          value={formatPercentage(stats.roi)}
          icon={<Percent />}
          color="secondary"
        />
      </Grid>

      {/* Quick Insights */}
      {insights.length > 0 && (
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4 }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={600}>
                Quick Insights
              </Typography>
              <Divider />
              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {insights.map((insight, i) => (
                  <Chip
                    key={i}
                    icon={<InfoOutlined />}
                    label={insight}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default PortfolioStats;
