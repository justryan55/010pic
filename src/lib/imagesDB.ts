import { nanoid } from "nanoid";
import { supabase } from "./supabase/createSupabaseClient";

export async function uploadImagesToSupabase(
  files: File[],
  storageFolder: string
): Promise<{ id: string; src: string; name: string }[]> {
  const uploadedImages = [];

  for (const file of files) {
    const filePath = `${storageFolder}/${nanoid()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      continue;
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filePath);

    uploadedImages.push({
      id: nanoid(),
      src: data.publicUrl,
      name: file.name,
    });
  }

  return uploadedImages;
}
