export const NOTIFICATIONS_CHANGE_EVENT = "notifications-changed";

export function notifyNotificationsChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGE_EVENT));
}

export function onNotificationsChange(callback) {
  window.addEventListener(NOTIFICATIONS_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(NOTIFICATIONS_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
