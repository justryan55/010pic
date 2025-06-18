import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2Client";
import { createSupabaseServer } from "@/lib/supabase/createSupabaseServer";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServer();
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No auth token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user?.id) {
      return NextResponse.json(
        { error: "Invalid auth token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { paths } = body;

    if (!Array.isArray(paths)) {
      return NextResponse.json(
        { error: "Paths must be an array" },
        { status: 400 }
      );
    }

    const urls: Record<string, string> = {};

    for (const path of paths) {
      try {
        const getCommand = new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: path,
        });

        const signedUrl = await getSignedUrl(r2Client, getCommand, {
          expiresIn: 3600, // 1 hour
        });

        urls[path] = signedUrl;
      } catch (error) {
        console.error(`Failed to generate URL for ${path}:`, error);
      }
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("URL generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate URLs" },
      { status: 500 }
    );
  }
}
