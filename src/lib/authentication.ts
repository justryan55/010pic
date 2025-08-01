import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { supabase } from "./supabase/createSupabaseClient";

export const fetchUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.log(error);
      return {
        success: false,
        message: error,
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (err) {
    console.log(err);
  }
};

export const logOut = async (router: AppRouterInstance) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/auth");
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteAccount = async (userId: string, email: string) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ is_deleted: true })
      .eq("id", userId);

    if (error) {
      return {
        success: false,
        message: "Error deleting account. Please try again later.",
      };
    }

    const res = await fetch(
      "https://supabase-r2-handler.app010pic.workers.dev/api/delete-auth-email",
      {
        method: "POST",

        body: JSON.stringify({ user_id: userId, email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.error || "Failed to update auth email",
      };
    }

    return {
      success: true,
      message: "User account deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Error deleting account. Please try again later.",
    };
  }
};
