import { useMemo } from 'react';
import type { FunctionComponent } from 'react';
import { 
  Box, 
  Typography, 
  Alert, 
  Grid, 
  Container, 
  Paper, 
  Stack,
  CircularProgress, 
} from '@mui/material';
import {
  Savings as SavingsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';

import QuickActions from '../components/dashboard/QuickActions';
import GridItem from '../components/common/GridItem';
import { useAuth } from '../hooks/useAuth';
import { useGetAllTransactionsQuery } from '../store/api/transactionApi';
import { useGetFriendRequestsQuery } from '../store/api/friendApi';
import type { Transaction, SplitwiseEntry } from '../types/transaction.types';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import QuickStats from '../components/dashboard/QuickStats';

const DashboardPage: FunctionComponent = () => {
  const { user } = useAuth();

  const { 
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
  } = useGetAllTransactionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { 
    data: friendRequests, 
    isLoading: isFriendsLoading,
    isError: isFriendsError
  } = useGetFriendRequestsQuery();

  const transactions = useMemo<Transaction[]>(() => {
    if (!transactionsResponse) return [];
    
    let rawTransactions: unknown[] = [];
    if (Array.isArray(transactionsResponse)) {
      rawTransactions = transactionsResponse;
    } else if (transactionsResponse && typeof transactionsResponse === 'object' && 'transactions' in transactionsResponse) {
      const resp = transactionsResponse as { transactions: unknown };
      rawTransactions = Array.isArray(resp.transactions) ? resp.transactions : [];
    }
    
    return rawTransactions.map((tx: unknown) => {
      const recordTx = tx as Record<string, unknown>;
      const amount = typeof recordTx.amount === 'number' ? recordTx.amount : 0;
      const interest = typeof recordTx.interest === 'number' ? recordTx.interest : 0;
      
      return {
        transaction_id: typeof recordTx.id === 'string' ? recordTx.id : '',
        risk_taker_id: typeof recordTx.risk_taker_id === 'string' ? recordTx.risk_taker_id : '',
        risk_taker_username: typeof recordTx.risk_taker_username === 'string' ? recordTx.risk_taker_username : '',
        risk_taker_name: typeof recordTx.risk_taker_name === 'string' ? recordTx.risk_taker_name : null,
        syndicators: Array.isArray(recordTx.syndicators) ? recordTx.syndicators : [],
        total_principal_amount: amount,
        total_interest: interest,
        created_at: recordTx.created_at as string || new Date().toISOString(),
        start_date: recordTx.start_date as string || new Date().toISOString(),
        splitwise_entries: Array.isArray(recordTx.splitwise_entries) ? recordTx.splitwise_entries : []
      } as Transaction;
    });
  }, [transactionsResponse]);

  const stats = useMemo(() => {
    const userEntries = transactions.flatMap(tx => 
      tx.splitwise_entries.filter(entry => entry.syndicator_username === user?.username)
    );

    const totalPrincipal = userEntries.reduce((sum: number, entry: SplitwiseEntry) => 
      sum + entry.principal_amount, 0
    );
    
    const totalInterestAmount = userEntries.reduce((sum: number, entry: SplitwiseEntry) => 
      sum + entry.interest_amount/100*entry.principal_amount, 0
    );
    
    const pendingRequestsCount = friendRequests?.requests?.received?.filter(
      (req: { status: string }) => req.status === 'pending'
    ).length || 0;

    return {
      totalPrincipal,
      totalInterestAmount,
      pendingRequests: pendingRequestsCount,
      totalPortfolioValue: totalPrincipal + totalInterestAmount,
      returnRate: totalPrincipal > 0 ? (totalInterestAmount / totalPrincipal) * 100 : 0,
      activeTransactions: transactions.length
    };
  }, [friendRequests, transactions, user]);

  if (isTransactionsLoading || isFriendsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: (theme) => theme.palette.background.default, 
      minHeight: '100vh', 
      py: 4 
    }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          {/* Header */}
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back, {user?.name || user?.username}! Here's your financial overview.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3}>
            <GridItem xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Invested"
                value={`₹${stats.totalPrincipal.toLocaleString()}`}
                icon={<SavingsIcon />}
                color="primary"
                loading={isTransactionsLoading}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Returns"
                value={`₹${stats.totalInterestAmount.toLocaleString()}`}
                icon={<TrendingUpIcon />}
                color="success"
                loading={isTransactionsLoading}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <StatsCard
                title="Active Syndications"
                value={stats.activeTransactions.toString()}
                icon={<AccountBalanceIcon />}
                color="info"
                loading={isTransactionsLoading}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <StatsCard
                title="Pending Requests"
                value={stats.pendingRequests.toString()}
                icon={<PeopleIcon />}
                color="warning"
                loading={isFriendsLoading}
              />
            </GridItem>
          </Grid>

          {isFriendsError && (
            <Alert severity="error">
              Failed to load friend requests. Please try again later.
            </Alert>
          )}

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Recent Transactions */}
            <GridItem xs={12} lg={8}>
              <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: '12px' }}>
                <Typography variant="h6" component="h2" gutterBottom fontWeight="600">
                  Recent Transactions
                </Typography>
                <RecentTransactions transactions={transactions} loading={isTransactionsLoading} />
              </Paper>
            </GridItem>
            
            {/* Side Panel */}
            <GridItem xs={12} lg={4}>
              <Stack spacing={3}>
                {/* Quick Actions */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                  <Typography variant="h6" component="h2" gutterBottom fontWeight="600">
                    Quick Actions
                  </Typography>
                  <QuickActions />
                </Paper>
                
                {/* Quick Stats & Return Rate */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: '12px' }}>
                  <Typography variant="h6" component="h2" gutterBottom fontWeight="600">
                    Portfolio Snapshot
                  </Typography>
                  <QuickStats 
                    activeTransactions={stats.activeTransactions}
                    pendingRequests={stats.pendingRequests}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Overall Return Rate:
                    </Typography>
                    <Typography 
                      variant="h4" 
                      fontWeight="bold"
                      color={stats.returnRate >= 0 ? 'success.main' : 'error.main'}
                    >
                      {stats.returnRate >= 0 ? '+' : ''}{stats.returnRate.toFixed(2)}%
                    </Typography>
                  </Box>
                </Paper>
              </Stack>
            </GridItem>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default DashboardPage;