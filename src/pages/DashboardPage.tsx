import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Alert, Grid } from '@mui/material';
import GridItem from '../components/common/GridItem';
import QuickActions from '../components/dashboard/QuickActions';
import {
  Savings as SavingsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useGetAllTransactionsQuery } from '../store/api/transactionApi';
import { useGetFriendRequestsQuery } from '../store/api/friendApi';
import type { Transaction, SplitwiseEntry } from '../types/transaction.types';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';

const DashboardPage: React.FC = () => {
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

  // Transform transactions to match Transaction type
  const transactions = useMemo<Transaction[]>(() => {
    if (!transactionsResponse) return [];
    
    // Get the raw transactions array
    let rawTransactions: unknown[] = [];
    if (Array.isArray(transactionsResponse)) {
      rawTransactions = transactionsResponse;
    } else if (transactionsResponse && typeof transactionsResponse === 'object' && 'transactions' in transactionsResponse) {
      const resp = transactionsResponse as { transactions: unknown };
      rawTransactions = Array.isArray(resp.transactions) ? resp.transactions : [];
    }
    
    // Transform to match Transaction type
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
    // Calculate total principal and interest from user's splitwise entries
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

  // Move QuickStats component before its usage
  const QuickStats: React.FC = () => (
    <Box sx={{ mt: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Active Investments: {stats.activeTransactions}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Pending Requests: {stats.pendingRequests}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.name || user?.username}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
            title="Active Transactions"
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

      {(isFriendsError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load friend requests. Please try again later.
        </Alert>
      )}

      <Grid container spacing={3}>
        <GridItem xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Transactions
              </Typography>
              <RecentTransactions transactions={transactions} loading={isTransactionsLoading} />
            </CardContent>
          </Card>
        </GridItem>
        
        <GridItem xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <QuickActions />
            </CardContent>
          </Card>
        </GridItem>
      </Grid>

      <Grid container spacing={3}>
        <GridItem xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Stats
              </Typography>
              <QuickStats />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Return Rate:
                </Typography>
                <Typography 
                  variant="h5" 
                  color={stats.returnRate >= 0 ? 'success.main' : 'error.main'}
                >
                  {stats.returnRate >= 0 ? '+' : ''}{stats.returnRate.toFixed(2)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default DashboardPage;