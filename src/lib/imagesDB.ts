import { nanoid } from "nanoid";
import { supabase } from "./supabase/createSupabaseClient";

export async function uploadImagesToSupabase(
  files: File[],
  storageFolder: string
): Promise<{ id: string; src: string; name: string }[]> {
  const uploadedImages = [];

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    console.error("User not authenticated:", userError);
    return [];
  }

  const userId = user.id;
  const currentYear = new Date().getFullYear();
  const dbEntries = [];

  for (const file of files) {
    const uniqueId = nanoid();
    const filePath = `users/${userId}/${storageFolder}/${uniqueId}-${file.name}`;
    const contentType = file.type || "application/octet-stream";

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        upsert: true,
        contentType,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      continue;
    }

    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from("images")
      .createSignedUrl(filePath, 60 * 60);

    if (urlError || !signedUrlData?.signedUrl) {
      console.error("Signed URL generation failed:", urlError);
      continue;
    }

    function mapFolderToCategory(
      storageFolder: string
    ): "person" | "place" | "date" | null {
      if (storageFolder.includes("people")) return "person";
      if (storageFolder.includes("places")) return "place";
      if (storageFolder.includes("month")) return "date";
      return null;
    }

    const category = mapFolderToCategory(storageFolder);

    if (!category) {
      console.error(
        "Invalid category derived from storageFolder:",
        "undefined"
      );
    }

    uploadedImages.push({
      id: uniqueId,
      src: signedUrlData.signedUrl,
      name: file.name,
    });

    dbEntries.push({
      year: currentYear,
      path: filePath,
      category: category,
      name: file.name,
      is_deleted: false,
    });
  }

  if (dbEntries.length > 0) {
    const { error: dbError } = await supabase.from("images").insert(dbEntries);

    if (!dbError) return [];

    console.error("Database insert failed:", dbError.message);
  }

  return uploadedImages;
}

export async function fetchUserImagesByMonth(
  targetYear: string,
  month: string
) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.id) {
    console.error("Not authenticated:", userError);
    return [];
  }

  const category = "date";

  // const folderPath = `users/${user.id}/photos/${targetYear}/month/${month}`;

  const { data: imageRows, error: dbError } = await supabase
    .from("images")
    .select("id, path, name")
    .eq("user_id", user.id)
    .eq("category", category)
    .eq("year", parseInt(targetYear))
    .eq("is_deleted", false)
    .ilike("path", `%/photos/${targetYear}/month/${month}/%`);

  if (dbError) {
    console.error("Error fetching image metadata:", dbError.message);
    return [];
  }

  if (!imageRows || imageRows.length === 0) {
    return [];
  }

  const { data: signedUrls, error: urlError } = await supabase.storage
    .from("images")
    .createSignedUrls(
      imageRows.map((img) => img.path),
      60 * 60
    );

  if (urlError) {
    console.error("Error listing files:", urlError.message);
    return [];
  }

  const images = imageRows
    .map((img) => {
      const signed = signedUrls.find((s) => s.path === img.path);
      return {
        id: img.id,
        name: img.name,
        src: signed?.signedUrl || "",
      };
    })
    .filter((img) => img.src);

  return images;
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

  if (dbError) {
    console.error("Error fetching image records:", dbError.message);
    return {};
  }

  if (!imageRows || imageRows.length === 0) {
    return {};
  }

  const { data: signedUrls, error: urlError } = await supabase.storage
    .from("images")
    .createSignedUrls(
      imageRows.map((img) => img.path),
      60 * 60
    );

  if (urlError) {
    console.error("Error creating signed URLs:", urlError.message);
    return {};
  }

  const signedUrlMap = new Map(
    signedUrls.map((item) => [item.path, item.signedUrl])
  );

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

  if (dbError) {
    console.error("Error fetching image records:", dbError.message);
    return {};
  }

  if (!imageRows || imageRows.length === 0) {
    return {};
  }

  const { data: signedUrls, error: urlError } = await supabase.storage
    .from("images")
    .createSignedUrls(
      imageRows.map((img) => img.path),
      60 * 60
    );

  if (urlError) {
    console.error("Error creating signed URLs:", urlError.message);
    return {};
  }

  const signedUrlMap = new Map(
    signedUrls.map((item) => [item.path, item.signedUrl])
  );

  const imagesByPlace: Record<
    string,
    { id: string; name: string; src: string }[]
  > = {};

  for (const img of imageRows) {
    const signedUrl = signedUrlMap.get(img.path);
    if (!signedUrl) continue;

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
