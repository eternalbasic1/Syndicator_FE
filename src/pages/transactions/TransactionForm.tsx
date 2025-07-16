import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import GridItem from "../../components/common/GridItem";
import type {
  TransactionFormData,
  SyndicateDetail,
} from "../../types/transaction.types";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  loading: boolean;
  friends: Array<{ username: string; name: string }>;
  errors: { [key: string]: string };
  formData: TransactionFormData;
  setFormData: React.Dispatch<React.SetStateAction<TransactionFormData>>;
  selectedFriends: string[];
  handleFriendSelection: (selected: string[]) => void;
  handleRiskTakerFlagChange: (flag: boolean) => void;
  handleRiskTakerCommissionChange: (commission: number) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
  friends,
  errors,
  formData,
  setFormData,
  selectedFriends,
  handleFriendSelection: handleFriendSelectionProp,
  handleRiskTakerFlagChange,
  handleRiskTakerCommissionChange,
}) => {
  const handleFriendSelection = (
    event:
      | React.ChangeEvent<{ value: unknown }>
      | (Event & { target: { value: string[]; name: string } })
  ) => {
    const value = Array.isArray(event.target.value)
      ? event.target.value
      : [event.target.value];
    handleFriendSelectionProp(value);
    console.log("HITTING TRANSACTION FORM");
    // Update syndicate_details when friends are selected/deselected
    const newSyndicateDetails: Record<string, SyndicateDetail> = {};
    value.forEach((friendUsername) => {
      if (friendUsername) {
        // Ensure friendUsername is not undefined
        newSyndicateDetails[friendUsername] = formData.syndicate_details[
          friendUsername
        ] || {
          principal_amount: 0,
          interest: formData.total_interest_amount,
        };
      }
    });

    setFormData((prev) => ({
      ...prev,
      syndicate_details: newSyndicateDetails,
    }));
  };

  const handlePrincipalAmountChange = (
    friendUsername: string,
    amount: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      syndicate_details: {
        ...prev.syndicate_details,
        [friendUsername]: {
          ...prev.syndicate_details[friendUsername],
          principal_amount: amount,
        },
      },
    }));
  };

  const handleSyndicateInterestChange = (
    friendUsername: string,
    interest: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      syndicate_details: {
        ...prev.syndicate_details,
        [friendUsername]: {
          ...prev.syndicate_details[friendUsername],
          interest: interest,
        },
      },
    }));
  };

  const handleInterestChange = (newInterest: number) => {
    setFormData((prev) => {
      const updatedSyndicateDetails = { ...prev.syndicate_details };
      Object.keys(updatedSyndicateDetails).forEach((friendUsername) => {
        updatedSyndicateDetails[friendUsername].interest = newInterest;
      });

      return {
        ...prev,
        total_interest_amount: newInterest,
        syndicate_details: updatedSyndicateDetails,
      };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Transaction</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <GridItem xs={12} md={6}>
              <TextField
                fullWidth
                label="Total Principal Amount"
                type="number"
                value={formData.total_principal_amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    total_principal_amount: Number(e.target.value),
                  }))
                }
                error={!!errors.total_principal_amount}
                helperText={errors.total_principal_amount}
                InputProps={{ startAdornment: "₹" }}
              />
            </GridItem>
            <GridItem xs={12} md={6}>
              <TextField
                fullWidth
                label="Interest Rate (%)"
                type="number"
                value={formData.total_interest_amount}
                onChange={(e) => handleInterestChange(Number(e.target.value))}
                error={!!errors.total_interest_amount}
                helperText={errors.total_interest_amount}
                InputProps={{ endAdornment: "%" }}
              />
            </GridItem>
            <GridItem xs={12} md={6}>
              <TextField
                fullWidth
                label="Lender Name"
                type="text"
                value={formData.lender_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    lender_name: e.target.value,
                  }))
                }
                error={!!errors.lender_name}
                helperText={errors.lender_name}
              />
            </GridItem>
            <GridItem xs={12} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    start_date: e.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                error={!!errors.start_date}
                helperText={errors.start_date}
              />
            </GridItem>
            <GridItem xs={12} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    end_date: e.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
                error={!!errors.end_date}
                helperText={errors.end_date}
              />
            </GridItem>
            <GridItem xs={12} md={6}>
              <TextField
                fullWidth
                label="Month Period of Loan"
                type="number"
                value={formData.month_period_of_loan}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    month_period_of_loan: Number(e.target.value),
                  }))
                }
                error={!!errors.month_period_of_loan}
                helperText={errors.month_period_of_loan}
              />
            </GridItem>
            <GridItem xs={12}>
              <FormControl fullWidth>
                <InputLabel>Select Syndicators (Optional)</InputLabel>
                <Select
                  multiple
                  value={selectedFriends}
                  onChange={handleFriendSelection}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {friends.map((friend) => (
                    <MenuItem key={friend.username} value={friend.username}>
                      {friend.name || friend.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </GridItem>

            {/* Risk Taker Commission Section */}
            {selectedFriends.length > 0 && (
              <GridItem xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Risk Taker Commission
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <GridItem xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.risk_taker_flag}
                          onChange={(e) =>
                            handleRiskTakerFlagChange(e.target.checked)
                          }
                          disabled={selectedFriends.length === 0}
                        />
                      }
                      label="Apply Risk Taker Commission"
                    />
                  </GridItem>
                  <GridItem xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Commission Rate (%)"
                      type="number"
                      value={formData.risk_taker_commission}
                      onChange={(e) =>
                        handleRiskTakerCommissionChange(Number(e.target.value))
                      }
                      disabled={
                        !formData.risk_taker_flag ||
                        selectedFriends.length === 0
                      }
                      error={!!errors.risk_taker_commission}
                      helperText={
                        errors.risk_taker_commission || "Maximum 100%"
                      }
                      InputProps={{
                        endAdornment: "%",
                        inputProps: { min: 0, max: 100 },
                      }}
                    />
                  </GridItem>
                </Grid>
              </GridItem>
            )}

            {selectedFriends.length > 0 && (
              <GridItem xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Syndicate Details
                </Typography>
                {errors.syndicate_total && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.syndicate_total}
                  </Alert>
                )}
                {errors.syndicate_interest_total && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.syndicate_interest_total}
                  </Alert>
                )}
                <Grid container spacing={2}>
                  {selectedFriends.map((friendUsername) => (
                    <GridItem xs={12} md={6} key={friendUsername}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {friendUsername}
                          </Typography>
                          <Grid container spacing={2}>
                            <GridItem item xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Principal Amount"
                                type="number"
                                value={
                                  formData.syndicate_details[friendUsername]
                                    ?.principal_amount || 0
                                }
                                onChange={(e) =>
                                  handlePrincipalAmountChange(
                                    friendUsername,
                                    Number(e.target.value)
                                  )
                                }
                                error={
                                  !!errors[
                                    `syndicate_${friendUsername}_principal`
                                  ]
                                }
                                helperText={
                                  errors[
                                    `syndicate_${friendUsername}_principal`
                                  ]
                                }
                                InputProps={{ startAdornment: "₹" }}
                              />
                            </GridItem>
                            <GridItem xs={12} md={6}>
                              <TextField
                                fullWidth
                                label="Interest Amount"
                                type="number"
                                value={
                                  formData.syndicate_details[friendUsername]
                                    ?.interest || 0
                                }
                                onChange={(e) =>
                                  handleSyndicateInterestChange(
                                    friendUsername,
                                    Number(e.target.value)
                                  )
                                }
                                error={
                                  !!errors[
                                    `syndicate_${friendUsername}_interest`
                                  ]
                                }
                                helperText={
                                  errors[
                                    `syndicate_${friendUsername}_interest`
                                  ] || " "
                                }
                                InputProps={{ endAdornment: "%" }}
                              />
                            </GridItem>
                          </Grid>
                        </CardContent>
                      </Card>
                    </GridItem>
                  ))}
                </Grid>
              </GridItem>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(formData)}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Create Transaction
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;
