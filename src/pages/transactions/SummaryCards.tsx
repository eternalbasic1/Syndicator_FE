import React from "react";
import { Grid, Typography, Box, Paper } from "@mui/material";
import StatCard from "../../components/common/StatCard";
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
} from "@mui/icons-material";
import type {
  Transaction,
  SplitwiseEntry,
} from "../../types/transaction.types";

interface SummaryCardsProps {
  transactions: Transaction[];
  loading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  transactions,
  loading = false,
}) => {
  console.log("Hitting summary");

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", mb: 4 }}>
        <Paper
          elevation={2}
          sx={{ p: 3, borderRadius: 4, bgcolor: "background.default" }}
        >
          <Grid container spacing={5}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <StatCard
                  icon={<AccountBalanceIcon />}
                  label="Loading..."
                  value={0}
                  color="#e5e7eb"
                />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    );
  }

  const totalPrincipal = transactions.reduce<number>((sum, t) => {
    const userEntry = t.splitwise_entries?.find(
      (entry: SplitwiseEntry) => entry.syndicator_id === t.risk_taker_id
    );
    if (userEntry) {
      sum += userEntry.principal_amount;
    }
    return sum;
  }, 0);

  const totalInterest = transactions.reduce<number>((sum, t) => {
    const userEntry = t.splitwise_entries?.find(
      (entry: SplitwiseEntry) => entry.syndicator_id === t.risk_taker_id
    );
    if (userEntry) {
      const interest = (userEntry.principal_amount * t.total_interest) / 100;
      sum += interest;
    }
    return sum;
  }, 0);

  const totalCommissionEarned = transactions.reduce<number>((sum, t) => {
    return sum + (t.total_commission_earned || 0);
  }, 0);

  const activeSyndicates = transactions.length;

  const statCards = [
    {
      icon: <AccountBalanceIcon fontSize="inherit" />,
      label: "Total Principal",
      value: `₹${totalPrincipal.toLocaleString()}`,
      color: "#6366f1",
      description: "Your invested amount",
    },
    {
      icon: <TrendingUpIcon fontSize="inherit" />,
      label: "Total Interest",
      value: `₹${totalInterest.toLocaleString()}`,
      color: "#22c55e",
      description: "Your earned interest",
    },
    {
      icon: <MonetizationOnIcon fontSize="inherit" />,
      label: "Total Commission",
      value: `₹${totalCommissionEarned.toLocaleString()}`,
      color: "#f59e42",
      description: "Your earned commission",
    },
    {
      icon: <PeopleIcon fontSize="inherit" />,
      label: "Active Syndicates",
      value: activeSyndicates,
      color: "#3b82f6",
      description: "Active investment groups",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mb: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Quick Stats
      </Typography>

      <Grid container spacing={5}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={card.label}>
            <Box
              sx={{
                minWidth: 220,
                boxShadow: "0 2px 16px 0 rgba(60,60,60,0.06)",
                borderRadius: 4,
              }}
            >
              <StatCard {...card} />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SummaryCards;
