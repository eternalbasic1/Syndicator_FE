import React from 'react';
import { Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';

const QuickActions: React.FC = () => {
  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        href="/transactions/new"
      >
        New Transaction
      </Button>
      <Button
        variant="outlined"
        startIcon={<GroupAddIcon />}
        fullWidth
        href="/friends/add"
      >
        Add Friend
      </Button>
      <Button
        variant="outlined"
        startIcon={<RequestQuoteIcon />}
        fullWidth
        href="/requests"
      >
        View Requests
      </Button>
    </Stack>
  );
};

export default QuickActions;
