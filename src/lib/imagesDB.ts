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

  const folderPath = `users/${user.id}/photos/${targetYear}/month/${month}`;

  const { data: files, error: listError } = await supabase.storage
    .from("images")
    .list(folderPath, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });

  if (listError) {
    console.error("Error listing files:", listError.message);
    return [];
  }

  const filePaths = (files || []).map((file) => `${folderPath}/${file.name}`);

  if (filePaths.length === 0) {
    return [];
  }

  const { data: signedUrls, error: urlError } = await supabase.storage
    .from("images")
    .createSignedUrls(filePaths, 60 * 60);

  if (urlError) {
    console.error("Error creating batch signed URLs:", urlError.message);
    return [];
  }

  const images = signedUrls.map(({ path, signedUrl }) => ({
    name: path?.split("/").pop() || path,
    src: signedUrl,
  }));

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

  const baseFolder = `users/${user.id}/photos/${targetYear}/people`;

  const { data: peopleFolders, error: folderError } = await supabase.storage
    .from("images")
    .list(baseFolder, {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    });

  if (folderError) {
    console.error("Error listing people folders:", folderError.message);
    return {};
  }

  const imagesByPerson: Record<
    string,
    { id: string; name: string; src: string }[]
  > = {};

  for (const folder of peopleFolders || []) {
    const isFolder = !folder.name.includes(".");

    if (!isFolder) {
      console.log(`Skipping file: ${folder.name}`);
      continue;
    }

    const personName = folder.name;
    const personFolderPath = `${baseFolder}/${personName}`;
    const { data: personFiles, error: fileError } = await supabase.storage
      .from("images")
      .list(personFolderPath, { limit: 100 });

    if (fileError) {
      console.error(`Error listing files in ${personName}:`, fileError.message);
      continue;
    }

    const filePaths = (personFiles || [])
      .filter((file) => file.metadata?.type !== "folder")
      .map((file) => `${personFolderPath}/${file.name}`);

    const { data: signedUrls, error: urlError } = await supabase.storage
      .from("images")
      .createSignedUrls(filePaths, 60 * 60);

    if (urlError) {
      console.error("Error creating batch signed URLs:", urlError.message);
      continue;
    }

    const images = signedUrls
      .map(({ path, signedUrl }) => {
        const fileName = path?.split("/").pop();
        return {
          id: fileName || path,
          name: fileName || path,
          src: signedUrl,
        };
      })
      .filter(
        (image): image is { id: string; name: string; src: string } =>
          image.id !== null && image.name !== null
      );

    imagesByPerson[personName] = images;
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

  const baseFolder = `users/${user.id}/photos/${targetYear}/places`;

  const { data: placesFolders, error: folderError } = await supabase.storage
    .from("images")
    .list(baseFolder, {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    });

  if (folderError) {
    console.error("Error listing people folders:", folderError.message);
    return {};
  }

  const imagesByPlaces: Record<
    string,
    { id: string; name: string; src: string }[]
  > = {};

  for (const folder of placesFolders || []) {
    const isFolder = !folder.name.includes(".");

    if (!isFolder) {
      console.log(`Skipping file: ${folder.name}`);
      continue;
    }

    const placeName = folder.name;
    const placeFolderPath = `${baseFolder}/${placeName}`;
    const { data: placeFiles, error: fileError } = await supabase.storage
      .from("images")
      .list(placeFolderPath, { limit: 100 });

    if (fileError) {
      console.error(`Error listing files in ${placeName}:`, fileError.message);
      continue;
    }

    const filePaths = (placeFiles || [])
      .filter((file) => file.metadata?.type !== "folder")
      .map((file) => `${placeFolderPath}/${file.name}`);

    const { data: signedUrls, error: urlError } = await supabase.storage
      .from("images")
      .createSignedUrls(filePaths, 60 * 60);

    if (urlError) {
      console.error("Error creating batch signed URLs:", urlError.message);
      continue;
    }

    const images = signedUrls
      .map(({ path, signedUrl }) => {
        const fileName = path?.split("/").pop();
        return {
          id: fileName || path,
          name: fileName || path,
          src: signedUrl,
        };
      })
      .filter(
        (image): image is { id: string; name: string; src: string } =>
          image.id !== null && image.name !== null
      );

    imagesByPlaces[placeName] = images;
  }

  return imagesByPlaces;
}
