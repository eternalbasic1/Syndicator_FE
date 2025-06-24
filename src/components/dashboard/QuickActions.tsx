import React from 'react';
import { Button, Stack, Paper, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { Link as RouterLink } from 'react-router-dom';

const QuickActions: React.FC = () => {
  return (
    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 4, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Quick Actions
      </Typography>
      <Stack spacing={2}>
        <Button
          component={RouterLink}
          to="/transactions/new"
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          sx={{ py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
        >
          New Transaction
        </Button>
        <Button
          component={RouterLink}
          to="/friends/add"
          variant="outlined"
          startIcon={<GroupAddIcon />}
          fullWidth
          sx={{ py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
        >
          Add Friend
        </Button>
        <Button
          component={RouterLink}
          to="/requests"
          variant="outlined"
          startIcon={<RequestQuoteIcon />}
          fullWidth
          sx={{ py: 1.5, textTransform: 'none', fontWeight: 'bold' }}
        >
          View Requests
        </Button>
      </Stack>
    </Paper>
  );
};

export default QuickActions;
