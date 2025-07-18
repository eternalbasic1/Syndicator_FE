import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Tabs,
  Tab,
  Badge,
  Stack,
  CircularProgress,
  Alert,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Add as AddIcon, Person as PersonIcon } from "@mui/icons-material";
import { useGetFriendRequestsQuery } from "../store/api/friendApi";
import FriendsList from "../components/friends/FriendsList";
import FriendRequestCard from "../components/friends/FriendRequestCard";
import AddFriendDialog from "../components/friends/AddFriendDialog";
import type { FriendRequestMetaData } from "../types/friend.types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friends-tabpanel-${index}`}
      aria-labelledby={`friends-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const FriendsPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const { data, isLoading, error, refetch } = useGetFriendRequestsQuery();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const { friends, received, sent } = useMemo(() => {
    if (!data?.requests?.all) return { friends: [], received: [], sent: [] };
    const allRequests = data.requests.all;
    return {
      friends: allRequests.filter((req) => req.status === "accepted"),
      received: allRequests.filter(
        (req) => req.request_type === "received" && req.status === "pending"
      ),
      sent: allRequests.filter((req) => req.request_type === "sent"),
    };
  }, [data]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddFriendOpen = () => setAddFriendOpen(true);
  const handleAddFriendClose = () => setAddFriendOpen(false);
  const handleFriendRequestSent = () => {
    refetch();
    setAddFriendOpen(false);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{ py: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={{ xs: 2, sm: 3 }}
      >
        <Box>
          <Typography
            variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
            fontWeight="bold"
            sx={{ mb: { xs: 0.5, sm: 1 } }}
          >
            Friends
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          >
            Manage your network and connections.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddFriendOpen}
          size={isMobile ? "small" : "medium"}
          sx={{ fontWeight: 600 }}
        >
          Add Friend
        </Button>
      </Stack>

      <Paper
        elevation={3}
        sx={{
          borderRadius: "12px",
          border: "1px solid",
          borderColor: "divider",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="friends tabs"
          >
            <Tab label="All Friends" id="friends-tab-0" />
            <Tab label="Sent" id="friends-tab-1" />
            <Tab
              label={
                <Badge badgeContent={received.length} color="primary">
                  Pending
                </Badge>
              }
              id="friends-tab-2"
            />
          </Tabs>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={5}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">
              Failed to load data. Please try again.
            </Alert>
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                <FriendsList friends={friends} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <RequestList requests={sent} type="sent" onUpdate={refetch} />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <RequestList
                  requests={received}
                  type="received"
                  onUpdate={refetch}
                />
              </TabPanel>
            </>
          )}
        </Box>
      </Paper>

      <AddFriendDialog
        open={addFriendOpen}
        onClose={handleAddFriendClose}
        onSuccess={handleFriendRequestSent}
      />
    </Container>
  );
};

interface RequestListProps {
  requests: FriendRequestMetaData[];
  type: "sent" | "received";
  onUpdate: () => void;
}

const RequestList: React.FC<RequestListProps> = ({
  requests,
  type,
  onUpdate,
}) => {
  if (requests.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 4 },
          textAlign: "center",
          backgroundColor: "action.hover",
          borderRadius: "12px",
        }}
      >
        <PersonIcon
          color="disabled"
          sx={{ fontSize: { xs: 36, sm: 48 }, mb: 1 }}
        />
        <Typography variant="h6">No {type} requests</Typography>
        <Typography color="text.secondary">
          Your {type} requests list is empty.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {requests.map((req) => (
        <FriendRequestCard
          key={req.request_id}
          request={req}
          onUpdate={onUpdate}
        />
      ))}
    </Stack>
  );
};

export default FriendsPage;
