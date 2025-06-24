import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import GridItem from '../common/GridItem';
import { Email as EmailIcon } from '@mui/icons-material';
import type { SyndicateMember } from '../../types/syndicate.types';

interface SyndicateViewProps {
  syndicateData: {
    friend_list_id: string;
    user: {
      user_id: string;
      username: string;
    };
    friends: SyndicateMember[];
    created_at: string;
  };
  onFriendSelect?: (friend: SyndicateMember) => void;
}

const SyndicateView: React.FC<SyndicateViewProps> = ({
  syndicateData,
  onFriendSelect,
}) => {
  const { user, friends, created_at } = syndicateData;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box>
      {/* Header Section */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                width: 56,
                height: 56,
              }}
            >
              {getInitials(user.username)}
            </Avatar>
            <Box>
              <Typography variant="h5" color="white" fontWeight="bold">
                {user.username}'s Syndicate
              </Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
                Created on {formatDate(created_at)}
              </Typography>
              <Chip
                label={`${friends.length} Friends`}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Friends Grid */}
      {friends.length === 0 ? (
        <Box>
          <Typography variant="h6" color="text.secondary" textAlign="center" py={4}>
            No friends in your syndicate yet
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" mb={2}>
            Friends in Syndicate
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {friends.map((friend) => (
              <GridItem key={friend.user_id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    cursor: onFriendSelect ? 'pointer' : 'default',
                    '&:hover': {
                      transform: onFriendSelect ? 'translateY(-2px)' : 'none',
                      boxShadow: onFriendSelect ? 3 : 1,
                    },
                  }}
                  onClick={() => onFriendSelect?.(friend)}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      mb: 1,
                      width: 64,
                      height: 64,
                    }}
                  >
                    {getInitials(friend.username)}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {friend.name || friend.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    @{friend.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    <EmailIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                    {friend.email}
                  </Typography>
                  {onFriendSelect && (
                    <Box mt={2}>
                      <Chip
                        label="Select for Transaction"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  )}
                </Card>
              </GridItem>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SyndicateView;