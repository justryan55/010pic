import "dotenv/config";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME!;

async function emptyBucket() {
  try {
    let isTruncated = true;
    let continuationToken: string | undefined = undefined;

    while (isTruncated) {
      const listCommand = new ListObjectsV2Command({
        Bucket: BUCKET,
        ContinuationToken: continuationToken,
      });

      const listResponse: ListObjectsV2CommandOutput = await r2.send(
        listCommand
      );

      const objects =
        listResponse.Contents?.map((item): { Key: string } => ({
          Key: item.Key!,
        })) || [];

      if (objects.length > 0) {
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: BUCKET,
          Delete: { Objects: objects },
        });

        await r2.send(deleteCommand);
        console.log(`Deleted ${objects.length} objects`);
      }

      isTruncated = listResponse.IsTruncated ?? false;
      continuationToken = listResponse.NextContinuationToken;
    }

    console.log("Bucket is now empty.");
  } catch (err) {
    console.error("Error emptying bucket:", err);
  }
}

emptyBucket();
