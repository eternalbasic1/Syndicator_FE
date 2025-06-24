import React from 'react';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { Grid } from '@mui/material';
import { useGetPortfolioQuery, useGetAllTransactionsQuery } from '../store/api/transactionApi';
import type { Transaction, PortfolioStats as PortfolioStatsType } from '../types/transaction.types';
import Portfolio from '../components/portfolio/Portfolio';
import PortfolioChart from '../components/portfolio/PortfolioChart';
import PortfolioStats from '../components/portfolio/PortfolioStats';
import { useMemo } from 'react';

const PortfolioPage: React.FC = () => {
  const { data: portfolioData, isLoading: portfolioLoading } = useGetPortfolioQuery();
  const { data: transactionsResponse, isLoading: transactionsLoading } = useGetAllTransactionsQuery();

  const allTransactions = useMemo<Transaction[]>(() => {
    if (!transactionsResponse) return [];
    const rawTransactions = Array.isArray(transactionsResponse)
      ? transactionsResponse
      : transactionsResponse.transactions || [];
    return rawTransactions.map(
      (tx: Partial<Transaction> & { total_interest_amount?: number }) => ({
        transaction_id: tx.transaction_id || '',
        risk_taker_id: tx.risk_taker_id || '',
        risk_taker_username: tx.risk_taker_username || '',
        risk_taker_name: tx.risk_taker_name || null,
        syndicators: tx.syndicators || [],
        total_principal_amount: tx.total_principal_amount || 0,
        total_interest: tx.total_interest_amount || tx.total_interest || 0,
        created_at: tx.created_at || new Date().toISOString(),
        start_date: tx.start_date || new Date().toISOString(),
        splitwise_entries: tx.splitwise_entries || [],
      })
    );
  }, [transactionsResponse]);

  const portfolioSummary = useMemo<PortfolioStatsType & { total_value: number; roi_percentage: number; monthly_earnings: number }>(() => {
    const totalPrincipal = portfolioData?.total_principal_amount || 0;
    const totalInterest = portfolioData?.total_interest_amount || 0;
    const totalValue = totalPrincipal + totalInterest;
    const roiPercentage = totalPrincipal > 0 ? (totalInterest / totalPrincipal) * 100 : 0;
    const activeTransactions = allTransactions.length;
    const monthlyEarnings = totalInterest / 12; // Simplified

    return {
      total_principal_amount: totalPrincipal,
      total_interest_amount: totalInterest,
      active_transactions: activeTransactions,
      total_value: totalValue,
      roi_percentage: roiPercentage,
      monthly_earnings: monthlyEarnings,
    };
  }, [portfolioData, allTransactions]);

  const isLoading = portfolioLoading || transactionsLoading;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        Portfolio Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Portfolio Summary */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 4 }}>
            <Portfolio
              summary={portfolioSummary}
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
              totalInterest={portfolioSummary.total_interest_amount}
              loading={isLoading}
            />
          </Paper>
        </Grid>

        {/* Portfolio Distribution & Monthly Performance */}
        <Grid item xs={12}>
          <PortfolioChart
            transactions={allTransactions}
            totalPrincipal={portfolioSummary.total_principal_amount}
            totalInterest={portfolioSummary.total_interest_amount}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default PortfolioPage;