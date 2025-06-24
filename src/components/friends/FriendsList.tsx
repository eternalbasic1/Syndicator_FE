import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PersonIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useGetFriendRequestsQuery } from '../../store/api/friendApi';
import type { FriendRequestMetaData } from '../../types/friend.types';

interface FriendListProps {
  onFriendSelect?: (friend: FriendRequestMetaData) => void;
}

const FriendsList: React.FC<FriendListProps> = ({ onFriendSelect }) => {
  const { data, isLoading, error } = useGetFriendRequestsQuery();
  const [searchTerm, setSearchTerm] = React.useState('');

  const friends = React.useMemo(() => {
    if (!data?.requests?.all) return [];
    
    return data.requests.all.filter(
      (request: FriendRequestMetaData) => 
        request.status === 'accepted' &&
        (request.requested_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         request.requested_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load friends. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search friends..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      {friends.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
          <PersonIcon color="action" sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
          <Typography variant="h6" gutterBottom>
            No friends yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your friend list is empty. Start by sending friend requests!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {friends.map((friend) => (
            <Grid item xs={12} sm={6} md={4} key={friend.request_id}>
              <Paper 
                variant="outlined" 
                sx={{
                  p: 2, 
                  borderRadius: '12px', 
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s, border-color 0.3s',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    borderColor: 'primary.light'
                  }
                }}
                onClick={() => onFriendSelect?.(friend)}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                    {friend.requested_name?.[0]?.toUpperCase() || friend.requested_username?.[0]?.toUpperCase() || <PersonIcon />}
                  </Avatar>
                  <Box flexGrow={1}>
                    <Typography variant="subtitle1" fontWeight="600" lineHeight={1.2}>
                      {friend.requested_name || friend.requested_username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      @{friend.requested_username}
                    </Typography>
                  </Box>
                  <IconButton size="small" sx={{ alignSelf: 'center' }}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default FriendsList;