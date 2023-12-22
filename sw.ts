import { skipWaiting, clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";

skipWaiting();
clientsClaim();

self.addEventListener("push", (e) => {
  const data = e;
  console.log(data);
  // return self.Notification.requestPermission().then((permission) => {
  //     if (permission === 'granted') {
  //       return new self.Notification(title, notificationOptions);
  //     }
  // });
});
