import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
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

  // Extract accepted friends from the friend requests
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

  if (friends.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <PersonIcon color="action" sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
        <Typography variant="h6" gutterBottom>
          No friends yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your friend list is empty. Start by sending friend requests!
        </Typography>
      </Paper>
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

      <Paper variant="outlined">
        <List disablePadding>
          {friends.map((friend, index) => (
            <React.Fragment key={friend.request_id}>
              <ListItem 
                component="div"
                onClick={() => onFriendSelect?.(friend)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    '& .MuiIconButton-root': {
                      visibility: 'visible',
                    },
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 48,
                      height: 48,
                      fontSize: '1.25rem',
                    }}
                  >
                    {friend.requested_name?.[0]?.toUpperCase() || 
                     friend.requested_username?.[0]?.toUpperCase() || 
                     <PersonIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" component="div">
                      {friend.requested_name || friend.requested_username}
                      {friend.requested_name && friend.requested_name !== friend.requested_username && (
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          @{friend.requested_username}
                        </Typography>
                      )}
                    </Typography>
                  }
                  secondary={
                    <Chip
                      label="Friend"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  }
                />
                <IconButton edge="end" size="small">
                  <MoreVertIcon />
                </IconButton>
              </ListItem>
              {index < friends.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default FriendsList;