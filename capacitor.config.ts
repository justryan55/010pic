import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ryanirani.app010pic",
  appName: "O10Pic",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
  plugins: {
    Camera: {},
    PurchasesPlugin: {},
    StatusBar: {
      backgroundColor: "#f5f0ed",
      overlaysWebView: false,
    },
  },
  ios: {
    scheme: "O10pic",
  },
};

export default config;
