import { User } from "@supabase/supabase-js";
import { SupabaseClient } from "@supabase/supabase-js";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type HandlePostLoginParams = {
  user: User;
  supabase: SupabaseClient;
  setAuthError: (msg: string) => void;
  router: AppRouterInstance;
  setCurrentPage: (page: string) => void;
};

export const handlePostLogin = async ({
  user,
  supabase,
  setAuthError,
  router,
  setCurrentPage,
}: HandlePostLoginParams) => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("onboarding_complete, is_deleted")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      setAuthError("Failed to retrieve profile information.");
      return;
    }

    if (profile?.is_deleted) {
      await supabase.auth.signOut();
      setAuthError("This account has been deleted.");
      return;
    }

    if (!profile?.onboarding_complete) {
      router.push("/onboarding/welcome");
      setCurrentPage("onboarding/welcome");
    } else {
      router.push("/date");
      setCurrentPage("date");
    }
  } catch (err) {
    console.error("Post-login error:", err);
    setAuthError("An unexpected error occurred after login.");
  }
};
