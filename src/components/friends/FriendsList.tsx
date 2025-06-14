// src/components/friends/FriendsList.tsx
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
import { useGetSyndicateQuery } from '../../store/api';
import LoadingSpinner from '../common/LoadingSpinner';

const FriendsList: React.FC = () => {
  const { data, isLoading } = useGetSyndicateQuery();

  if (isLoading) {
    return <LoadingSpinner message="Loading friends..." />;
  }

  if (!data?.friends?.length) {
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
        Friends ({data.friends.length})
      </Typography>
      
      <Grid container spacing={2}>
        {data.friends.map((friend) => (
          <Grid item xs={12} sm={6} md={4} key={friend.user_id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {friend.name?.charAt(0) || friend.username.charAt(0)}
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="subtitle1">
                      {friend.name || friend.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{friend.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {friend.email}
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