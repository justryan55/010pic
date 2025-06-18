import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { R2_BUCKET_NAME, r2Client } from "@/lib/r2Client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createSupabaseServer } from "@/lib/supabase/createSupabaseServer";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServer();

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      console.error("No valid auth header");
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

    if (userError) {
      console.error("User auth error:", userError);
      return NextResponse.json(
        { error: "Invalid auth token" },
        { status: 401 }
      );
    }

    if (!user?.id) {
      console.error("No user found");
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    let formData;
    try {
      formData = await req.formData();
    } catch (parseError) {
      console.error("Form data parsing error:", parseError);
      return NextResponse.json(
        { error: "Failed to parse form data" },
        { status: 400 }
      );
    }

    const storageFolder = formData.get("storageFolder") as string;

    if (!storageFolder) {
      console.error("No storage folder provided");
      return NextResponse.json(
        { error: "Storage folder is required" },
        { status: 400 }
      );
    }

    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      console.error("No files provided");
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedImages = [];
    const dbEntries = [];
    const userId = user.id;

    const folderYearMatch = storageFolder.match(/(\d{4})/);
    const extractedYear = folderYearMatch
      ? parseInt(folderYearMatch[1])
      : new Date().getFullYear();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file || file.size === 0) {
        console.warn(`Skipping empty file at index ${i}`);
        continue;
      }

      const uniqueId = nanoid();
      const filePath = `users/${userId}/${storageFolder}/${uniqueId}-${file.name}`;

      try {
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        const putCommand = new PutObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: filePath,
          Body: fileBuffer,
          ContentType: file.type || "application/octet-stream",
        });

        await r2Client.send(putCommand);

        const signedUrl = await getSignedUrl(
          r2Client,
          new GetObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: filePath,
          }),
          { expiresIn: 3600 }
        );

        function mapFolderToCategory(
          folder: string
        ): "person" | "place" | "date" | null {
          const lowerFolder = folder.toLowerCase();
          if (lowerFolder.includes("people") || lowerFolder.includes("person"))
            return "person";
          if (lowerFolder.includes("places") || lowerFolder.includes("place"))
            return "place";
          if (lowerFolder.includes("month") || lowerFolder.includes("date"))
            return "date";
          return null;
        }

        const category = mapFolderToCategory(storageFolder);

        if (!category) {
          console.warn("Unrecognized category for folder:", storageFolder);
          continue;
        }

        uploadedImages.push({
          id: uniqueId,
          src: signedUrl,
          name: file.name,
        });

        dbEntries.push({
          year: extractedYear,
          path: filePath,
          category,
          name: file.name,
          is_deleted: false,
        });
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);

        if (fileError instanceof Error) {
          console.error("Error message:", fileError.message);
          console.error("Error stack:", fileError.stack);
        }

        continue;
      }
    }

    if (dbEntries.length > 0) {
      try {
        const { error: dbError } = await supabase
          .from("images")
          .insert(dbEntries);

        if (dbError) {
          console.error("Database error:", dbError);
          return NextResponse.json(
            { error: `Database insert failed: ${dbError.message}` },
            { status: 500 }
          );
        }
      } catch (dbInsertError) {
        console.error("Database insert exception:", dbInsertError);
        return NextResponse.json(
          { error: "Database operation failed" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `Successfully uploaded ${uploadedImages.length} images`,
    });
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Upload failed with unknown error" },
      { status: 500 }
    );
  }
}
