import api from "./api";

const urlBase64ToUint8Array = (
  base64String
) => {
  const padding =
    "=".repeat(
      (4 - (base64String.length % 4)) % 4
    );

  const base64 =
    (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) =>
      char.charCodeAt(0)
    )
  );
};

/* ---------------------------------------------------------
 * Check browser support
 * --------------------------------------------------------- */

export const isPushSupported = () => {
  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
};

/* ---------------------------------------------------------
 * Register service worker
 * --------------------------------------------------------- */

export const registerPushServiceWorker =
  async () => {
    if (!isPushSupported()) {
      throw new Error(
        "This browser does not support push notifications."
      );
    }

    const registration =
      await navigator.serviceWorker.register(
        "/sw.js"
      );

    console.log(
      "✅ ClassPing service worker registered"
    );

    return registration;
  };

/* ---------------------------------------------------------
 * Enable push notifications
 * --------------------------------------------------------- */

export const enablePushNotifications = async () => {
  if (!isPushSupported()) {
    throw new Error(
      "Push notifications are not supported by this browser."
    );
  }

  // If the browser already has a stored "denied" decision for this
  // site, requestPermission() will resolve to "denied" instantly
  // with no prompt shown — give a clearer message in that case.
  if (Notification.permission === "denied") {
    throw new Error(
      "Notifications are blocked for this site in your browser. " +
      "Enable them from your browser's site settings (click the padlock " +
      "icon in the address bar), then try again."
    );
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error(
      "Notification permission was not granted."
    );
  }

  const registration = await registerPushServiceWorker();

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    const response = await api.get("/push/public-key");
    const publicKey = response.data.publicKey;

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  await api.post("/push/subscribe", {
    subscription: subscription.toJSON(),
  });

  console.log("🔔 ClassPing push notifications enabled");

  return subscription;
};

/* ---------------------------------------------------------
 * Disable push notifications
 * --------------------------------------------------------- */

export const disablePushNotifications =
  async () => {
    const registration =
      await navigator.serviceWorker.getRegistration(
        "/sw.js"
      );

    if (!registration) {
      return;
    }

    const subscription =
      await registration.pushManager.getSubscription();

    if (!subscription) {
      return;
    }

    await api.post(
      "/push/unsubscribe",
      {
        endpoint:
          subscription.endpoint,
      }
    );

    await subscription.unsubscribe();

    console.log(
      "🔕 ClassPing push notifications disabled"
    );
  };

/* ---------------------------------------------------------
 * Current permission state
 * --------------------------------------------------------- */

export const getPushStatus =
  async () => {
    if (!isPushSupported()) {
      return {
        supported: false,
        enabled: false,
      };
    }

    const registration =
      await navigator.serviceWorker.getRegistration(
        "/sw.js"
      );

    const subscription =
      await registration?.pushManager?.getSubscription();

    return {
      supported: true,
      enabled:
        Boolean(subscription) &&
        Notification.permission ===
          "granted",
    };
  };