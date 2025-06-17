import { nanoid } from "nanoid";
import { supabase } from "./supabase/createSupabaseClient";

export async function uploadImagesToSupabase(
  files: File[],
  storageFolder: string
): Promise<{ id: string; src: string; name: string }[]> {
  const uploadedImages = [];

  for (const file of files) {
    const uniqueId = nanoid();
    const filePath = `${storageFolder}/${uniqueId}-${file.name}`;
    const contentType = file.type || "application/octet-stream";

    console.log(`Uploading to: ${filePath}`);

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

    console.log("Signed URL:", signedUrlData.signedUrl);

    uploadedImages.push({
      id: uniqueId,
      src: signedUrlData.signedUrl,
      name: file.name,
    });
  }

  return uploadedImages;
}
