/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/transactions/CreateTransactionDialog.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  IconButton,
  Grid,
  Alert,
  Checkbox,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useCreateTransactionMutation } from "../../store/api/transactionApi";
import { useGetSyndicateViewQuery } from "../../store/api/syndicateApi";
import LoadingSpinner from "../common/LoadingSpinner";

interface CreateTransactionDialogProps {
  open: boolean;
  onClose: () => void;
}

interface SyndicateDetail {
  username: string;
  principal_amount: number;
  interest: number;
}

const CreateTransactionDialog: React.FC<CreateTransactionDialogProps> = ({
  open,
  onClose,
}) => {
  const [createTransaction, { isLoading: isCreating }] =
    useCreateTransactionMutation();
  const { data: syndicate } = useGetSyndicateViewQuery();

  const [totalPrincipal, setTotalPrincipal] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [isSyndicated, setIsSyndicated] = useState(false);
  const [riskTakerFlag, setRiskTakerFlag] = useState(false);
  const [riskTakerCommission, setRiskTakerCommission] = useState<number>(0);
  const [syndicateDetails, setSyndicateDetails] = useState<SyndicateDetail[]>(
    []
  );
  const [lenderName, setLenderName] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [monthPeriodOfLoan, setMonthPeriodOfLoan] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const handleReset = () => {
    setTotalPrincipal(0);
    setTotalInterest(0);
    setIsSyndicated(false);
    setRiskTakerFlag(false);
    setRiskTakerCommission(0);
    setSyndicateDetails([]);
    setLenderName("");
    setStartDate("");
    setEndDate("");
    setMonthPeriodOfLoan(0);
    setError("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const addSyndicateDetail = () => {
    setSyndicateDetails([
      ...syndicateDetails,
      { username: "", principal_amount: 0, interest: totalInterest },
    ]);
  };

  const removeSyndicateDetail = (index: number) => {
    setSyndicateDetails(syndicateDetails.filter((_, i) => i !== index));
  };

  const updateSyndicateDetail = (
    index: number,
    field: keyof SyndicateDetail,
    value: string | number
  ) => {
    const updated = [...syndicateDetails];
    updated[index] = { ...updated[index], [field]: value };
    setSyndicateDetails(updated);
  };

  const validateForm = (): boolean => {
    if (totalPrincipal <= 0) {
      setError("Total principal amount must be greater than 0");
      return false;
    }

    if (totalInterest <= 0) {
      setError("Total interest must be greater than 0");
      return false;
    }

    if (!lenderName) {
      setError("Lender name is required");
      return false;
    }
    if (!startDate) {
      setError("Start date is required");
      return false;
    }
    if (!endDate) {
      setError("End date is required");
      return false;
    }
    if (!monthPeriodOfLoan || monthPeriodOfLoan <= 0) {
      setError("Month period of loan must be greater than 0");
      return false;
    }

    // Validate risk taker commission
    if (riskTakerFlag) {
      if (riskTakerCommission < 0 || riskTakerCommission > 100) {
        setError("Commission must be between 0 and 100%");
        return false;
      }

      // Only allow commission if there are syndicate members
      if (syndicateDetails.length === 0) {
        setError(
          "Commission can only be applied when there are syndicate members"
        );
        return false;
      }
    }

    if (isSyndicated) {
      if (syndicateDetails.length === 0) {
        setError("Add at least one syndicate member");
        return false;
      }

      const totalSyndicatePrincipal = syndicateDetails.reduce(
        (sum, detail) => sum + detail.principal_amount,
        0
      );

      if (Math.abs(totalSyndicatePrincipal - totalPrincipal) > 0.01) {
        setError(
          "Sum of syndicate principal amounts must equal total principal"
        );
        return false;
      }

      for (const detail of syndicateDetails) {
        if (!detail.username) {
          setError("All syndicate members must have a username");
          return false;
        }
        if (detail.principal_amount <= 0) {
          setError("All principal amounts must be greater than 0");
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const payload: any = {
        total_principal_amount: totalPrincipal,
        total_interest_amount: totalInterest,
        risk_taker_flag: riskTakerFlag,
        risk_taker_commission: riskTakerCommission,
        lender_name: lenderName,
        start_date: startDate,
        end_date: endDate,
        month_period_of_loan: monthPeriodOfLoan,
      };

      if (isSyndicated && syndicateDetails.length > 0) {
        payload.syndicate_details = syndicateDetails.reduce((acc, detail) => {
          acc[detail.username] = {
            principal_amount: detail.principal_amount,
            interest: detail.interest,
          };
          return acc;
        }, {} as any);
      }

      await createTransaction(payload).unwrap();
      handleClose();
    } catch (err: any) {
      setError(err?.data?.error || "Failed to create transaction");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ pb: 1 }}>Create New Transaction</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoFocus
              label="Total Principal Amount"
              type="number"
              fullWidth
              variant="outlined"
              value={totalPrincipal || ""}
              onChange={(e) => setTotalPrincipal(Number(e.target.value))}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Interest Rate (%)"
              type="number"
              fullWidth
              variant="outlined"
              value={totalInterest || ""}
              onChange={(e) => {
                const newInterest = Number(e.target.value);
                setTotalInterest(newInterest);
                setSyndicateDetails((details) =>
                  details.map((detail) => ({
                    ...detail,
                    interest: newInterest,
                  }))
                );
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Lender Name"
              type="text"
              fullWidth
              variant="outlined"
              value={lenderName}
              onChange={(e) => setLenderName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Start Date"
              type="date"
              fullWidth
              variant="outlined"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="End Date"
              type="date"
              fullWidth
              variant="outlined"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Month Period of Loan"
              type="number"
              fullWidth
              variant="outlined"
              value={monthPeriodOfLoan || ""}
              onChange={(e) => setMonthPeriodOfLoan(Number(e.target.value))}
            />
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Switch
              checked={isSyndicated}
              onChange={(e) => setIsSyndicated(e.target.checked)}
            />
          }
          label="Syndicate this transaction"
          sx={{ mt: 1, mb: 1 }}
        />

        {isSyndicated && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Syndicate Details</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addSyndicateDetail}
                  size="small"
                >
                  Add Member
                </Button>
              </Box>

              {syndicate?.friends && syndicate.friends.length > 0 && (
                <Box mb={2}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Available Friends:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {syndicate.friends.map((friend) => (
                      <Chip
                        key={friend.user_id}
                        label={friend.username}
                        size="small"
                        onClick={() => {
                          if (
                            !syndicateDetails.find(
                              (d) => d.username === friend.username
                            )
                          ) {
                            setSyndicateDetails([
                              ...syndicateDetails,
                              {
                                username: friend.username,
                                principal_amount: 0,
                                interest: totalInterest,
                              },
                            ]);
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <Grid container spacing={2}>
                {syndicateDetails.map((detail, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Username"
                        value={detail.username}
                        onChange={(e) =>
                          updateSyndicateDetail(
                            index,
                            "username",
                            e.target.value
                          )
                        }
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Principal"
                        type="number"
                        value={detail.principal_amount}
                        onChange={(e) =>
                          updateSyndicateDetail(
                            index,
                            "principal_amount",
                            Number(e.target.value)
                          )
                        }
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <Typography sx={{ mr: 1 }}>₹</Typography>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Interest"
                        type="number"
                        value={detail.interest}
                        onChange={(e) =>
                          updateSyndicateDetail(
                            index,
                            "interest",
                            Number(e.target.value)
                          )
                        }
                        fullWidth
                        size="small"
                        InputProps={{
                          endAdornment: <Typography>%</Typography>,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <IconButton
                        onClick={() => removeSyndicateDetail(index)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>

              {syndicateDetails.length > 0 && (
                <Box mt={2}>
                  <Typography variant="body1" fontWeight="500" mb={2}>
                    Total Syndicate Principal: ₹
                    {syndicateDetails
                      .reduce((sum, detail) => sum + detail.principal_amount, 0)
                      .toLocaleString()}
                  </Typography>

                  {/* Risk Taker Commission Section */}
                  <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                      Risk Taker Commission
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={riskTakerFlag}
                              onChange={(e) =>
                                setRiskTakerFlag(e.target.checked)
                              }
                              disabled={syndicateDetails.length === 0}
                            />
                          }
                          label="Apply Risk Taker Commission"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Commission Rate (%)"
                          type="number"
                          value={riskTakerCommission}
                          onChange={(e) =>
                            setRiskTakerCommission(Number(e.target.value))
                          }
                          disabled={
                            !riskTakerFlag || syndicateDetails.length === 0
                          }
                          InputProps={{
                            endAdornment: <Typography>%</Typography>,
                            inputProps: { min: 0, max: 100 },
                          }}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isCreating}
        >
          {isCreating ? <LoadingSpinner size={20} /> : "Create Transaction"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTransactionDialog;
