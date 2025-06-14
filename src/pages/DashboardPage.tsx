import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  People,
  Savings,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useGetPortfolioQuery } from '../store/api/transactionApi';
import { useGetFriendRequestsQuery } from '../store/api/friendApi';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: portfolio, isLoading: portfolioLoading, error: portfolioError } = useGetPortfolioQuery();
  const { data: friendRequests, isLoading: friendsLoading } = useGetFriendRequestsQuery();

  const totalInvested = portfolio?.reduce((sum, transaction) => sum + transaction.total_principal_amount, 0) || 0;
  const totalInterest = portfolio?.reduce((sum, transaction) => sum + transaction.total_interest, 0) || 0;
  const pendingRequests = friendRequests?.filter(req => req.status === 'pending').length || 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.username}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Invested"
            value={₹${totalInvested.toLocaleString()}}
            icon={<Savings />}
            color="primary"
            loading={portfolioLoading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Returns"
            value={₹${totalInterest.toLocaleString()}}
            icon={<TrendingUp />}
            color="success"
            loading={portfolioLoading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Transactions"
            value={portfolio?.length || 0}
            icon={<AccountBalance />}
            color="info"
            loading={portfolioLoading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Requests"
            value={pendingRequests}
            icon={<People />}
            color="warning"
            loading={friendsLoading}
          />
        </Grid>
      </Grid>

      {portfolioError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load portfolio data. Please try again.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <RecentTransactions 
                transactions={portfolio || []} 
                loading={portfolioLoading} 
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Stats
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Portfolio Value
                </Typography>
                <Typography variant="h5" color="primary">
                  ₹{(totalInvested + totalInterest).toLocaleString()}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Return Rate
                </Typography>
                <Typography variant="h5" color="success.main">
                  {totalInvested > 0 ? ((totalInterest / totalInvested) * 100).toFixed(2) : 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;