import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Grid } from "@mui/material";
import {
  useGetPortfolioQuery,
  useGetAllTransactionsQuery,
} from "../store/api/transactionApi";
import type {
  Transaction,
  PortfolioStats as PortfolioStatsType,
} from "../types/transaction.types";
import Portfolio from "../components/portfolio/Portfolio";
import PortfolioChart from "../components/portfolio/PortfolioChart";
import PortfolioStats from "../components/portfolio/PortfolioStats";
import { useMemo } from "react";

const PortfolioPage: React.FC = () => {
  const { data: portfolioData, isLoading: portfolioLoading } =
    useGetPortfolioQuery();
  const { data: transactionsResponse, isLoading: transactionsLoading } =
    useGetAllTransactionsQuery();

  const allTransactions = useMemo<Transaction[]>(() => {
    if (!transactionsResponse) return [];
    const rawTransactions = Array.isArray(transactionsResponse)
      ? transactionsResponse
      : transactionsResponse.transactions || [];
    return rawTransactions.map(
      (tx: Partial<Transaction> & { total_interest_amount?: number }) => ({
        transaction_id: tx.transaction_id || "",
        risk_taker_id: tx.risk_taker_id || "",
        risk_taker_username: tx.risk_taker_username || "",
        risk_taker_name: tx.risk_taker_name || null,
        syndicators: tx.syndicators || [],
        total_principal_amount: tx.total_principal_amount || 0,
        total_interest: tx.total_interest || 0,
        commission_flag: tx.commission_flag || false,
        commission_rate: tx.commission_rate || 0,
        total_commission_earned: tx.total_commission_earned || 0,
        created_at: tx.created_at || new Date().toISOString(),
        start_date: tx.start_date || new Date().toISOString(),
        splitwise_entries: tx.splitwise_entries || [],
      })
    );
  }, [transactionsResponse]);

  const portfolioSummary = useMemo<
    PortfolioStatsType & {
      total_value: number;
      roi_percentage: number;
      monthly_earnings: number;
    }
  >(() => {
    const totalPrincipal = portfolioData?.total_principal_amount || 0;
    const totalInterestAfterCommission =
      portfolioData?.total_interest_after_commission || 0;
    const totalValue = totalPrincipal + totalInterestAfterCommission;
    const roiPercentage =
      totalPrincipal > 0
        ? (totalInterestAfterCommission / totalPrincipal) * 100
        : 0;
    const monthlyEarnings = totalInterestAfterCommission / 12; // Simplified

    return {
      total_principal_amount: totalPrincipal,
      total_original_interest: portfolioData?.total_original_interest || 0,
      total_interest_after_commission: totalInterestAfterCommission,
      total_commission_impact: portfolioData?.total_commission_impact || 0,
      breakdown: portfolioData?.breakdown || {
        as_risk_taker: {
          principal: 0,
          interest: 0,
          commission_earned: 0,
        },
        as_syndicate_member: {
          principal: 0,
          original_interest: 0,
          interest_after_commission: 0,
          commission_paid: 0,
        },
      },
      total_value: totalValue,
      roi_percentage: roiPercentage,
      monthly_earnings: monthlyEarnings,
    };
  }, [portfolioData, allTransactions]);

  const isLoading = portfolioLoading || transactionsLoading;

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        Portfolio Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Portfolio
              summary={{
                total_principal_amount: portfolioSummary.total_principal_amount,
                total_interest_amount:
                  portfolioSummary.total_interest_after_commission,
                total_value: portfolioSummary.total_value,
                roi_percentage: portfolioSummary.roi_percentage,
                active_transactions: allTransactions.length,
                monthly_earnings: portfolioSummary.monthly_earnings,
              }}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>

        {/* Detailed Statistics */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <PortfolioStats
              transactions={allTransactions}
              totalPrincipal={portfolioSummary.total_principal_amount}
              totalInterest={portfolioSummary.total_interest_after_commission}
              loading={isLoading}
            />
          </Paper>
        </Grid>

        {/* Portfolio Distribution & Monthly Performance */}
        <Grid item xs={12}>
          <PortfolioChart
            transactions={allTransactions}
            totalPrincipal={portfolioSummary.total_principal_amount}
            totalInterest={portfolioSummary.total_interest_after_commission}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PortfolioPage;
