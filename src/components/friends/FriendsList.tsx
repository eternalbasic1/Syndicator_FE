// src/components/friends/FriendsList.tsx
//TODO: FIx Grid issue
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
} from '@mui/material';
import { Group } from '@mui/icons-material';
import { useGetSyndicateViewQuery } from '../../store/api/syndicateApi';
import LoadingSpinner from '../common/LoadingSpinner';

const FriendsList: React.FC = () => {
  const { data, isLoading } = useGetSyndicateViewQuery("sufgsu");

  if (isLoading) {
    return <LoadingSpinner message="Loading friends..." />;
  }

  if (!data?.transactions?.length) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={4}>
            <Group sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Friends Yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Send friend requests to start building your syndicate network.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Friends ({data.transactions.length})
      </Typography>
      
      <Grid container spacing={2}>
        {data.transactions.map((friend) => (
          <Grid item xs={12} sm={6} md={4} key={friend.risk_taker_id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {friend.risk_taker?.name?.charAt(0) || friend.risk_taker?.username.charAt(0)}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="subtitle1">
                      {friend.risk_taker?.name || friend.risk_taker?.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{friend.risk_taker?.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {friend.risk_taker?.email}
                    </Typography>
                  </Box>
                </Box>
                <Box mt={2}>
                  <Chip
                    label="Friend"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FriendsList;