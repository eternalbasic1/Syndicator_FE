import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import type { FriendRequestMetaData } from '../../types/friend.types';

interface FriendListProps {
  onFriendSelect?: (friend: FriendRequestMetaData) => void;
  friends: FriendRequestMetaData[];
}

const FriendsList: React.FC<FriendListProps> = ({ onFriendSelect, friends: initialFriends }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const friends = React.useMemo(() => {
    if (!initialFriends) return [];
    
    return initialFriends.filter(
      (friend: FriendRequestMetaData) => 
        (friend.requested_username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         friend.requested_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [initialFriends, searchTerm]);

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
        <Stack spacing={2}>
          {friends.map((friend) => (
            <Paper 
              key={friend.request_id}
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
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default FriendsList;