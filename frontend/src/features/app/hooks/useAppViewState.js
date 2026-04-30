import { useMemo } from 'react';
import { create } from 'zustand';

const PANEL = {
  BASE: 'base',
  FORM: 'form',
  LOGIN: 'login',
  REGISTER: 'register',
  DETAILS: 'details',
  SIGHTING: 'sighting',
  MY_REPORTS: 'my_reports'
};

const initialState = {
  isMenuOpen: false,
  activePanel: PANEL.BASE,
  selectedLocation: null,
  isPickingLocation: false,
  selectedReportId: null,
  focusedMyReportId: null
};

const useAppViewStore = create((set) => ({
  ...initialState,
  toggleMenu: () => {
    set((state) => ({ isMenuOpen: !state.isMenuOpen }));
  },
  openBaseMenu: () => {
    set({
      isMenuOpen: false,
      activePanel: PANEL.BASE,
      isPickingLocation: false,
      selectedReportId: null,
      selectedLocation: null,
      focusedMyReportId: null
    });
  },
  openForm: () => {
    set({
      isMenuOpen: true,
      activePanel: PANEL.FORM,
      selectedReportId: null,
      focusedMyReportId: null
    });
  },
  closeForm: () => {
    set({
      activePanel: PANEL.BASE,
      isPickingLocation: false,
      selectedLocation: null
    });
  },
  openLogin: () => {
    set({
      isMenuOpen: false,
      activePanel: PANEL.LOGIN,
      selectedReportId: null,
      isPickingLocation: false,
      focusedMyReportId: null
    });
  },
  closeLogin: () => {
    set({
      isMenuOpen: false,
      activePanel: PANEL.BASE
    });
  },
  openRegister: () => {
    set({
      isMenuOpen: false,
      activePanel: PANEL.REGISTER,
      selectedReportId: null,
      isPickingLocation: false,
      focusedMyReportId: null
    });
  },
  backToLogin: () => {
    set({
      isMenuOpen: false,
      activePanel: PANEL.LOGIN,
      selectedReportId: null,
      isPickingLocation: false,
      focusedMyReportId: null
    });
  },
  closeRegister: () => {
    set({
      isMenuOpen: false,
      activePanel: PANEL.BASE
    });
  },
  showReportDetails: (reportId) => {
    set({
      isMenuOpen: true,
      activePanel: PANEL.DETAILS,
      selectedReportId: reportId,
      isPickingLocation: false,
      focusedMyReportId: null
    });
  },
  clearSelectedReport: () => {
    set({
      activePanel: PANEL.BASE,
      selectedReportId: null,
      focusedMyReportId: null
    });
  },
  clearSelectedLocation: () => {
    set({
      selectedLocation: null,
      isPickingLocation: false
    });
  },
  openSighting: (reportId) => {
    set({
      isMenuOpen: true,
      activePanel: PANEL.SIGHTING,
      selectedReportId: reportId,
      isPickingLocation: false,
      focusedMyReportId: null
    });
  },
  openMyReports: (reportId = null) => {
    set({
      isMenuOpen: true,
      activePanel: PANEL.MY_REPORTS,
      selectedReportId: null,
      isPickingLocation: false,
      selectedLocation: null,
      focusedMyReportId: reportId
    });
  },
  closeSighting: () => {
    set((state) => ({
      activePanel: state.selectedReportId ? PANEL.DETAILS : PANEL.BASE,
      isPickingLocation: false,
      selectedLocation: null
    }));
  },
  startMapPicking: () => {
    set({ isPickingLocation: true });
  },
  stopMapPicking: () => {
    set({ isPickingLocation: false });
  },
  selectLocation: (location) => {
    set({
      selectedLocation: location,
      isPickingLocation: false
    });
  },
  resetAfterSubmit: () => {
    set({
      isMenuOpen: false,
      activePanel: PANEL.BASE,
      isPickingLocation: false,
      selectedLocation: null,
      focusedMyReportId: null
    });
  },
  handleSessionExpired: () => {
    set({
      isMenuOpen: false,
      activePanel: PANEL.LOGIN,
      isPickingLocation: false,
      selectedReportId: null,
      focusedMyReportId: null
    });
  }
}));

export function useAppViewState() {
  const state = useAppViewStore();

  return useMemo(
    () => ({
      ...state,
      showForm: state.activePanel === PANEL.FORM,
      showLogin: state.activePanel === PANEL.LOGIN,
      showRegister: state.activePanel === PANEL.REGISTER,
      showDetails: state.activePanel === PANEL.DETAILS,
      showSighting: state.activePanel === PANEL.SIGHTING,
      showMyReports: state.activePanel === PANEL.MY_REPORTS
    }),
    [state]
  );
}
