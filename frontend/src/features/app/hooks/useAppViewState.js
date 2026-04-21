import { useCallback, useMemo, useReducer } from 'react';

const PANEL = {
  BASE: 'base',
  FORM: 'form',
  LOGIN: 'login',
  REGISTER: 'register',
  DETAILS: 'details',
  SIGHTING: 'sighting',
  MY_REPORTS: 'my_reports'
};

const ACTION = {
  TOGGLE_MENU: 'toggle_menu',
  CLOSE_MENU: 'close_menu',
  OPEN_FORM: 'open_form',
  CLOSE_FORM: 'close_form',
  OPEN_LOGIN: 'open_login',
  CLOSE_LOGIN: 'close_login',
  OPEN_REGISTER: 'open_register',
  CLOSE_REGISTER: 'close_register',
  SHOW_DETAILS: 'show_details',
  CLEAR_DETAILS: 'clear_details',
  CLEAR_LOCATION: 'clear_location',
  OPEN_SIGHTING: 'open_sighting',
  CLOSE_SIGHTING: 'close_sighting',
  START_MAP_PICKING: 'start_map_picking',
  STOP_MAP_PICKING: 'stop_map_picking',
  SELECT_LOCATION: 'select_location',
  RESET_AFTER_SUBMIT: 'reset_after_submit',
  SESSION_EXPIRED: 'session_expired',
  OPEN_MY_REPORTS: 'open_my_reports'
};

const initialState = {
  isMenuOpen: false,
  activePanel: PANEL.BASE,
  selectedLocation: null,
  isPickingLocation: false,
  selectedReportId: null
};

function appViewReducer(state, action) {
  switch (action.type) {
    case ACTION.TOGGLE_MENU:
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      };

    case ACTION.CLOSE_MENU:
      return {
        ...state,
        isMenuOpen: false,
        activePanel: PANEL.BASE,
        isPickingLocation: false,
        selectedReportId: null,
        selectedLocation: null
      };

    case ACTION.OPEN_FORM:
      return {
        ...state,
        isMenuOpen: true,
        activePanel: PANEL.FORM,
        selectedReportId: null
      };

    case ACTION.CLOSE_FORM:
      return {
        ...state,
        activePanel: PANEL.BASE,
        isPickingLocation: false,
        selectedLocation: null
      };

    case ACTION.OPEN_LOGIN:
      return {
        ...state,
        isMenuOpen: false,
        activePanel: PANEL.LOGIN,
        selectedReportId: null,
        isPickingLocation: false
      };

    case ACTION.CLOSE_LOGIN:
      return {
        ...state,
        isMenuOpen: false,
        activePanel: PANEL.BASE
      };

    case ACTION.OPEN_REGISTER:
      return {
        ...state,
        isMenuOpen: false,
        activePanel: PANEL.REGISTER,
        selectedReportId: null,
        isPickingLocation: false
      };

    case ACTION.CLOSE_REGISTER:
      return {
        ...state,
        isMenuOpen: false,
        activePanel: PANEL.BASE
      };

    case ACTION.SHOW_DETAILS:
      return {
        ...state,
        isMenuOpen: true,
        activePanel: PANEL.DETAILS,
        selectedReportId: action.payload.reportId,
        isPickingLocation: false
      };

    case ACTION.CLEAR_DETAILS:
      return {
        ...state,
        activePanel: PANEL.BASE,
        selectedReportId: null
      };

    case ACTION.CLEAR_LOCATION:
      return {
        ...state,
        selectedLocation: null,
        isPickingLocation: false
      };

    case ACTION.OPEN_SIGHTING:
      return {
        ...state,
        isMenuOpen: true,
        activePanel: PANEL.SIGHTING,
        selectedReportId: action.payload.reportId,
        isPickingLocation: false
      };

    case ACTION.OPEN_MY_REPORTS:
      return {
        ...state,
        isMenuOpen: true,
        activePanel: PANEL.MY_REPORTS,
        selectedReportId: null,
        isPickingLocation: false,
        selectedLocation: null
      };

    case ACTION.CLOSE_SIGHTING:
      return {
        ...state,
        activePanel: state.selectedReportId ? PANEL.DETAILS : PANEL.BASE,
        isPickingLocation: false,
        selectedLocation: null
      };

    case ACTION.START_MAP_PICKING:
      return {
        ...state,
        isPickingLocation: true
      };

    case ACTION.STOP_MAP_PICKING:
      return {
        ...state,
        isPickingLocation: false
      };

    case ACTION.SELECT_LOCATION:
      return {
        ...state,
        selectedLocation: action.payload.location,
        isPickingLocation: false
      };

    case ACTION.RESET_AFTER_SUBMIT:
      return {
        ...state,
        isMenuOpen: false,
        activePanel: PANEL.BASE,
        isPickingLocation: false,
        selectedLocation: null
      };

    case ACTION.SESSION_EXPIRED:
      return {
        ...state,
        isMenuOpen: false,
        activePanel: PANEL.LOGIN,
        isPickingLocation: false,
        selectedReportId: null
      };

    default:
      return state;
  }
}

export function useAppViewState() {
  const [state, dispatch] = useReducer(appViewReducer, initialState);

  const toggleMenu = useCallback(() => {
    dispatch({ type: ACTION.TOGGLE_MENU });
  }, []);

  const openBaseMenu = useCallback(() => {
    dispatch({ type: ACTION.CLOSE_MENU });
  }, []);

  const openForm = useCallback(() => {
    dispatch({ type: ACTION.OPEN_FORM });
  }, []);

  const closeForm = useCallback(() => {
    dispatch({ type: ACTION.CLOSE_FORM });
  }, []);

  const openLogin = useCallback(() => {
    dispatch({ type: ACTION.OPEN_LOGIN });
  }, []);

  const closeLogin = useCallback(() => {
    dispatch({ type: ACTION.CLOSE_LOGIN });
  }, []);

  const openRegister = useCallback(() => {
    dispatch({ type: ACTION.OPEN_REGISTER });
  }, []);

  const backToLogin = useCallback(() => {
    dispatch({ type: ACTION.OPEN_LOGIN });
  }, []);

  const closeRegister = useCallback(() => {
    dispatch({ type: ACTION.CLOSE_REGISTER });
  }, []);

  const showReportDetails = useCallback((reportId) => {
    dispatch({
      type: ACTION.SHOW_DETAILS,
      payload: { reportId }
    });
  }, []);

  const clearSelectedReport = useCallback(() => {
    dispatch({ type: ACTION.CLEAR_DETAILS });
  }, []);

  const clearSelectedLocation = useCallback(() => {
    dispatch({ type: ACTION.CLEAR_LOCATION });
  }, []);

  const openSighting = useCallback((reportId) => {
    dispatch({
      type: ACTION.OPEN_SIGHTING,
      payload: { reportId }
    });
  }, []);

  const openMyReports = useCallback(() => {
    dispatch({ type: ACTION.OPEN_MY_REPORTS });
  }, []);

  const closeSighting = useCallback(() => {
    dispatch({ type: ACTION.CLOSE_SIGHTING });
  }, []);

  const startMapPicking = useCallback(() => {
    dispatch({ type: ACTION.START_MAP_PICKING });
  }, []);

  const stopMapPicking = useCallback(() => {
    dispatch({ type: ACTION.STOP_MAP_PICKING });
  }, []);

  const selectLocation = useCallback((location) => {
    dispatch({
      type: ACTION.SELECT_LOCATION,
      payload: { location }
    });
  }, []);

  const resetAfterSubmit = useCallback(() => {
    dispatch({ type: ACTION.RESET_AFTER_SUBMIT });
  }, []);

  const handleSessionExpired = useCallback(() => {
    dispatch({ type: ACTION.SESSION_EXPIRED });
  }, []);

  const derivedState = useMemo(
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

  return {
    ...derivedState,
    toggleMenu,
    openBaseMenu,
    openForm,
    closeForm,
    openLogin,
    closeLogin,
    openRegister,
    backToLogin,
    closeRegister,
    showReportDetails,
    clearSelectedReport,
    clearSelectedLocation,
    openSighting,
    closeSighting,
    startMapPicking,
    stopMapPicking,
    selectLocation,
    resetAfterSubmit,
    handleSessionExpired,
    openMyReports
  };
}
