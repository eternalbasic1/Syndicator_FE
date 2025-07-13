import React from "react";
import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import StatsCard from "../../components/dashboard/StatsCard";
import GridItem from "../../components/common/GridItem";
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
  Percent as PercentIcon,
} from "@mui/icons-material";
import type {
  Transaction,
  SplitwiseEntry,
} from "../../types/transaction.types";
import { useAuth } from "@/hooks/useAuth";

interface SummaryCardsProps {
  transactions: Transaction[];
  loading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  transactions,
  loading = false,
}) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) {
    return (
      <Box>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          fontWeight={600}
          color="text.primary"
          sx={{ mb: { xs: 2, sm: 3 } }}
        >
          Quick Stats
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 3 } }}>
          {[1, 2, 3, 4].map((i) => (
            <Box
              key={i}
              sx={{
                flex: {
                  xs: "1 1 calc(50% - 8px)",
                  sm: "1 1 calc(50% - 12px)",
                  md: "1 1 calc(25% - 18px)",
                },
              }}
            >
              <StatsCard
                title="Loading..."
                value="₹0"
                icon={<AccountBalanceIcon />}
                color="primary"
                loading={true}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  const totalPrincipal = transactions.reduce((sum, t) => {
    const userEntry = t.splitwise_entries?.find(
      (entry: SplitwiseEntry) => entry.syndicator_id === user?.user_id
    );
    if (userEntry) {
      sum += userEntry.principal_amount;
    }
    return sum;
  }, 0);

  const totalGrossInterest = transactions.reduce((sum, t) => {
    const userEntry = t.splitwise_entries?.find(
      (entry: SplitwiseEntry) => entry.syndicator_id === user?.user_id
    );
    if (userEntry) {
      const grossInterest =
        (userEntry.principal_amount * t.total_interest) / 100;
      sum += grossInterest;
    }
    return sum;
  }, 0);

  const totalNetInterest = transactions.reduce((sum, t) => {
    const userEntry = t.splitwise_entries?.find(
      (entry: SplitwiseEntry) => entry.syndicator_id === user?.user_id
    );
    if (userEntry) {
      sum += userEntry.interest_after_commission || 0;
    }
    return sum;
  }, 0);

  const totalCommissionEarned = Array.isArray(transactions)
    ? transactions.reduce((sum, tx) => {
        const userEntry = tx.splitwise_entries?.find(
          (entry: SplitwiseEntry) => entry.syndicator_id === tx.risk_taker_id
        );
        if (userEntry?.syndicator_id === user?.user_id) {
          return sum + (tx.total_commission_earned || 0);
        }
        return sum;
      }, 0)
    : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statsData = [
    {
      title: "Total Principal",
      value: formatCurrency(totalPrincipal),
      icon: <AccountBalanceIcon />,
      color: "primary" as const,
    },
    {
      title: "Total Gross Interest",
      value: formatCurrency(totalGrossInterest),
      icon: <TrendingUpIcon />,
      color: "success" as const,
    },
    {
      title: "Total Net Interest",
      value: formatCurrency(totalNetInterest),
      icon: <MonetizationOnIcon />,
      color: "info" as const,
    },
    {
      title: "Total Commission",
      value: formatCurrency(totalCommissionEarned),
      icon: <PercentIcon />,
      color: "warning" as const,
    },
  ];

  return (
    <Box>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight={600}
        color="text.primary"
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        Quick Stats
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 3 } }}>
        {statsData.map((stat, index) => (
          <Box
            key={index}
            sx={{
              flex: {
                xs: "1 1 calc(50% - 8px)",
                sm: "1 1 calc(50% - 12px)",
                md: "1 1 calc(25% - 18px)",
              },
            }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              loading={false}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SummaryCards;
