// src/components/dashboard/Dashboard.tsx
// TODO: Come back later, Grid Issue
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  Group,
  Assessment,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useGetPortfolioQuery,
  useGetAllTransactionsQuery,
} from "../../store/api/transactionApi";
import { useGetSyndicateViewQuery } from "../../store/api/syndicateApi";
import LoadingSpinner from "../common/LoadingSpinner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: portfolio, isLoading: portfolioLoading } =
    useGetPortfolioQuery();
  const { data: transactions, isLoading: transactionsLoading } =
    useGetAllTransactionsQuery();
  const { data: syndicate, isLoading: syndicateLoading } =
    useGetSyndicateViewQuery();

  if (portfolioLoading || transactionsLoading || syndicateLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const stats = [
    {
      title: "Total Portfolio Value",
      value: `₹${portfolio?.total_principal_amount?.toLocaleString() || 0}`,
      icon: <AccountBalance />,
      color: "#1976d2",
      onClick: () => navigate("/portfolio"),
    },
    {
      title: "Expected Interest",
      value: `₹${
        portfolio?.total_interest_after_commission?.toLocaleString() || 0
      }`,
      icon: <TrendingUp />,
      color: "#2e7d32",
      onClick: () => navigate("/portfolio"),
    },
    {
      title: "Active Transactions",
      value: transactions?.transaction_counts?.total || 0,
      icon: <Assessment />,
      color: "#ed6c02",
      onClick: () => navigate("/transactions"),
    },
    {
      title: "Syndicate Members",
      value: syndicate?.friends?.length || 0,
      icon: <Group />,
      color: "#9c27b0",
      onClick: () => navigate("/syndicate"),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
              onClick={stat.onClick}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      backgroundColor: stat.color,
                      color: "white",
                      borderRadius: "50%",
                      width: 48,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="contained"
                  onClick={() => navigate("/transactions/create")}
                  fullWidth
                >
                  Create New Transaction
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/friends")}
                  fullWidth
                >
                  Manage Friends
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {transactions?.transactions
                ?.slice(0, 3)
                .map((transaction: any) => (
                  <Box key={transaction.transaction_id} mb={2}>
                    <Typography variant="body2">
                      Transaction: ₹
                      {transaction.total_principal_amount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                )) || (
                <Typography variant="body2" color="text.secondary">
                  No recent transactions
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
