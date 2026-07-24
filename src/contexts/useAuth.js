// Separate file for useAuth hook to satisfy React fast-refresh rules.
// (fast-refresh requires files to only export components OR hooks, not both)
import { useContext } from 'react';
import { AuthContext } from './AuthContext.jsx';

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
