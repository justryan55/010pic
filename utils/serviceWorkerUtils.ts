export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("SW registered:", registration);

        if (registration.waiting) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }

        if (registration.active) {
          navigator.serviceWorker.ready.then((reg) =>
            reg.active?.postMessage({ type: "CLIENTS_CLAIM" })
          );
        }
      } catch (err) {
        console.error("SW registration failed:", err);
      }
    });
  }
};

export const clearImageCache = async (): Promise<boolean> => {
  if (!("serviceWorker" in navigator)) {
    return Promise.reject(new Error("Service Worker not supported."));
  }

  const controller = navigator.serviceWorker.controller;

  if (controller) {
    return sendClearMessage(controller);
  }

  return new Promise((resolve, reject) => {
    const onControllerChange = () => {
      if (navigator.serviceWorker.controller) {
        sendClearMessage(navigator.serviceWorker.controller)
          .then(resolve)
          .catch(reject);
      } else {
        reject(new Error("Service Worker failed to take control."));
      }
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange
      );
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange
    );
  });
};

const sendClearMessage = (controller: ServiceWorker) => {
  return new Promise<boolean>((resolve, reject) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.success) resolve(true);
      else reject(new Error("Failed to clear cache"));
    };
    controller.postMessage({ type: "CLEAR_IMAGE_CACHE" }, [
      messageChannel.port2,
    ]);
  });
};
