import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, logoutUser } from '../../api/authApi.js';
import {
  clearSessionExpiredHandler,
  setSessionExpiredHandler
} from './sessionExpiryBridge.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionExpiredVersion, setSessionExpiredVersion] = useState(0);

  useEffect(() => {
    let active = true;

    getCurrentUser()
      .then((user) => {
        if (active) {
          setCurrentUser(user);
        }
      })
      .catch(() => {
        if (active) {
          setCurrentUser(null);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function handleSessionExpired() {
      setCurrentUser(null);
      setSessionExpiredVersion((current) => current + 1);
    }

    setSessionExpiredHandler(handleSessionExpired);

    return () => {
      clearSessionExpiredHandler(handleSessionExpired);
    };
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      sessionExpiredVersion,
      setCurrentUser,
      async logout() {
        try {
          await logoutUser();
        } catch (error) {
          console.error('Uloskirjautuminen epäonnistui:', error);
        } finally {
          setCurrentUser(null);
        }
      }
    }),
    [currentUser, sessionExpiredVersion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
