
// src/hooks/useAuth.ts
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);
  
  return {
    user,
    token,
    isAuthenticated,
  };
};