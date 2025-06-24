import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Stack,
  Badge,
  Grid
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useGetFriendRequestsQuery } from '../../store/api/friendApi';
import FriendRequestCard from './FriendRequestCard';
import AddFriendDialog from './AddFriendDialog';

const FriendRequests: React.FC = () => {
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const { data, isLoading, error, refetch } = useGetFriendRequestsQuery();

  const { received, sent } = useMemo(() => {
    if (!data?.requests) return { received: [], sent: [] };
    const allRequests = data.requests.all || [];
    return {
      received: allRequests.filter(req => req.request_type === 'received' && req.status === 'pending'),
      sent: allRequests.filter(req => req.request_type === 'sent'),
    };
  }, [data]);

  const handleRefresh = () => refetch();
  const handleAddFriendOpen = () => setAddFriendOpen(true);
  const handleAddFriendClose = () => setAddFriendOpen(false);
  const handleFriendRequestSent = () => {
    refetch();
    setAddFriendOpen(false);
  };

  if (isLoading) {
    return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Alert severity="error" action={<Button onClick={handleRefresh} color="inherit" size="small">Retry</Button>}>
        Failed to load friend requests.
      </Alert>
    );
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">Manage Requests</Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddFriendOpen}>
            Add Friend
          </Button>
          <Button variant="outlined" onClick={handleRefresh} startIcon={<RefreshIcon />}>
            Refresh
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            <Badge badgeContent={received.length} color="primary" sx={{ mr: 2 }}>
              Received Requests
            </Badge>
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', backgroundColor: 'grey.50' }}>
            {received.length > 0 ? (
              <Stack spacing={2}>
                {received.map(req => <FriendRequestCard key={req.request_id} request={req} onUpdate={refetch} />)}
              </Stack>
            ) : (
              <Typography color="text.secondary" textAlign="center" p={3}>No pending requests.</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Sent Requests</Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', backgroundColor: 'grey.50' }}>
            {sent.length > 0 ? (
              <Stack spacing={2}>
                {sent.map(req => <FriendRequestCard key={req.request_id} request={req} onUpdate={refetch} />)}
              </Stack>
            ) : (
              <Typography color="text.secondary" textAlign="center" p={3}>No sent requests.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <AddFriendDialog
        open={addFriendOpen}
        onClose={handleAddFriendClose}
        onSuccess={handleFriendRequestSent}
      />
    </Box>
  );
};

export default FriendRequests;