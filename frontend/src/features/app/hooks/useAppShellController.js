import { useCallback, useEffect, useState } from 'react';
import { useInitializeAuthSession } from '../auth/AuthContext.jsx';
import { useAppViewState } from './useAppViewState.js';
import { useAuthSession } from './useAuthSession.js';
import { useI18n, useInitializeLanguage } from '../i18n/LanguageContext.jsx';

export function useAppShellController() {
  useInitializeLanguage();
  useInitializeAuthSession();

  const { language, setLanguage, t } = useI18n();
  const viewState = useAppViewState();
  const [refreshKey, setRefreshKey] = useState(0);
  const [flashMessage, setFlashMessage] = useState('');
  const [showDocs, setShowDocs] = useState(false);
  const { currentUser, sessionExpiredVersion, setCurrentUser, logout } =
    useAuthSession();

  useEffect(() => {
    if (sessionExpiredVersion > 0) {
      viewState.handleSessionExpired();
    }
  }, [sessionExpiredVersion, viewState.handleSessionExpired]);

  useEffect(() => {
    if (!flashMessage) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setFlashMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [flashMessage]);

  const showSuccessMessage = useCallback((message) => {
    setFlashMessage(message);
  }, []);

  const refreshReports = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
  }, []);

  const handleReportCreated = useCallback(() => {
    refreshReports();
    viewState.resetAfterSubmit();
    showSuccessMessage(t('flash.theftSaved'));
  }, [refreshReports, showSuccessMessage, t, viewState.resetAfterSubmit]);

  const handleSightingCreated = useCallback(() => {
    refreshReports();
    viewState.resetAfterSubmit();
    showSuccessMessage(t('flash.sightingSaved'));
  }, [refreshReports, showSuccessMessage, t, viewState.resetAfterSubmit]);

  const handleReportUpdated = useCallback(() => {
    refreshReports();
    showSuccessMessage(t('flash.theftUpdated'));
  }, [refreshReports, showSuccessMessage, t]);

  const handleReportDeleted = useCallback(() => {
    refreshReports();
    viewState.clearSelectedReport();
    showSuccessMessage(t('flash.theftDeleted'));
  }, [refreshReports, showSuccessMessage, t, viewState.clearSelectedReport]);

  const handleShowReportOnMap = useCallback(
    (location) => {
      if (!location) {
        return;
      }

      viewState.selectLocation(location);
    },
    [viewState.selectLocation]
  );

  const handleLoginSuccess = useCallback(
    (user) => {
      setCurrentUser(user);
      viewState.closeLogin();
      showSuccessMessage(t('flash.loginSuccess'));
    },
    [setCurrentUser, showSuccessMessage, t, viewState.closeLogin]
  );

  const handleRegisterSuccess = useCallback(
    (user) => {
      setCurrentUser(user);
      viewState.closeRegister();
      showSuccessMessage(t('flash.loginSuccess'));
    },
    [setCurrentUser, showSuccessMessage, t, viewState.closeRegister]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    viewState.openBaseMenu();
    showSuccessMessage(t('flash.logoutSuccess'));
  }, [logout, showSuccessMessage, t, viewState.openBaseMenu]);

  return {
    language,
    setLanguage,
    t,
    viewState,
    refreshKey,
    flashMessage,
    showDocs,
    setShowDocs,
    currentUser,
    handleReportCreated,
    handleSightingCreated,
    handleReportUpdated,
    handleReportDeleted,
    handleShowReportOnMap,
    handleLoginSuccess,
    handleRegisterSuccess,
    handleLogout,
    isMapLocked:
      viewState.showLogin ||
      viewState.showRegister ||
      (viewState.isMenuOpen && !viewState.isPickingLocation),
    isMapDimmed: viewState.isMenuOpen && !viewState.isPickingLocation,
    authDialogMode: viewState.showRegister ? 'register' : 'login'
  };
}
