import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { getCurrentUser, logoutUser } from '../../api/authApi.js';
import { setSessionExpiredHandler } from './sessionExpiryBridge.js';

const useAuthStore = create((set) => ({
  currentUser: null,
  sessionExpiredVersion: 0,
  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
  markSessionExpired: () => {
    set((state) => ({
      currentUser: null,
      sessionExpiredVersion: state.sessionExpiredVersion + 1
    }));
  },
  hydrateCurrentUser: async () => {
    try {
      const user = await getCurrentUser();
      set({ currentUser: user });
    } catch {
      set({ currentUser: null });
    }
  },
  logout: async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Uloskirjautuminen epÃ¤onnistui:', error);
    } finally {
      set({ currentUser: null });
    }
  }
}));

export function useInitializeAuthSession() {
  useEffect(() => {
    useAuthStore.getState().hydrateCurrentUser();

    setSessionExpiredHandler(() => {
      useAuthStore.getState().markSessionExpired();
    });
  }, []);
}

export function useAuth() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const sessionExpiredVersion = useAuthStore(
    (state) => state.sessionExpiredVersion
  );
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const logout = useAuthStore((state) => state.logout);

  return useMemo(
    () => ({
      currentUser,
      sessionExpiredVersion,
      setCurrentUser,
      logout
    }),
    [currentUser, sessionExpiredVersion, setCurrentUser, logout]
  );
}
