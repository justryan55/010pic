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
    EdgeToEdge: {
      backgroundColor: "#f5f0ed",
    },
  },
  ios: {
    scheme: "o10pic",
  },
};

export default config;
