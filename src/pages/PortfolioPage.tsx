import React from 'react';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import GridItem from '../components/common/GridItem';
import { useGetPortfolioQuery, useGetAllTransactionsQuery } from '../store/api/transactionApi';
import Portfolio from '../components/portfolio/Portfolio';
import PortfolioChart from '../components/portfolio/PortfolioChart';
import PortfolioStats from '../components/portfolio/PortfolioStats';

const PortfolioPage: React.FC = () => {
  const { data: portfolioData, isLoading: portfolioLoading } = useGetPortfolioQuery();
  const { data: transactionsData, isLoading: transactionsLoading } = useGetAllTransactionsQuery();

  if (portfolioLoading || transactionsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  // Calculate additional portfolio metrics
  const totalPrincipal = portfolioData?.total_principal_amount || 0;
  const totalInterest = portfolioData?.total_interest_amount || 0;
  const totalValue = totalPrincipal + totalInterest;
  const roiPercentage = totalPrincipal > 0 ? (totalInterest / totalPrincipal) * 100 : 0;
  const activeTransactions = transactionsData?.length || 0;
  const monthlyEarnings = totalInterest / 12; // Simplified monthly earnings calculation

  const portfolioSummary = {
    total_principal_amount: totalPrincipal,
    total_interest_amount: totalInterest,
    total_value: totalValue,
    roi_percentage: roiPercentage,
    active_transactions: activeTransactions,
    monthly_earnings: monthlyEarnings,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Portfolio Overview
      </Typography>

      <Grid container spacing={4}>
        <GridItem xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Portfolio
              summary={portfolioSummary}
              isLoading={portfolioLoading || transactionsLoading}
            />
          </Paper>
        </GridItem>

        <GridItem xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <PortfolioStats
              transactions={transactionsData || []}
              totalPrincipal={totalPrincipal}
              totalInterest={totalInterest}
              loading={transactionsLoading}
            />
          </Paper>
        </GridItem>

        <GridItem xs={12}>
          <Paper sx={{ p: 3 }}>
            <PortfolioChart
              transactions={transactionsData || []}
              totalPrincipal={totalPrincipal}
              totalInterest={totalInterest}
            />
          </Paper>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default PortfolioPage;