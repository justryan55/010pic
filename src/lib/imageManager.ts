import { supabase } from "./supabase/createSupabaseClient";

export async function uploadImagesToSupabase(
  files: File[],
  storageFolder: string
): Promise<{ id: string; src: string; name: string }[]> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    console.error("User not authenticated:", sessionError);
    return [];
  }

  try {
    const formData = new FormData();
    formData.append("storageFolder", storageFolder);

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await fetch("/api/upload-images", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: `${errorText} (Parse error: ${e})` };
      }

      throw new Error(
        errorData.error || `HTTP ${response.status}: ${errorText}`
      );
    }

    const result = await response.json();
    return result.images || [];
  } catch (error) {
    console.error("Upload failed with detailed error:", error);

    if (error instanceof TypeError && error.message.includes("fetch")) {
      console.error("Network error - check if server is running");
    }

    throw error;
  }
}

export async function fetchUserImagesByMonth(
  targetYear: string,
  months: string[]
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    console.error("Not authenticated:", userError);
    return {};
  }

  const category = "date";

  const { data: imageRows, error: dbError } = await supabase
    .from("images")
    .select("id, path, name")
    .eq("user_id", user.id)
    .eq("category", category)
    .eq("year", parseInt(targetYear))
    .eq("is_deleted", false)
    .ilike("path", `%/photos/${targetYear}/month/%`);

  if (dbError) {
    console.error("Error fetching image metadata:", dbError.message);
    return {};
  }

  if (!imageRows || imageRows.length === 0) {
    return {};
  }

  const monthsSet = new Set(months);
  const filteredRows = imageRows.filter((img) => {
    const pathParts = img.path.split("/");
    const monthIndex = pathParts.indexOf("month") + 1;
    const month = pathParts[monthIndex];
    return month && monthsSet.has(month);
  });

  if (filteredRows.length === 0) {
    return {};
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) return {};


  try {
    const response = await fetch("/api/generate-urls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths: filteredRows.map((img) => img.path),
      }),
    });

    const urlData = await response.json();
    const signedUrlMap = new Map<string, string>(Object.entries(urlData.urls));

    const imagesByMonth: Record<
      string,
      { id: string; name: string; src: string }[]
    > = {};

    for (const img of filteredRows) {
      const signedUrl = signedUrlMap.get(img.path);
      if (!signedUrl) continue;

      const pathParts = img.path.split("/");
      const monthIndex = pathParts.indexOf("month") + 1;
      const month = pathParts[monthIndex];

      if (!month) continue;

      const monthKey = `${targetYear}-${month}`;

      if (!imagesByMonth[monthKey]) {
        imagesByMonth[monthKey] = [];
      }

      imagesByMonth[monthKey].push({
        id: img.id,
        name: img.name,
        src: signedUrl,
      });
    }

    return imagesByMonth;
  } catch (error) {
    console.error("Failed to generate URLs:", error);
    return {};
  }
}

export async function fetchUserImagesByPersonYear(targetYear: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    console.error("Not authenticated:", userError);
    return {};
  }

  const category = "person";

  const { data: imageRows, error: dbError } = await supabase
    .from("images")
    .select("id, name, path")
    .eq("user_id", user.id)
    .eq("year", targetYear)
    .eq("category", category)
    .eq("is_deleted", false);

  if (dbError || !imageRows || imageRows.length === 0) {
    console.error("Error fetching image records:", dbError?.message);
    return {};
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) return {};

  try {
    const response = await fetch("/api/generate-urls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths: imageRows.map((img) => img.path),
      }),
    });

    const urlData = await response.json();
    const signedUrlMap = new Map<string, string>(Object.entries(urlData.urls));

    const imagesByPerson: Record<
      string,
      { id: string; name: string; src: string }[]
    > = {};

    for (const img of imageRows) {
      const signedUrl = signedUrlMap.get(img.path);
      if (!signedUrl) continue;

      const pathParts = img.path.split("/");
      const personIndex = pathParts.indexOf("people") + 1;
      const personName = pathParts[personIndex];

      if (!personName) continue;

      if (!imagesByPerson[personName]) {
        imagesByPerson[personName] = [];
      }

      imagesByPerson[personName].push({
        id: img.id,
        name: img.name,
        src: signedUrl,
      });
    }

    return imagesByPerson;
  } catch (error) {
    console.error("Failed to generate URLs:", error);
    return {};
  }
}

export async function fetchUserImagesByPlaceYear(targetYear: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    console.error("Not authenticated:", userError);
    return {};
  }

  const category = "place";

  const { data: imageRows, error: dbError } = await supabase
    .from("images")
    .select("id, name, path")
    .eq("user_id", user.id)
    .eq("year", targetYear)
    .eq("category", category)
    .eq("is_deleted", false);

  if (dbError || !imageRows || imageRows.length === 0) {
    console.error("Error fetching image records:", dbError?.message);
    return {};
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) return {};

  try {
    const response = await fetch("/api/generate-urls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths: imageRows.map((img) => img.path),
      }),
    });

    const urlData = await response.json();
    const signedUrlMap = new Map(Object.entries(urlData.urls));

    const imagesByPlace: Record<
      string,
      { id: string; name: string; src: string }[]
    > = {};

    for (const img of imageRows) {
      const signedUrl = signedUrlMap.get(img.path);
      if (!signedUrl || typeof signedUrl !== "string") continue;

      const pathParts = img.path.split("/");
      const placeIndex = pathParts.indexOf("places") + 1;
      const placeName = pathParts[placeIndex];

      if (!placeName) continue;

      if (!imagesByPlace[placeName]) {
        imagesByPlace[placeName] = [];
      }

      imagesByPlace[placeName].push({
        id: img.id,
        name: img.name,
        src: signedUrl,
      });
    }

    return imagesByPlace;
  } catch (error) {
    console.error("Failed to generate URLs:", error);
    return {};
  }
}

export async function softDeleteImage(imageId: string) {
  const { error } = await supabase
    .from("images")
    .update({ is_deleted: true })
    .eq("id", imageId);

  if (error) {
    console.error("Soft delete failed:", error.message);
    return false;
  }

  return true;
}
export async function fetchSavedYears(tab: string) {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    const { data, error } = await supabase
      .from("saved_years")
      .select("year")
      .eq("user_id", user.id)
      .eq("tab", tab);

    if (error) {
      console.error("Error fetching saved years:", error.message);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data,
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export const addYearToDB = async (year: number, tab: string) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user?.id) {
      return { success: false, error: "User not authenticated" };
    }

    const { error } = await supabase.from("saved_years").insert({
      user_id: user.id,
      year,
      tab,
    });

    if (error) {
      console.error("Error adding year:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};

export const confirmDeletionFromDb = async (
  yearToRemove: number,
  tab: string
) => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user?.id || !yearToRemove) {
      return { success: false, error: "Invalid parameters or unauthenticated" };
    }

    const { error } = await supabase
      .from("saved_years")
      .delete()
      .eq("user_id", user.id)
      .eq("year", yearToRemove)
      .eq("tab", tab);

    if (error) {
      console.error("Error deleting year:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
