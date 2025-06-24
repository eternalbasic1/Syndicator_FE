import { useState, useEffect } from 'react';

type SetValue<T> = T | ((val: T) => T);

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value: SetValue<T>) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        if (valueToStore === null || valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Function to remove the value from localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this key in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// Specialized hooks for common use cases
export const useAuthToken = () => {
  return useLocalStorage<string | null>('jwt_token', null);
};

interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
}

export const useUserData = () => {
  return useLocalStorage<User | null>('user_data', null);
};

export const useThemePreference = () => {
  return useLocalStorage<'light' | 'dark'>('theme_preference', 'light');
};

export const useRecentSearches = () => {
  return useLocalStorage<string[]>('recent_searches', []);
};

export const useFavoriteTransactions = () => {
  return useLocalStorage<string[]>('favorite_transactions', []);
};

// Utility function to clear all app-related localStorage
export const clearAppLocalStorage = () => {
  if (typeof window === 'undefined') return;
  
  const keysToRemove = [
    'jwt_token',
    'user_data',
    'refresh_token',
    'recent_searches',
    'favorite_transactions',
  ];
  
  keysToRemove.forEach(key => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  });
};

export default useLocalStorage;