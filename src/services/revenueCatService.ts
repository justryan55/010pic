import {
  Purchases,
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
} from "@revenuecat/purchases-capacitor";

export interface SubscriptionStatus {
  isSubscribed: boolean;
  expirationDate?: string;
  productIdentifier?: string;
  isActive?: boolean;
}

export class RevenueCatService {
  private static instance: RevenueCatService;
  private isInitialized = false;

  private readonly REVENUECAT_API_KEY = "goog_PqjTmpaXfwUypXmcExXVweBHOKQ";

  static getInstance(): RevenueCatService {
    if (!RevenueCatService.instance) {
      RevenueCatService.instance = new RevenueCatService();
    }
    return RevenueCatService.instance;
  }

  async initialize(userId?: string): Promise<boolean> {
    try {
      if (this.isInitialized) {
        console.log("RevenueCat already initialized");
        return true;
      }

      console.log("Initializing RevenueCat...");

      await Purchases.configure({
        apiKey: this.REVENUECAT_API_KEY,
        appUserID: userId || null,
      });

      this.isInitialized = true;
      console.log("RevenueCat initialized successfully");
      return true;
    } catch (error) {
      console.error("Failed to initialize RevenueCat:", error);
      return false;
    }
  }

  async getOfferings(): Promise<PurchasesOffering[]> {
    try {
      if (!this.isInitialized) {
        throw new Error("RevenueCat not initialized");
      }

      console.log("Fetching offerings...");
      const offerings = await Purchases.getOfferings();

      console.log("Offerings fetched:", offerings);
      return offerings.all ? Object.values(offerings.all) : [];
    } catch (error) {
      console.error("Failed to fetch offerings:", error);
      return [];
    }
  }

  async getCurrentOffering(): Promise<PurchasesOffering | null> {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings.current || null;
    } catch (error) {
      console.error("Failed to get current offering:", error);
      return null;
    }
  }

  async purchasePackage(
    packageToPurchase: PurchasesPackage
  ): Promise<CustomerInfo> {
    try {
      if (!this.isInitialized) {
        throw new Error("RevenueCat not initialized");
      }

      console.log("Initiating purchase...", packageToPurchase.identifier);
      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToPurchase,
      });

      console.log("Purchase successful:", purchaseResult);
      return purchaseResult.customerInfo;
    } catch (error) {
      console.error("Purchase failed:", error);
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(`Purchase failed: ${errorMessage}`);
    }
  }

  async purchaseProduct(productId: string): Promise<CustomerInfo> {
    try {
      if (!this.isInitialized) {
        throw new Error("RevenueCat not initialized");
      }

      console.log("Purchasing product:", productId);

      // Fetch offerings and find the product
      const offerings = await Purchases.getOfferings();
      let packageToPurchase: PurchasesPackage | null = null;
      if (offerings.current && offerings.current.availablePackages) {
        for (const pkg of offerings.current.availablePackages) {
          if (pkg.identifier === productId) {
            packageToPurchase = pkg;
            break;
          }
        }
      }

      if (!packageToPurchase) {
        throw new Error(
          `Product with identifier ${productId} not found in current offerings`
        );
      }

      const purchaseResult = await Purchases.purchasePackage({
        aPackage: packageToPurchase,
      });

      console.log("Product purchase successful:", purchaseResult);
      return purchaseResult.customerInfo;
    } catch (error) {
      console.error("Product purchase failed:", error);
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(`Product purchase failed: ${errorMessage}`);
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      if (!this.isInitialized) {
        throw new Error("RevenueCat not initialized");
      }

      console.log("Fetching customer info...");
      const customerInfo = await Purchases.getCustomerInfo();
      console.log("Customer info:", customerInfo);
      return customerInfo.customerInfo;
    } catch (error) {
      console.error("Failed to get customer info:", error);
      return null;
    }
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const customerInfo = await this.getCustomerInfo();

      if (!customerInfo) {
        return { isSubscribed: false };
      }

      const activeSubscriptions = customerInfo.activeSubscriptions;
      const isSubscribed = activeSubscriptions.length > 0;

      if (isSubscribed) {
        const monthlyPlanInfo =
          customerInfo.entitlements.active["monthly-plan"] ||
          customerInfo.entitlements.active[
            Object.keys(customerInfo.entitlements.active)[0]
          ];

        if (monthlyPlanInfo) {
          return {
            isSubscribed: true,
            expirationDate: monthlyPlanInfo.expirationDate ?? undefined,
            productIdentifier: monthlyPlanInfo.productIdentifier,
            isActive: monthlyPlanInfo.isActive,
          };
        }
      }

      return { isSubscribed: false };
    } catch (error) {
      console.error("Failed to get subscription status:", error);
      return { isSubscribed: false };
    }
  }

  async restorePurchases(): Promise<CustomerInfo | null> {
    try {
      if (!this.isInitialized) {
        throw new Error("RevenueCat not initialized");
      }

      console.log("Restoring purchases...");
      const customerInfoResult = await Purchases.restorePurchases();
      console.log("Purchases restored:", customerInfoResult);
      return customerInfoResult.customerInfo;
    } catch (error) {
      console.error("Failed to restore purchases:", error);
      return null;
    }
  }

  async setUserId(userId: string): Promise<void> {
    try {
      if (!this.isInitialized) {
        throw new Error("RevenueCat not initialized");
      }

      await Purchases.logIn({ appUserID: userId });
      console.log("User ID set:", userId);
    } catch (error) {
      console.error("Failed to set user ID:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (!this.isInitialized) {
        throw new Error("RevenueCat not initialized");
      }

      await Purchases.logOut();
      console.log("User logged out");
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  }

  async hasActiveEntitlement(entitlementId: string): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      if (!customerInfo) return false;

      const entitlement = customerInfo.entitlements.active[entitlementId];
      return entitlement ? entitlement.isActive : false;
    } catch (error) {
      console.error("Failed to check entitlement:", error);
      return false;
    }
  }
}
