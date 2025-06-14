import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
  Grid
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AccountBox as AccountBoxIcon,
} from '@mui/icons-material';

interface Friend {
  user_id: string;
  username: string;
  name?: string;
  email: string;
}

interface SyndicateData {
  friend_list_id: string;
  user: {
    user_id: string;
    username: string;
  };
  friends: Friend[];
  created_at: string;
}

interface SyndicateViewProps {
  syndicateData: SyndicateData;
  onFriendSelect?: (friend: Friend) => void;
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
        <Card>
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={4}
            >
              <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Friends in Syndicate
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Add friends to start building your syndicate network
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {friends.map((friend) => (
            <Grid item xs={12} sm={6} md={4} key={friend.user_id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: onFriendSelect ? 'pointer' : 'default',
                  '&:hover': {
                    transform: onFriendSelect ? 'translateY(-4px)' : 'none',
                    boxShadow: onFriendSelect ? 3 : 1,
                  },
                }}
                onClick={() => onFriendSelect?.(friend)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {getInitials(friend.name || friend.username)}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {friend.name || friend.username}
                      </Typography>
                      {friend.name && (
                        <Typography variant="body2" color="text.secondary" noWrap>
                          @{friend.username}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <AccountBoxIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      ID: {friend.user_id.slice(0, 8)}...
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {friend.email}
                    </Typography>
                  </Box>

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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SyndicateView;