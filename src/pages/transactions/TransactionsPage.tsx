import React, { useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Stack,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import TransactionForm from "./TransactionForm";
import TransactionDetails from "./TransactionDetails";
import TransactionsList from "./TransactionsList";
import SummaryCards from "./SummaryCards";
import { useTransactions } from "./useTransactions";
import { useTransactionForm } from "./useTransactionForm";
import type { Transaction } from "../../types/transaction.types";

const TransactionsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const {
    transactions,
    friends,
    isLoading,
    isCreating,
    transactionsError,
    createTransaction: createTransactionApi,
  } = useTransactions();
  const {
    formData,
    setFormData,
    selectedFriends,
    setSelectedFriends,
    errors,
    validateForm,
    resetForm,
    handleRiskTakerFlagChange,
    handleRiskTakerCommissionChange,
  } = useTransactionForm();

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };
  const handleViewTransaction = (transaction: Transaction) =>
    setSelectedTransaction(transaction);
  const handleCloseDetails = () => setSelectedTransaction(null);
  const handleSubmitTransaction = async (data: typeof formData) => {
    if (!validateForm()) return;
    const result = await createTransactionApi(data);
    if (result.success) handleCloseForm();
  };

  return (
    <Container
      maxWidth={isDesktop ? "xl" : "md"}
      sx={{
        py: { xs: 2, sm: 4 },
        overflowX: "hidden",
        minHeight: "100vh",
      }}
    >
      {/* Header & Actions */}
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Grid item xs={8} md={6}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight={700}
            mb={{ xs: 1, md: 0 }}
          >
            Transactions
          </Typography>
        </Grid>
        <Grid item xs={8} md={6}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent={{ md: "flex-end" }}
          >
            <Tooltip title="Refresh data">
              <IconButton
                color="primary"
                onClick={() => window.location.reload()}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<FilterIcon />}
              disabled={isLoading}
              sx={{ minWidth: 110 }}
            >
              {isMobile ? "Filter" : "Filter & Sort"}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
              size={isMobile ? "medium" : "large"}
              disabled={isLoading}
              sx={{ minWidth: 110 }}
            >
              {isMobile ? "New" : "New Transaction"}
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Box mb={3}>
        <SummaryCards transactions={transactions} loading={isLoading} />
      </Box>

      {/* Search & Table */}
      <Paper
        elevation={1}
        sx={{
          p: { xs: 1, sm: 2 },
          borderRadius: 3,
          mb: 3,
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Grid container alignItems="center" spacing={2} mb={2}>
          <Grid item xs={8} sm={6} md={8}>
            <Box
              display="flex"
              alignItems="center"
              sx={{
                backgroundColor: "background.paper",
                borderRadius: 2,
                px: 2,
                py: 1,
                border: "1px solid",
                borderColor: "divider",
                width: "100%",
              }}
            >
              <SearchIcon color="action" fontSize="small" />
              <input
                type="text"
                placeholder="Search transactions..."
                style={{
                  marginLeft: 8,
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "0.95rem",
                  background: "transparent",
                  width: "100%",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={8} sm={6} md={4}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
            >
              <Button
                variant="contained"
                onClick={handleOpenForm}
                startIcon={<AddIcon />}
                size="small"
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Add Transaction
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <TransactionsList
            transactions={transactions}
            onViewTransaction={handleViewTransaction}
            loading={isLoading}
            error={
              typeof transactionsError === "string"
                ? transactionsError
                : transactionsError
                ? "Failed to load transactions."
                : undefined
            }
          />
        </Box>
      </Paper>

      {/* Transaction Form Dialog */}
      <TransactionForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTransaction}
        loading={isCreating}
        friends={
          Array.isArray(friends)
            ? friends.map(({ username, name }) => ({
                username,
                name: name || "",
              }))
            : []
        }
        errors={errors}
        formData={formData}
        setFormData={setFormData}
        selectedFriends={selectedFriends}
        handleFriendSelection={setSelectedFriends}
        handleRiskTakerFlagChange={handleRiskTakerFlagChange}
        handleRiskTakerCommissionChange={handleRiskTakerCommissionChange}
      />

      {/* Transaction Details Dialog */}
      <TransactionDetails
        open={!!selectedTransaction}
        transaction={selectedTransaction}
        onClose={handleCloseDetails}
      />
    </Container>
  );
};

export default TransactionsPage;
