import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase/createSupabaseClient";
import { redirect } from "next/navigation";
import { email } from "zod/v4-mini";

export const fetchUser = async (session: Session) => {
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
