import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import Grid from '@mui/material/Grid';
import GridItem from '../../components/common/GridItem';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import type { Transaction, SplitwiseEntry } from '../../types/transaction.types';

interface SummaryCardsProps {
  transactions: Transaction[];
  loading?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ transactions, loading = false }) => {
  console.log("Hitting summary")

  if (loading) {
    return (
      <Box display="flex" gap={3}>
        {[1, 2, 3].map((i) => (
          <Paper key={i} sx={{ p: 3, flex: 1 }}>
            <Skeleton variant="rectangular" height={100} />
          </Paper>
        ))}
      </Box>
    );
  }

  const totalPrincipal = transactions.reduce<number>((sum, t) => {
    const userEntry = t.splitwise_entries?.find((entry: SplitwiseEntry) => entry.syndicator_id === t.risk_taker_id);
    if (userEntry) {
      sum += userEntry.principal_amount;
    }
    return sum;
  }, 0);

  const totalInterest = transactions.reduce<number>((sum, t) => {
    const userEntry = t.splitwise_entries?.find((entry: SplitwiseEntry) => entry.syndicator_id === t.risk_taker_id);
    if (userEntry) {
      const interest = (userEntry.principal_amount * t.total_interest) / 100;
      sum += interest;
    }
    return sum;
  }, 0);

  const activeSyndicates = transactions.length;

  const cards = [
    {
      title: 'Total Principal',
      value: `₹${totalPrincipal.toLocaleString()}`,
      description: 'Your invested amount',
      icon: <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />,
      color: 'primary',
    },
    {
      title: 'Total Interest',
      value: `₹${totalInterest.toLocaleString()}`,
      description: 'Your earned interest',
      icon: <TrendingUpIcon color="success" sx={{ mr: 1 }} />,
      color: 'success',
    },
    {
      title: 'Active Syndicates',
      value: activeSyndicates,
      description: 'Active investment groups',
      icon: <PeopleIcon color="info" sx={{ mr: 1 }} />,
      color: 'info',
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={3} mb={4} >
        {[1, 2, 3].map((item) => (
          <GridItem key={item} xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Skeleton variant="rectangular" width="60%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="80%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="50%" height={20} />
            </Paper>
          </GridItem>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} mb={4}>
      {cards.map((card, index) => (
        <GridItem key={index} xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' , minWidth: 350}}>
            <Box display="flex" alignItems="center" mb={2}>
              {card.icon}
              <Typography variant="h6" component="div">
                {card.title}
              </Typography>
            </Box>
            <Typography 
              variant="h4" 
              color={`${card.color}.main`} 
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              {card.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {card.description}
            </Typography>
          </Paper>
        </GridItem>
      ))}
    </Grid>
  );
};

export default SummaryCards;
