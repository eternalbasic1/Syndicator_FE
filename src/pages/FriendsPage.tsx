import React from 'react';
import { Box, Container, Paper, Typography, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import FriendsList from '../components/friends/FriendsList';
import FriendRequests from '../components/friends/FriendRequests';
import GridItem from '../components/common/GridItem';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const FriendsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Friends
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your friends and connect with others
        </Typography>
      </Box>

      <GridItem xs={12}>
        <StyledPaper>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              mb: 3,
              '& .MuiTabs-flexContainer': {
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            <Tab label="My Friends" />
            <Tab label="Friend Requests" />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              <FriendsList />
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <FriendRequests />
            </Box>
          )}
        </StyledPaper>
      </GridItem>
    </Container>
  );
};

export default FriendsPage;