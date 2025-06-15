import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Alert, Grid, type GridProps } from '@mui/material';
import QuickActions from '../components/dashboard/QuickActions';
import {
  Savings as SavingsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useGetAllTransactionsQuery, useGetPortfolioQuery } from '../store/api/transactionApi';
import { useGetFriendRequestsQuery } from '../store/api/friendApi';
import type { TransactionMetaData } from '../types/transaction.types';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    data: portfolio, 
    isLoading: isPortfolioLoading, 
    isError: isPortfolioError 
  } = useGetPortfolioQuery();
  
  const { 
    data: transactionsResponse,
    isLoading: isTransactionsLoading,
  } = useGetAllTransactionsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  
  // Transform transactions to match TransactionMetaData type
  const transactions = useMemo<TransactionMetaData[]>(() => {
    if (!transactionsResponse) return [];
    
    // Get the raw transactions array
    let rawTransactions: unknown[] = [];
    if (Array.isArray(transactionsResponse)) {
      rawTransactions = transactionsResponse;
    } else if (transactionsResponse && typeof transactionsResponse === 'object' && 'transactions' in transactionsResponse) {
      const resp = transactionsResponse as { transactions: unknown };
      rawTransactions = Array.isArray(resp.transactions) ? resp.transactions : [];
    }
    
    // Transform to match TransactionMetaData type
    return rawTransactions.map(tx => {
      const t = tx as Record<string, unknown>;
      return {
        transaction_id: typeof t.id === 'string' ? t.id : '',
        risk_taker_id: typeof t.risk_taker_id === 'string' ? t.risk_taker_id : '',
        syndicators: Array.isArray(t.syndicators) ? t.syndicators : [],
        total_principal_amount: typeof t.amount === 'number' ? t.amount : 0,
        total_interest: typeof t.interest === 'number' ? t.interest : 0,
        status: typeof t.status === 'string' ? t.status : 'pending',
        start_date: t.start_date as string || new Date().toISOString(),
        created_at: t.created_at as string || new Date().toISOString(),
        updated_at: t.updated_at as string || new Date().toISOString()
      };
    });
  }, [transactionsResponse]);
  
  const { 
    data: friendRequests, 
    isLoading: isFriendsLoading,
    isError: isFriendsError
  } = useGetFriendRequestsQuery();

  const stats = useMemo(() => {
    const totalPrincipal = portfolio?.total_principal_amount || 0;
    const totalInterestAmount = portfolio?.total_interest_amount || 0;
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
  }, [portfolio, friendRequests, transactions]);
  
  // Grid item style
  const gridItemSx = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    p: 2
  } as const;
  
  // Grid item component with proper typing
  const GridItem: React.FC<GridProps> = React.memo(({ children, ...props }) => (
    <Grid item component="div" {...props}>
      {children}
    </Grid>
  ));
  GridItem.displayName = 'GridItem';

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
        <GridItem sx={{ xs: 12, sm: 6, md: 3, ...gridItemSx }}>
          <StatsCard
            title="Total Invested"
            value={`₹${stats.totalPrincipal.toLocaleString()}`}
            icon={<SavingsIcon />}
            color="primary"
            loading={isPortfolioLoading}
          />
        </GridItem>
        
        <GridItem sx={{ xs: 12, sm: 6, md: 3, ...gridItemSx }}>
          <StatsCard
            title="Total Returns"
            value={`₹${stats.totalInterestAmount.toLocaleString()}`}
            icon={<TrendingUpIcon />}
            color="success"
            loading={isPortfolioLoading}
          />
        </GridItem>
        
        <GridItem sx={{ xs: 12, sm: 6, md: 3, ...gridItemSx }}>
          <StatsCard
            title="Active Transactions"
            value={stats.activeTransactions.toString()}
            icon={<AccountBalanceIcon />}
            color="info"
            loading={isPortfolioLoading || isTransactionsLoading}
          />
        </GridItem>
        
        <GridItem sx={{ xs: 12, sm: 6, md: 3, ...gridItemSx }}>
          <StatsCard
            title="Pending Requests"
            value={stats.pendingRequests.toString()}
            icon={<PeopleIcon />}
            color="warning"
            loading={isFriendsLoading}
          />
        </GridItem>
      </Grid>

      {(isPortfolioError || isFriendsError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {isPortfolioError ? 'Failed to load portfolio data. ' : ''}
          {isFriendsError ? 'Failed to load friend requests. ' : ''}
          Please try again later.
        </Alert>
      )}

      <Grid container spacing={3}>
        <GridItem sx={{ xs: 12, lg: 8, ...gridItemSx }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Recent Transactions
              </Typography>
              <RecentTransactions transactions={transactions} loading={isTransactionsLoading} />
            </CardContent>
          </Card>
        </GridItem>
        
        <GridItem sx={{ xs: 12, lg: 4, ...gridItemSx }}>
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
        <GridItem sx={{ xs: 12, lg: 4, ...gridItemSx }}>
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