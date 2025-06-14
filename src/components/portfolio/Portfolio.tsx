import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Percent as PercentIcon,
} from '@mui/icons-material';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface PortfolioSummary {
  total_principal_amount: number;
  total_interest_amount: number;
  total_value: number;
  roi_percentage: number;
  active_transactions: number;
  monthly_earnings: number;
}

interface PortfolioProps {
  summary: PortfolioSummary;
  isLoading?: boolean;
}

const Portfolio: React.FC<PortfolioProps> = ({ summary, isLoading = false }) => {
  const {
    total_principal_amount,
    total_interest_amount,
    total_value,
    roi_percentage,
    active_transactions,
    monthly_earnings,
  } = summary;

  const stats = [
    {
      title: 'Total Principal',
      value: formatCurrency(total_principal_amount),
      icon: <AccountBalanceIcon />,
      color: 'primary',
      description: 'Total amount invested',
    },
    {
      title: 'Total Interest Earned',
      value: formatCurrency(total_interest_amount),
      icon: <TrendingUpIcon />,
      color: 'success',
      description: 'Interest earned to date',
    },
    {
      title: 'Portfolio Value',
      value: formatCurrency(total_value),
      icon: <AccountBalanceIcon />,
      color: 'info',
      description: 'Principal + Interest',
    },
    {
      title: 'ROI',
      value: formatPercentage(roi_percentage),
      icon: <PercentIcon />,
      color: roi_percentage >= 0 ? 'success' : 'error',
      description: 'Return on Investment',
    },
  ];

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Portfolio Overview
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item}>
              <Card>
                <CardContent>
                  <LinearProgress />
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" component="div">
                      Loading...
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Portfolio Overview
        </Typography>
        <Chip
          label={`${active_transactions} Active Transactions`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Grid container spacing={3} mb={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    sx={{
                      bgcolor: `${stat.color}.main`,
                      mr: 2,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Performance
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Average Monthly Earnings
                </Typography>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  {formatCurrency(monthly_earnings)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Growth Rate
                </Typography>
                <Chip
                  label={`+${formatPercentage(roi_percentage)}`}
                  color={roi_percentage >= 0 ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Health
              </Typography>
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    Risk Distribution
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {active_transactions} transactions
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((active_transactions / 10) * 100, 100)}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">
                    Interest Coverage
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPercentage((total_interest_amount / total_principal_amount) * 100)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((total_interest_amount / total_principal_amount) * 100, 100)}
                  color="info"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Portfolio;