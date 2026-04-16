let sessionExpiredHandler = null;

export function setSessionExpiredHandler(handler) {
  sessionExpiredHandler = handler;
}

export function clearSessionExpiredHandler(handler) {
  if (sessionExpiredHandler === handler) {
    sessionExpiredHandler = null;
  }
}

export function notifySessionExpired() {
  sessionExpiredHandler?.();
}
