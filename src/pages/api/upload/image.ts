import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const s3Client = new S3Client({});

  if (
    typeof req.query.file !== "string" ||
    typeof req.query.fileType !== "string"
  ) {
    return res.status(400).json({ error: "file is required" });
  }

  const post = await createPresignedPost(s3Client, {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET ?? ``,
    Key: req.query.file,
    Fields: {
      acl: "public-read",
      "Content-Type": req.query.fileType,
    },
    Expires: 600, // seconds
    Conditions: [
      ["content-length-range", 0, 1048576 * 5], // up to 5 MB
    ],
  });

  res.status(200).json(post);
}
