import React, { useState } from 'react';
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
  Fab,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useGetFriendRequestsQuery } from '../../store/api/friendApi';
import FriendRequestCard from './FriendRequestCard';
import AddFriendDialog from './AddFriendDialog';
import type { FriendRequest } from '../../types/friend.types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const FriendRequests: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const { 
    data: friendRequestsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetFriendRequestsQuery();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Failed to load friend requests. Please try again.
        <Button onClick={handleRefresh} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  const { requests, status_summary } = friendRequestsData || {
    requests: { all: [], sent: [], received: [] },
    status_summary: { pending: 0, accepted: 0, rejected: 0, canceled: 0 }
  };

  const pendingReceived = requests.received?.filter((req: FriendRequest) => req.status === 'pending') || [];
  const pendingSent = requests.sent?.filter((req: FriendRequest) => req.status === 'pending') || [];

  return (
    <Box>
      <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1" gutterBottom>
          Friend Requests
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          variant="outlined"
          size="small"
        >
          Refresh
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={
              <Badge badgeContent={pendingReceived.length} color="primary">
                Received
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={pendingSent.length} color="secondary">
                Sent
              </Badge>
            }
          />
          <Tab label="All Requests" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {requests.received?.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                No friend requests received
              </Typography>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Pending Requests ({pendingReceived.length})
                </Typography>
                {pendingReceived.map((request: FriendRequest) => (
                  <FriendRequestCard
                    key={request.request_id}
                    request={request}
                    currentUserId={friendRequestsData?.user_id || ''}
                    onUpdate={refetch}
                  />
                ))}

                {requests.received.filter((req: FriendRequest) => req.status !== 'pending').length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Other Requests
                    </Typography>
                    {requests.received
                      .filter((req: FriendRequest) => req.status !== 'pending')
                      .map((request: FriendRequest) => (
                        <FriendRequestCard
                          key={request.request_id}
                          request={request}
                          currentUserId={friendRequestsData?.user_id || ''}
                          onUpdate={refetch}
                        />
                      ))}
                  </>
                )}
              </>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            {requests.sent?.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                No friend requests sent
              </Typography>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Pending Requests ({pendingSent.length})
                </Typography>
                {pendingSent.map((request: FriendRequest) => (
                  <FriendRequestCard
                    key={request.request_id}
                    request={request}
                    currentUserId={friendRequestsData?.user_id || ''}
                    onUpdate={refetch}
                  />
                ))}

                {requests.sent.filter((req: FriendRequest) => req.status !== 'pending').length > 0 && (
                  <>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                      Other Requests
                    </Typography>
                    {requests.sent
                      .filter((req: FriendRequest) => req.status !== 'pending')
                      .map((request: FriendRequest) => (
                        <FriendRequestCard
                          key={request.request_id}
                          request={request}
                          currentUserId={friendRequestsData?.user_id || ''}
                          onUpdate={refetch}
                        />
                      ))}
                  </>
                )}
              </>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ p: 3 }}>
            {requests.all?.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                No friend requests found
              </Typography>
            ) : (
              <>
                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    All Requests ({requests.all?.length || 0})
                  </Typography>
                  <Box display="flex" gap={2}>
                    <Typography variant="body2" color="success.main">
                      Accepted: {status_summary.accepted}
                    </Typography>
                    <Typography variant="body2" color="warning.main">
                      Pending: {status_summary.pending}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      Rejected: {status_summary.rejected}
                    </Typography>
                  </Box>
                </Box>
                {requests.all?.map((request: FriendRequest) => (
                  <FriendRequestCard
                    key={request.request_id}
                    request={request}
                    currentUserId={friendRequestsData?.user_id || ''}
                    onUpdate={refetch}
                  />
                ))}
              </>
            )}
          </Box>
        </TabPanel>
      </Paper>

      <Fab
        color="primary"
        aria-label="add friend"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setAddFriendOpen(true)}
      >
        <AddIcon />
      </Fab>

      <AddFriendDialog
        open={addFriendOpen}
        onClose={() => setAddFriendOpen(false)}
        onSuccess={refetch}
      />
    </Box>
  );
};

export default FriendRequests;