/* eslint-disable @typescript-eslint/no-unused-vars */
import { format } from "date-fns";

// Simple implementation of formatDistanceToNow
const formatDistanceToNow = (
  date: Date,
  options?: { addSuffix?: boolean }
): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return options?.addSuffix ? "just now" : "now";
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return options?.addSuffix
      ? `${minutes} minute${minutes > 1 ? "s" : ""} ago`
      : `${minutes}m`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return options?.addSuffix
      ? `${hours} hour${hours > 1 ? "s" : ""} ago`
      : `${hours}h`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  if (days < 7) {
    return options?.addSuffix
      ? `${days} day${days > 1 ? "s" : ""} ago`
      : `${days}d`;
  }
  return format(date, "MMM d, yyyy");
};

// Simple implementation of parseISO
const parseISO = (dateString: string): Date => {
  return new Date(dateString);
};

export const formatCurrency = (amount: number, currency = "₹"): string => {
  return `${currency}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};

export const formatDate = (
  dateString: string,
  formatString = "dd/MM/yyyy"
): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    return "Invalid Date";
  }
};

export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "dd/MM/yyyy HH:mm");
  } catch (error) {
    return "Invalid Date";
  }
};

export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return "Unknown time";
  }
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Basic phone number formatting for Indian numbers
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  return phoneNumber;
};

export const formatUserName = (name?: string, username?: string): string => {
  if (name && name.trim()) {
    return name;
  }
  return username || "Unknown User";
};

export const formatTransactionId = (transactionId: string): string => {
  // Show first 8 characters of UUID for readability
  return `TXN-${transactionId.slice(0, 8).toUpperCase()}`;
};

export const formatAmount = (amount: number): string => {
  if (amount >= 10000000) {
    // 1 crore
    return `₹${(amount / 10000000).toFixed(2)}Cr`;
  } else if (amount >= 100000) {
    // 1 lakh
    return `₹${(amount / 100000).toFixed(2)}L`;
  } else if (amount >= 1000) {
    // 1 thousand
    return `₹${(amount / 1000).toFixed(2)}K`;
  }
  return formatCurrency(amount);
};

export const formatInterestAmount = (
  principal: number,
  interestRate: number
): string => {
  const interestAmount = (principal * interestRate) / 100;
  return formatCurrency(interestAmount);
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

export const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map((word) => capitalize(word))
    .join(" ");
};
