import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { nanoid } from "npm:nanoid@4";
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const s3Client = new S3Client({
  endpoint: Deno.env.get("R2_ENDPOINT"),
  region: "auto",
  credentials: {
    accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("R2_SECRET_ACCESS_KEY")!,
  },
  forcePathStyle: true,
});

async function uploadToR2(
  key: string,
  body: Uint8Array,
  contentType: string,
  bucketName: string
) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  try {
    await s3Client.send(command);
  } catch (err) {
    throw new Error(`R2 upload failed: ${err}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "No auth token provided" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.split(" ")[1];

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: { headers: { Authorization: `Bearer ${token}` } },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return new Response(JSON.stringify({ error: "Invalid auth token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Invalid content type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const formData = await req.formData();
    const storageFolder = formData.get("storageFolder");

    if (!storageFolder || typeof storageFolder !== "string") {
      return new Response(
        JSON.stringify({ error: "Storage folder is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const files = formData.getAll("files").filter((f) => f instanceof File);
    if (files.length === 0) {
      return new Response(JSON.stringify({ error: "No files provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const r2BucketName = Deno.env.get("R2_BUCKET_NAME")!;
    const r2Endpoint = Deno.env.get("R2_ENDPOINT")!;

    const uploadedImages = [];
    const dbEntries = [];
    const userId = user.id;
    const year =
      storageFolder.match(/(\d{4})/)?.[1] ??
      new Date().getFullYear().toString();

    function mapFolderToCategory(folder: string) {
      folder = folder.toLowerCase();
      if (folder.includes("people")) return "person";
      if (folder.includes("place")) return "place";
      if (folder.includes("date") || folder.includes("month")) return "date";
      return null;
    }

    for (const file of files) {
      if (!file || file.size === 0) continue;

      const uniqueId = nanoid();
      const path = `users/${userId}/${storageFolder}/${uniqueId}-${file.name}`;

      try {
        const buffer = new Uint8Array(await file.arrayBuffer());

        await uploadToR2(
          path,
          buffer,
          file.type || "application/octet-stream",
          r2BucketName
        );

        const publicUrl = `${r2Endpoint}/${r2BucketName}/${path}`;

        const category = mapFolderToCategory(storageFolder);
        if (!category) continue;

        uploadedImages.push({
          id: uniqueId,
          src: publicUrl,
          name: file.name,
        });

        dbEntries.push({
          year: parseInt(year),
          path,
          category,
          name: file.name,
          is_deleted: false,
        });
      } catch (err) {
        console.error(`Failed upload for ${file.name}:`, err);
      }
    }

    if (dbEntries.length > 0) {
      const { error: dbError } = await supabase
        .from("images")
        .insert(dbEntries);
      if (dbError) {
        return new Response(
          JSON.stringify({ error: `Database error: ${dbError.message}` }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, images: uploadedImages }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
