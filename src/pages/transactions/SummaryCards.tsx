import React from "react";
import { Grid, Typography } from "@mui/material";
import StatsCard from "../../components/dashboard/StatsCard";
import GridItem from "../../components/common/GridItem";
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  MonetizationOn as MonetizationOnIcon,
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
  if (loading) {
    return (
      <Grid container spacing={{ xs: 1, sm: 3 }}>
        {[1, 2, 3, 4].map((i) => (
          <GridItem xs={12} sm={6} md={3} key={i}>
            <StatsCard
              title="Loading..."
              value={0}
              icon={<AccountBalanceIcon />}
              color="primary"
              loading={true}
            />
          </GridItem>
        ))}
      </Grid>
    );
  }

  const totalPrincipal = transactions.reduce<number>((sum, t) => {
    const userEntry = t.splitwise_entries?.find(
      (entry: SplitwiseEntry) => entry.syndicator_id === user?.user_id
    );
    if (userEntry) {
      sum += userEntry.principal_amount;
    }
    return sum;
  }, 0);

  const totalGrossInterest = transactions.reduce<number>((sum, t) => {
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

  const totalNetInterest = transactions.reduce<number>((sum, t) => {
    const userEntry = t.splitwise_entries?.find(
      (entry: SplitwiseEntry) => entry.syndicator_id === user?.user_id
    );
    if (userEntry) {
      sum += userEntry.interest_after_commission || 0;
    }
    return sum;
  }, 0);

  const totalCommissionEarned = Array.isArray(transactions)
    ? transactions.reduce<number>((sum, tx) => {
        const userEntry = tx.splitwise_entries?.find(
          (entry: SplitwiseEntry) => entry.syndicator_id === tx.risk_taker_id
        );
        if (userEntry?.syndicator_id === user?.user_id) {
          return sum + (tx.total_commission_earned || 0);
        }
        return sum; // Return current sum, not 0
      }, 0)
    : 0;

  // const activeSyndicates = transactions.length;

  return (
    <>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Quick Stats
      </Typography>
      <Grid container spacing={2} alignItems="stretch">
        <GridItem xs={8} sm={6} md={4}>
          <StatsCard
            title="Total Principal"
            value={`₹${totalPrincipal.toLocaleString()}`}
            icon={<AccountBalanceIcon />}
            color="primary"
          />
        </GridItem>
        <GridItem xs={8} sm={6} md={4}>
          <StatsCard
            title="Total Gross Interest"
            value={`₹${totalGrossInterest.toLocaleString()}`}
            icon={<TrendingUpIcon />}
            color="success"
          />
        </GridItem>
        <GridItem xs={8} sm={6} md={4}>
          <StatsCard
            title="Total Net Interest"
            value={`₹${totalNetInterest.toLocaleString()}`}
            icon={<TrendingUpIcon />}
            color="info"
          />
        </GridItem>
        <GridItem xs={8} sm={6} md={4}>
          <StatsCard
            title="Total Commission"
            value={`₹${totalCommissionEarned.toLocaleString()}`}
            icon={<MonetizationOnIcon />}
            color="warning"
          />
        </GridItem>
      </Grid>
    </>
  );
};

export default SummaryCards;
