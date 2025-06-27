/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
} from "@revenuecat/purchases-capacitor";
import {
  RevenueCatService,
  SubscriptionStatus,
} from "../services/revenueCatService";
import { Capacitor } from "@capacitor/core";

interface UseRevenueCatReturn {
  isInitialized: boolean;
  subscriptionStatus: SubscriptionStatus | null;
  offerings: PurchasesOffering[];
  currentOffering: PurchasesOffering | null;
  customerInfo: CustomerInfo | null;
  loading: boolean;
  error: string | null;

  initialize: (userId?: string) => Promise<boolean>;
  purchasePackage: (packageToPurchase: PurchasesPackage) => Promise<boolean>;
  purchaseMonthlyPlan: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshCustomerInfo: () => Promise<void>;
  setUserId: (userId: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

export const useRevenueCat = (): UseRevenueCatReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);

  const [offerings, setOfferings] = useState<PurchasesOffering[]>([]);
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNative = Capacitor.isNativePlatform();

  const revenueCatService = RevenueCatService.getInstance();

  const clearError = () => setError(null);

  const initialize = useCallback(async (userId?: string): Promise<boolean> => {
    if (!isNative) {
      setLoading(false);
      // setError("Subscriptions not supported on web yet.");
      setIsInitialized(false);
      return false;
    }
    setLoading(true);
    clearError();

    try {
      const success = await revenueCatService.initialize(userId);
      setIsInitialized(success);

      if (success) {
        await Promise.all([loadOfferings(), refreshCustomerInfo()]);
      }

      return success;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOfferings = async () => {
    try {
      const [allOfferings, current] = await Promise.all([
        revenueCatService.getOfferings(),
        revenueCatService.getCurrentOffering(),
      ]);

      setOfferings(allOfferings);
      setCurrentOffering(current);
    } catch (err) {
      console.error("Failed to load offerings:", err);
    }
  };

  const refreshCustomerInfo = async () => {
    try {
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);

      if (info) {
        const status = await revenueCatService.getSubscriptionStatus();
        setSubscriptionStatus(status);
      }
    } catch (err) {
      console.error("Failed to refresh customer info:", err);
    }
  };

  const purchasePackage = useCallback(
    async (packageToPurchase: PurchasesPackage): Promise<boolean> => {
      try {
        setLoading(true);
        clearError();

        const customerInfo = await revenueCatService.purchasePackage(
          packageToPurchase
        );
        setCustomerInfo(customerInfo);

        const status = await revenueCatService.getSubscriptionStatus();
        setSubscriptionStatus(status);

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Purchase failed";
        setError(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const purchaseMonthlyPlan = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();

      if (currentOffering && currentOffering.availablePackages) {
        const monthlyPackage = currentOffering.availablePackages.find(
          (pkg) => pkg.identifier === "$rc_monthly"
        );

        if (monthlyPackage) {
          return await purchasePackage(monthlyPackage);
        }
      }

      setError("Monthly package not found in current offering");
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Purchase failed";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentOffering, purchasePackage]);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();

      const customerInfo = await revenueCatService.restorePurchases();
      setCustomerInfo(customerInfo);

      if (customerInfo) {
        const status = await revenueCatService.getSubscriptionStatus();
        setSubscriptionStatus(status);
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Restore failed";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const setUserId = useCallback(async (userId: string): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();

      await revenueCatService.setUserId(userId);
      await refreshCustomerInfo();

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to set user ID";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();

      await revenueCatService.logout();

      setCustomerInfo(null);
      setSubscriptionStatus({ isSubscribed: false });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Logout failed";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  return {
    isInitialized,
    subscriptionStatus,
    offerings,
    currentOffering,
    customerInfo,
    loading,
    error,

    initialize,
    purchasePackage,
    purchaseMonthlyPlan,
    restorePurchases,
    refreshCustomerInfo,
    setUserId,
    logout,
  };
};
