import { useMemo } from "react";
import type { FunctionComponent } from "react";
import {
  Box,
  Typography,
  Alert,
  Grid,
  Container,
  Paper,
  Stack,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Savings as SavingsIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  MonetizationOn as MonetizationOnIcon,
} from "@mui/icons-material";

import QuickActions from "../components/dashboard/QuickActions";
import GridItem from "../components/common/GridItem";
import { useAuth } from "../hooks/useAuth";
import { useGetAllTransactionsQuery } from "../store/api/transactionApi";
import { useGetFriendRequestsQuery } from "../store/api/friendApi";
import type { Transaction, SplitwiseEntry } from "../types/transaction.types";
import StatsCard from "../components/dashboard/StatsCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import QuickStats from "../components/dashboard/QuickStats";

const DashboardPage: FunctionComponent = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: transactionsResponse, isLoading: isTransactionsLoading } =
    useGetAllTransactionsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    });

  const {
    data: friendRequests,
    isLoading: isFriendsLoading,
    isError: isFriendsError,
  } = useGetFriendRequestsQuery();

  const transactions = useMemo<Transaction[]>(() => {
    if (!transactionsResponse) return [];

    let rawTransactions: unknown[] = [];
    if (Array.isArray(transactionsResponse)) {
      rawTransactions = transactionsResponse;
    } else if (
      transactionsResponse &&
      typeof transactionsResponse === "object" &&
      "transactions" in transactionsResponse
    ) {
      const resp = transactionsResponse as { transactions: unknown };
      rawTransactions = Array.isArray(resp.transactions)
        ? resp.transactions
        : [];
    }

    return rawTransactions.map((tx: unknown) => {
      const recordTx = tx as Record<string, unknown>;
      const amount = typeof recordTx.amount === "number" ? recordTx.amount : 0;
      const interest =
        typeof recordTx.interest === "number" ? recordTx.interest : 0;

      return {
        transaction_id: typeof recordTx.id === "string" ? recordTx.id : "",
        risk_taker_id:
          typeof recordTx.risk_taker_id === "string"
            ? recordTx.risk_taker_id
            : "",
        risk_taker_username:
          typeof recordTx.risk_taker_username === "string"
            ? recordTx.risk_taker_username
            : "",
        risk_taker_name:
          typeof recordTx.risk_taker_name === "string"
            ? recordTx.risk_taker_name
            : null,
        syndicators: Array.isArray(recordTx.syndicators)
          ? recordTx.syndicators
          : [],
        total_principal_amount: amount,
        total_interest: interest,
        created_at: (recordTx.created_at as string) || new Date().toISOString(),
        start_date: (recordTx.start_date as string) || new Date().toISOString(),
        splitwise_entries: Array.isArray(recordTx.splitwise_entries)
          ? recordTx.splitwise_entries
          : [],
      } as Transaction;
    });
  }, [transactionsResponse]);

  console.log("transactions VALUE", transactions);
  const totalCommissionEarned = Array.isArray(
    transactionsResponse?.transactions
  )
    ? transactionsResponse.transactions.reduce<number>((sum, tx) => {
        const userEntry = tx.splitwise_entries?.find(
          (entry: SplitwiseEntry) => entry.syndicator_id === tx.risk_taker_id
        );
        if (userEntry?.syndicator_id === user?.user_id) {
          return sum + (tx.total_commission_earned || 0);
        }
        return sum; // Return current sum, not 0
      }, 0)
    : 0;

  const stats = useMemo(() => {
    const userEntries = transactions.flatMap((tx) =>
      tx.splitwise_entries.filter(
        (entry) => entry.syndicator_username === user?.username
      )
    );

    const totalPrincipal = userEntries.reduce(
      (sum: number, entry: SplitwiseEntry) => sum + entry.principal_amount,
      0
    );

    const totalInterestAmount = transactions.reduce<number>((sum, t) => {
      const userEntry = t.splitwise_entries?.find(
        (entry: SplitwiseEntry) => entry.syndicator_id === user?.user_id
      );
      if (userEntry) {
        sum += userEntry.interest_after_commission || 0;
      }
      return sum;
    }, 0);

    const pendingRequestsCount =
      friendRequests?.requests?.received?.filter(
        (req: { status: string }) => req.status === "pending"
      ).length || 0;

    const totalreturns = totalInterestAmount + totalCommissionEarned;

    return {
      totalPrincipal,
      totalreturns,
      totalCommissionEarned,
      pendingRequests: pendingRequestsCount,
      totalPortfolioValue: totalPrincipal + totalInterestAmount,
      returnRate:
        totalPrincipal > 0 ? (totalInterestAmount / totalPrincipal) * 100 : 0,
      activeTransactions: transactions.length,
    };
  }, [friendRequests, transactions, user, totalCommissionEarned]);

  console.log("stats", stats);

  if (isTransactionsLoading || isFriendsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.default,
        minHeight: "100vh",
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Header */}
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              fontWeight="bold"
              sx={{ mb: { xs: 0.5, sm: 1 } }}
            >
              Dashboard
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Welcome back, {user?.name || user?.username}! Here's your
              financial overview.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <GridItem xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Invested"
                value={`₹${stats.totalPrincipal.toLocaleString()}`}
                icon={<SavingsIcon />}
                color="primary"
                loading={isTransactionsLoading}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Returns"
                value={`₹${stats.totalreturns.toLocaleString()}`}
                icon={<TrendingUpIcon />}
                color="success"
                loading={isTransactionsLoading}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Commission"
                value={`₹${stats.totalCommissionEarned.toLocaleString()}`}
                icon={<MonetizationOnIcon />}
                color="warning"
                loading={isTransactionsLoading}
              />
            </GridItem>
            <GridItem xs={12} sm={6} md={3}>
              <StatsCard
                title="Active Syndications"
                value={stats.activeTransactions.toString()}
                icon={<AccountBalanceIcon />}
                color="info"
                loading={isTransactionsLoading}
              />
            </GridItem>
          </Grid>

          {isFriendsError && (
            <Alert
              severity="error"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Failed to load friend requests. Please try again later.
            </Alert>
          )}

          {/* Main Content */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Recent Transactions */}
            <GridItem xs={12} lg={7}>
              <Paper
                elevation={3}
                sx={{
                  p: { xs: 2, sm: 3 },
                  height: "100%",
                  borderRadius: "12px",
                  boxShadow:
                    "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                }}
              >
                <RecentTransactions transactions={transactions} />
              </Paper>
            </GridItem>

            {/* Quick Actions & Stats */}
            <GridItem xs={12} lg={5}>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <QuickActions />
                <QuickStats
                  activeTransactions={stats.activeTransactions}
                  pendingRequests={stats.pendingRequests}
                />
              </Stack>
            </GridItem>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default DashboardPage;
