/* global clients */

self.addEventListener("push", (event) => {
  let payload = {
    title: "ClassPing",
    body: "You have a new notification.",
    data: {},
  };

  try {
    if (event.data) {
      payload = event.data.json() || {};
    }
  } catch (error) {
    console.error(
      "Failed to parse push notification:",
      error
    );
  }

  const data = payload.data || {};

  const options = {
    body:
      payload.body ||
      payload.message ||
      "You have a new notification.",

    icon: "/classping-logo.png",
    badge: "/classping-logo.png",

    data,

    vibrate: [200, 100, 200],

    requireInteraction: false,

    tag:
      data.type ||
      "classping-notification",
  };

  event.waitUntil(
    self.registration.showNotification(
      payload.title || "ClassPing",
      options
    )
  );
});

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const notificationData =
      event.notification.data || {};

    let targetUrl = "/dashboard";

    if (
      notificationData.type ===
        "class_reminder_20" ||
      notificationData.type ===
        "class_reminder_10"
    ) {
      targetUrl =
        "/dashboard/upcoming-classes";
    }

    if (
      notificationData.type ===
      "tomorrow_schedule"
    ) {
      targetUrl = "/dashboard";
    }

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            const url = new URL(client.url);

            if (
              url.pathname.startsWith(
                "/dashboard"
              )
            ) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow(
              targetUrl
            );
          }

          return undefined;
        })
    );
  }
);