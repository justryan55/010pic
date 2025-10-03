import { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { useRouter } from "next/navigation";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";

export function useDeepLinking() {
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    CapacitorApp.getLaunchUrl().then((result) => {
      if (result && result.url) {
        handleDeepLink(result.url);
      }
    });

    let listener: PluginListenerHandle | undefined;

    (async () => {
      listener = await CapacitorApp.addListener("appUrlOpen", (data) => {
        handleDeepLink(data.url);
      });
    })();

    function handleDeepLink(url: string) {
      console.log("Deep link received:", url);

      try {
        // Parse the custom URL scheme properly
        // Example: o10pic://auth/reset-password?code=xxx or o10pic://auth/reset-password#access_token=xxx

        const urlParts = url.split("://");
        if (urlParts.length < 2) return;

        const pathAndParams = urlParts[1];

        let path = pathAndParams;
        let queryOrHash = "";

        if (pathAndParams.includes("?")) {
          [path, queryOrHash] = pathAndParams.split("?");
          queryOrHash = "?" + queryOrHash;
        } else if (pathAndParams.includes("#")) {
          [path, queryOrHash] = pathAndParams.split("#");
          queryOrHash = "#" + queryOrHash;
        }

        if (path.includes("auth/reset-password")) {
          const targetPath = `/auth/reset-password${queryOrHash}`;
          console.log("Navigating to:", targetPath);

          router.replace(targetPath);
        }
      } catch (error) {
        console.error("Error handling deep link:", error);
      }
    }

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [router]);
}
