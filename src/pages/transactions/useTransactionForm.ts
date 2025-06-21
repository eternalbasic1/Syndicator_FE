import { useState, useCallback } from 'react';
import type { TransactionFormData, SyndicateDetail } from '../../types/transaction.types';

export const useTransactionForm = (initialData?: Partial<TransactionFormData>) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    total_principal_amount: 0,
    total_interest_amount: 0,
    syndicate_details: {},
    ...initialData,
  });
  
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = useCallback((): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (formData.total_principal_amount <= 0) {
      newErrors.total_principal_amount = 'Total principal amount must be greater than 0';
    }

    if (formData.total_interest_amount < 0) {
      newErrors.total_interest_amount = 'Interest amount cannot be negative';
    }

    if (selectedFriends.length > 0) {
      const totalSyndicatePrincipal = Object.values(formData.syndicate_details)
        .reduce((sum, detail) => sum + (detail?.principal_amount || 0), 0);
      
      // const totalSyndicateInterest = Object.values(formData.syndicate_details)
      //   .reduce((sum, detail) => sum + (detail?.interest || 0), 0);
      
      if (Math.abs(totalSyndicatePrincipal - formData.total_principal_amount) > 0.01) {
        newErrors.syndicate_total = 'Sum of syndicate principal amounts must equal total principal amount';
      }

      // if (Math.abs(totalSyndicateInterest - formData.total_interest_amount) > 0.01) {
      //   newErrors.syndicate_interest_total = 'Sum of syndicate interest amounts must equal total interest amount';
      // }

      selectedFriends.forEach(friend => {
        if (!formData.syndicate_details[friend] || formData.syndicate_details[friend]?.principal_amount <= 0) {
          newErrors[`syndicate_${friend}_principal`] = 'Principal amount must be greater than 0';
        }
        if (!formData.syndicate_details[friend] || formData.syndicate_details[friend]?.interest < 0) {
          newErrors[`syndicate_${friend}_interest`] = 'Interest amount cannot be negative';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedFriends]);

  const resetForm = useCallback(() => {
    setFormData({
      total_principal_amount: 0,
      total_interest_amount: 0,
      syndicate_details: {},
      ...initialData,
    });
    setSelectedFriends([]);
    setErrors({});
  }, [initialData]);

  const updateFormData = useCallback((updates: Partial<TransactionFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
      syndicate_details: {
        ...prev.syndicate_details,
        ...(updates.syndicate_details || {}),
      },
    }));
  }, []);

  const updateSyndicateDetail = useCallback((username: string, updates: Partial<SyndicateDetail>) => {
    setFormData(prev => ({
      ...prev,
      syndicate_details: {
        ...prev.syndicate_details,
        [username]: {
          ...(prev.syndicate_details[username] || {}),
          ...updates,
        },
      },
    }));
  }, []);

  const handleInterestChange = useCallback((newInterest: number) => {
    setFormData(prev => {
      const updatedSyndicateDetails = { ...prev.syndicate_details };
      Object.keys(updatedSyndicateDetails).forEach(friendUsername => {
        updatedSyndicateDetails[friendUsername] = {
          ...updatedSyndicateDetails[friendUsername],
          interest: newInterest,
        };
      });
      
      return {
        ...prev,
        total_interest_amount: newInterest,
        syndicate_details: updatedSyndicateDetails,
      };
    });
  }, []);

  const handleFriendSelection = useCallback((selected: string[]) => {
    setSelectedFriends(selected);
    
    // Update syndicate_details when friends are selected/deselected
    const newSyndicateDetails: Record<string, SyndicateDetail> = {};
    selected.forEach(friendUsername => {
      newSyndicateDetails[friendUsername] = formData.syndicate_details[friendUsername] || {
        principal_amount: 0,
        interest: formData.total_interest_amount,
      };
    });
    
    setFormData(prev => ({
      ...prev,
      syndicate_details: newSyndicateDetails,
    }));
  }, [formData.total_interest_amount, formData.syndicate_details]);

  return {
    formData,
    setFormData,
    selectedFriends,
    setSelectedFriends,
    errors,
    setErrors,
    validateForm,
    resetForm,
    updateFormData,
    updateSyndicateDetail,
    handleInterestChange,
    handleFriendSelection,
  };
};
