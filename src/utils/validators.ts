import { VALIDATION_MESSAGES } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: VALIDATION_MESSAGES.INVALID_EMAIL };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH };
  }
  
  return { isValid: true };
};

export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: VALIDATION_MESSAGES.USERNAME_MIN_LENGTH };
  }
  
  // Allow only alphanumeric characters and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  return { isValid: true };
};

export const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  if (!phoneNumber) {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check for Indian phone number format (10 digits or 12 digits with country code)
  if (cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'))) {
    return { isValid: true };
  }
  
  return { isValid: false, error: VALIDATION_MESSAGES.PHONE_INVALID };
};

export const validateAmount = (amount: string | number): ValidationResult => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: VALIDATION_MESSAGES.AMOUNT_POSITIVE };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string | number | null | undefined): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: VALIDATION_MESSAGES.REQUIRED_FIELD };
  }
  
  return { isValid: true };
};

export const validateTransactionData = (data: {
  totalPrincipalAmount: number;
  totalInterestAmount: number;
  syndicateDetails: Record<string, { principal_amount: number; interest: number }>;
}): ValidationResult => {
  const { totalPrincipalAmount, totalInterestAmount, syndicateDetails } = data;
  
  // Validate total amounts
  const principalValidation = validateAmount(totalPrincipalAmount);
  if (!principalValidation.isValid) {
    return { isValid: false, error: `Principal amount: ${principalValidation.error}` };
  }
  
  const interestValidation = validateAmount(totalInterestAmount);
  if (!interestValidation.isValid) {
    return { isValid: false, error: `Interest amount: ${interestValidation.error}` };
  }
  
  // Validate syndicate details if provided
  if (Object.keys(syndicateDetails).length > 0) {
    let totalSyndicatePrincipal = 0;
    
    for (const [username, details] of Object.entries(syndicateDetails)) {
      const principalAmount = details.principal_amount;
      const interest = details.interest;
      
      if (!principalAmount || principalAmount <= 0) {
        return { 
          isValid: false, 
          error: `Invalid principal amount for ${username}` 
        };
      }
      
      if (!interest || interest <= 0) {
        return { 
          isValid: false, 
          error: `Invalid interest amount for ${username}` 
        };
      }
      
      // Check if individual interest matches total interest
      if (Math.abs(interest - totalInterestAmount) > 0.01) {
        return {
          isValid: false,
          error: `Interest for ${username} must equal total interest amount`
        };
      }
      
      totalSyndicatePrincipal += principalAmount;
    }
    
    // Check if total matches syndicate sum
    if (Math.abs(totalPrincipalAmount - totalSyndicatePrincipal) > 0.01) {
      return {
        isValid: false,
        error: 'Total principal amount must equal sum of syndicate principal amounts'
      };
    }
  }
  
  return { isValid: true };
};

export const validateSyndicateAllocation = (
  totalAmount: number,
  allocations: Record<string, number>
): ValidationResult => {
  const totalAllocated = Object.values(allocations).reduce((sum, amount) => sum + amount, 0);
  
  if (Math.abs(totalAmount - totalAllocated) > 0.01) {
    return {
      isValid: false,
      error: `Total allocated (${totalAllocated}) must equal total amount (${totalAmount})`
    };
  }
  
  return { isValid: true };
};