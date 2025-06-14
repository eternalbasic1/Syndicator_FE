/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
  LinearProgress,
  useTheme,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Percent,
  Timeline,
  Group,
} from '@mui/icons-material';

interface Transaction {
  transaction_id: string;
  risk_taker_id: string;
  syndicators: Array<{
    user_id: string;
    username: string;
  }>;
  total_principal_amount: number;
  total_interest: number;
  created_at: string;
  start_date: string;
}

interface PortfolioStatsProps {
  transactions: Transaction[];
  totalPrincipal: number;
  totalInterest: number;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle, 
  trend 
}) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              color: 'white',
              mr: 2,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        
        {subtitle && (
          <Typography variant="caption" color="text.secondary" display="block">
            {subtitle}
          </Typography>
        )}
        
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend.isPositive ? (
              <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} fontSize="small" />
            ) : (
              <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} fontSize="small" />
            )}
            <Typography
              variant="caption"
              sx={{
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 'medium',
              }}
            >
              {Math.abs(trend.value)}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const PortfolioStats: React.FC<PortfolioStatsProps> = ({ 
  transactions, 
  totalPrincipal, 
  totalInterest, 
  loading = false 
}) => {
  const theme = useTheme();

  // Calculate additional statistics
  const stats = React.useMemo(() => {
    if (transactions.length === 0) {
      return {
        totalTransactions: 0,
        averageTransaction: 0,
        totalSyndicators: 0,
        averageInterestRate: 0,
        maxTransaction: 0,
        minTransaction: 0,
        recentTransactions: 0,
      };
    }

    const amounts = transactions.map(t => t.total_principal_amount);
    const totalSyndicators = transactions.reduce((sum, t) => sum + t.syndicators.length, 0);
    const averageInterestRate = transactions.reduce((sum, t) => sum + t.total_interest, 0) / transactions.length;
    
    // Recent transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTransactions = transactions.filter(
      t => new Date(t.created_at) >= thirtyDaysAgo
    ).length;

    return {
      totalTransactions: transactions.length,
      averageTransaction: Math.round(totalPrincipal / transactions.length),
      totalSyndicators,
      averageInterestRate: Math.round(averageInterestRate * 100) / 100,
      maxTransaction: Math.max(...amounts),
      minTransaction: Math.min(...amounts),
      recentTransactions,
    };
  }, [transactions, totalPrincipal]);

  const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LinearProgress sx={{ width: '100%' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Total Principal"
          value={formatCurrency(totalPrincipal)}
          icon={<AccountBalance />}
          color="primary"
          subtitle="Total amount invested"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Total Interest"
          value={formatCurrency(totalInterest)}
          icon={<Percent />}
          color="secondary"
          subtitle="Expected returns"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions}
          icon={<Timeline />}
          color="success"
          subtitle="All time transactions"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Average Transaction"
          value={formatCurrency(stats.averageTransaction)}
          icon={<TrendingUp />}
          color="warning"
          subtitle="Per transaction average"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Total Syndicators"
          value={stats.totalSyndicators}
          icon={<Group />}
          color="error"
          subtitle="Across all transactions"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <StatCard
          title="Avg Interest Rate"
          value={`${stats.averageInterestRate}%`}
          icon={<Percent />}
          color="primary"
          subtitle="Average return rate"
        />
      </Grid>

      {/* Summary Cards */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Portfolio Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {formatCurrency(stats.maxTransaction)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Largest Transaction
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="secondary.main" fontWeight="bold">
                    {formatCurrency(stats.minTransaction)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Smallest Transaction
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {stats.recentTransactions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Recent (30 days)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {Math.round(((totalPrincipal + totalInterest) / totalPrincipal - 1) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total ROI
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Quick Insights */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Insights
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {stats.recentTransactions > 0 && (
                <Chip
                  label={`${stats.recentTransactions} transactions this month`}
                  color="success"
                  variant="outlined"
                />
              )}
              {stats.averageInterestRate > 15 && (
                <Chip
                  label="High interest rate portfolio"
                  color="warning"
                  variant="outlined"
                />
              )}
              {stats.totalSyndicators > stats.totalTransactions * 2 && (
                <Chip
                  label="Well-syndicated portfolio"
                  color="primary"
                  variant="outlined"
                />
              )}
              {totalPrincipal > 1000000 && (
                <Chip
                  label="High-value portfolio"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default PortfolioStats;