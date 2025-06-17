import { supabase } from "./supabase/createSupabaseClient";
import { redirect } from "next/navigation";

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

export const logOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      redirect("/auth/login");
    }
  } catch (err) {
    console.log(err);
  }
};
