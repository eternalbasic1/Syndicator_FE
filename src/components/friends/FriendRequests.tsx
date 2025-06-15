import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  Badge,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useGetFriendRequestsQuery } from '../../store/api/friendApi';
import FriendRequestCard from './FriendRequestCard';
import AddFriendDialog from './AddFriendDialog';
import type { FriendRequestMetaData } from '../../types/friend.types';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friend-requests-tabpanel-${index}`}
      aria-labelledby={`friend-requests-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => ({
  id: `friend-requests-tab-${index}`,
  'aria-controls': `friend-requests-tabpanel-${index}`,
});

const FriendRequests: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  
  const { 
    data: friendRequestsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetFriendRequestsQuery();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleAddFriendOpen = () => {
    setAddFriendOpen(true);
  };

  const handleAddFriendClose = () => {
    setAddFriendOpen(false);
  };

  const handleFriendRequestSent = () => {
    refetch();
    setAddFriendOpen(false);
  };

  // Process friend requests data
  const { received, sent, all } = useMemo(() => {
    // Handle case where friendRequestsData might be undefined
    if (!friendRequestsData) {
      return { received: [], sent: [], all: [] };
    }
    
    // Handle both array and object response formats
    if (Array.isArray(friendRequestsData)) {
      return {
        received: friendRequestsData.filter(req => req.request_type === 'received'),
        sent: friendRequestsData.filter(req => req.request_type === 'sent'),
        all: friendRequestsData,
      };
    }
    
    // Handle object response format with requests property
    const data = friendRequestsData.requests || { received: [], sent: [], all: [] };
    return {
      received: (data.received || []) as FriendRequestMetaData[],
      sent: (data.sent || []) as FriendRequestMetaData[],
      all: (data.all || []) as FriendRequestMetaData[],
    };
  }, [friendRequestsData]);

  const pendingReceived = useMemo(
    () => received.filter(req => req.status === 'pending'),
    [received]
  );

  const pendingSent = useMemo(
    () => sent.filter(req => req.status === 'pending'),
    [sent]
  );

  const otherReceived = useMemo(
    () => received.filter(req => req.status !== 'pending'),
    [received]
  );

  const otherSent = useMemo(
    () => sent.filter(req => req.status !== 'pending'),
    [sent]
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          mb: 2,
          '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          },
        }}
      >
        Failed to load friend requests.
        <Button 
          onClick={handleRefresh} 
          size="small" 
          color="inherit"
          sx={{ ml: 1 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 0 }}>
          Friend Requests
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            variant="outlined"
            size={isMobile ? 'small' : 'medium'}
            sx={{ minWidth: 'auto' }}
          >
            {!isMobile && 'Refresh'}
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddFriendOpen}
            variant="contained"
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            sx={{ minWidth: 'auto' }}
          >
            {!isMobile && 'Add Friend'}
          </Button>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="friend request tabs"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTabs-scroller': {
              overflow: 'auto !important',
            },
          }}
        >
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <span>Received</span>
                {pendingReceived.length > 0 && (
                  <Badge 
                    badgeContent={pendingReceived.length} 
                    color="primary"
                    sx={{ '& .MuiBadge-badge': { top: 0 } }}
                  />
                )}
              </Box>
            }
            {...a11yProps(0)}
          />
          <Tab
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <span>Sent</span>
                {pendingSent.length > 0 && (
                  <Badge 
                    badgeContent={pendingSent.length} 
                    color="secondary"
                    sx={{ '& .MuiBadge-badge': { top: 0 } }}
                  />
                )}
              </Box>
            }
            {...a11yProps(1)}
          />
          <Tab 
            label="All Requests" 
            {...a11yProps(2)}
          />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {received.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No friend requests received yet
              </Typography>
              <Button 
                onClick={handleRefresh} 
                variant="outlined" 
                size="small"
                sx={{ mt: 1 }}
              >
                Refresh
              </Button>
            </Box>
          ) : (
            <Box>
              {pendingReceived.length > 0 && (
                <Box mb={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Pending Requests • {pendingReceived.length}
                  </Typography>
                  <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    {pendingReceived.map((request) => (
                      <FriendRequestCard
                        key={request.request_id}
                        request={request}
                        currentUserId={request.user_id}
                        onUpdate={refetch}
                      />
                    ))}
                  </Paper>
                </Box>
              )}

              {otherReceived.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Previous Requests • {otherReceived.length}
                  </Typography>
                  <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    {otherReceived.map((request) => (
                      <FriendRequestCard
                        key={request.request_id}
                        request={request}
                        currentUserId={request.user_id}
                        onUpdate={refetch}
                      />
                    ))}
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {sent.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No friend requests sent yet
              </Typography>
              <Button 
                onClick={handleAddFriendOpen}
                variant="contained" 
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}
              >
                Add Friend
              </Button>
            </Box>
          ) : (
            <Box>
              {pendingSent.length > 0 && (
                <Box mb={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Pending Approval • {pendingSent.length}
                  </Typography>
                  <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    {pendingSent.map((request) => (
                      <FriendRequestCard
                        key={request.request_id}
                        request={request}
                        currentUserId={request.user_id}
                        onUpdate={refetch}
                      />
                    ))}
                  </Paper>
                </Box>
              )}

              {otherSent.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Previous Requests • {otherSent.length}
                  </Typography>
                  <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    {otherSent.map((request) => (
                      <FriendRequestCard
                        key={request.request_id}
                        request={request}
                        currentUserId={request.user_id}
                        onUpdate={refetch}
                      />
                    ))}
                  </Paper>
                </Box>
              )}
            </Box>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {all.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                No friend requests found
              </Typography>
              <Button 
                onClick={handleAddFriendOpen}
                variant="contained" 
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                sx={{ mt: 1 }}
              >
                Add Friend
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
                All Requests • {all.length}
              </Typography>
              <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                {all.map((request, idx) => (
                  <React.Fragment key={request.request_id}>
                    <FriendRequestCard
                      request={request}
                      currentUserId={request.user_id}
                      onUpdate={refetch}
                    />
                    {idx < all.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </Paper>
            </Box>
          )}
        </TabPanel>
      </Paper>
      
      <AddFriendDialog
        open={addFriendOpen}
        onClose={handleAddFriendClose}
        onSuccess={handleFriendRequestSent}
      />
    </Box>
  );
};

export default FriendRequests;