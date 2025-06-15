import React, { useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import GridItem from '../components/common/GridItem';
import { useGetSyndicateViewQuery } from '../store/api/syndicateApi';
import SyndicateView from '../components/syndicate/SyndicateView';
import SyndicateDetails from '../components/syndicate/SyndicateDetails';
import type { SyndicateMember } from '../types/syndicate.types';

const SyndicatePage: React.FC = () => {
  const { data: apiData, isLoading, error } = useGetSyndicateViewQuery();
  const [selectedFriend, setSelectedFriend] = useState<SyndicateMember | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Convert API data to our type
  const syndicateData = apiData ? {
    friend_list_id: apiData.friend_list_id,
    user: {
      user_id: apiData.user.user_id,
      username: apiData.user.username,
    },
    friends: apiData.friends.map(friend => ({
      user_id: friend.user_id,
      username: friend.username,
      name: friend.name ?? undefined,
      email: friend.email,
    })),
    created_at: apiData.created_at,
  } : undefined;

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Syndicate Dashboard
        </Typography>
        <Alert severity="error">
          Failed to load syndicate data. Please try again later.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Syndicate Dashboard
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <GridItem xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </Box>
            </Paper>
          </GridItem>
        </Box>
      </Container>
    );
  }

  if (!syndicateData) {
    return null;
  }

  const handleFriendSelect = (friend: SyndicateMember) => {
    setSelectedFriend(friend);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedFriend(null);
    setShowDetails(false);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Syndicate Dashboard
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <GridItem xs={12}>
          <Paper sx={{ p: 3 }}>
            <SyndicateView
              syndicateData={syndicateData}
              onFriendSelect={handleFriendSelect}
            />
          </Paper>
        </GridItem>
      </Box>

      {selectedFriend && (
        <SyndicateDetails
          open={showDetails}
          onClose={handleCloseDetails}
          friend={selectedFriend}
          syndicateData={syndicateData}
        />
      )}
    </Container>
  );
};

export default SyndicatePage;