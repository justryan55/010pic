import {
  S3Client,
  GetObjectCommand,
} from "https://esm.sh/@aws-sdk/client-s3@3?target=denonext";
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner@3?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=denonext";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
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

    const body = await req.json();
    const { paths } = body;

    if (!Array.isArray(paths)) {
      return new Response(JSON.stringify({ error: "Paths must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const r2Client = new S3Client({
      endpoint: Deno.env.get("R2_ENDPOINT"),
      region: "auto",
      credentials: {
        accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID")!,
        secretAccessKey: Deno.env.get("R2_SECRET_ACCESS_KEY")!,
      },
      forcePathStyle: true,
    });

    const R2_BUCKET_NAME = Deno.env.get("R2_BUCKET_NAME")!;
    const urls: Record<string, string> = {};

    for (const path of paths) {
      try {
        const getCommand = new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: path,
        });

        const signedUrl = await getSignedUrl(r2Client, getCommand, {
          expiresIn: 3600,
        });

        urls[path] = signedUrl;
      } catch (error) {
        console.error(`Failed to generate URL for ${path}:`, error);
      }
    }

    return new Response(JSON.stringify({ urls }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("URL generation error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate URLs" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
