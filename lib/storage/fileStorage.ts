/**
 * File Storage Service — Abstracts file storage with two backends:
 *
 * 1. Local filesystem (default for development)
 * 2. S3-compatible (MinIO, AWS S3, Cloudflare R2) for production
 *
 * Configured via environment variables.
 */

import { promises as fs } from "fs";
import path from "path";

const STORAGE_BACKEND = process.env.STORAGE_BACKEND || "local"; // "local" | "s3"
const LOCAL_STORAGE_DIR = process.env.LOCAL_STORAGE_DIR || path.join(process.cwd(), "uploads");

// S3 config
const S3_BUCKET = process.env.S3_BUCKET || "skopos-uploads";
const S3_REGION = process.env.S3_REGION || "us-east-1";
const S3_ENDPOINT = process.env.S3_ENDPOINT || ""; // For MinIO: http://localhost:9000
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || "";
const S3_SECRET_KEY = process.env.S3_SECRET_KEY || "";

interface UploadResult {
  key: string;      // Storage key / path
  url: string;      // Access URL
  size: number;
  backend: string;
}

/**
 * Ensure local storage directory exists
 */
async function ensureLocalDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // Directory already exists
  }
}

/**
 * Upload file to local filesystem
 */
async function uploadLocal(
  key: string,
  buffer: Buffer
): Promise<UploadResult> {
  const filePath = path.join(LOCAL_STORAGE_DIR, key);
  const dir = path.dirname(filePath);
  await ensureLocalDir(dir);
  await fs.writeFile(filePath, buffer);

  return {
    key,
    url: `/api/files/${encodeURIComponent(key)}`,
    size: buffer.length,
    backend: "local",
  };
}

/**
 * Download file from local filesystem
 */
async function downloadLocal(key: string): Promise<Buffer> {
  const filePath = path.join(LOCAL_STORAGE_DIR, key);
  return fs.readFile(filePath);
}

/**
 * Delete file from local filesystem
 */
async function deleteLocal(key: string): Promise<void> {
  const filePath = path.join(LOCAL_STORAGE_DIR, key);
  try {
    await fs.unlink(filePath);
  } catch {
    // File may not exist
  }
}

/**
 * Upload file to S3-compatible storage
 */
async function uploadS3(
  key: string,
  buffer: Buffer,
  contentType: string = "application/octet-stream"
): Promise<UploadResult> {
  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: S3_REGION,
    ...(S3_ENDPOINT ? { endpoint: S3_ENDPOINT, forcePathStyle: true } : {}),
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  const url = S3_ENDPOINT
    ? `${S3_ENDPOINT}/${S3_BUCKET}/${key}`
    : `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;

  return {
    key,
    url,
    size: buffer.length,
    backend: "s3",
  };
}

/**
 * Download file from S3
 */
async function downloadS3(key: string): Promise<Buffer> {
  const { S3Client, GetObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: S3_REGION,
    ...(S3_ENDPOINT ? { endpoint: S3_ENDPOINT, forcePathStyle: true } : {}),
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
  });

  const response = await client.send(
    new GetObjectCommand({ Bucket: S3_BUCKET, Key: key })
  );

  const stream = response.Body as NodeJS.ReadableStream;
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

/**
 * Delete file from S3
 */
async function deleteS3(key: string): Promise<void> {
  const { S3Client, DeleteObjectCommand } = await import("@aws-sdk/client-s3");

  const client = new S3Client({
    region: S3_REGION,
    ...(S3_ENDPOINT ? { endpoint: S3_ENDPOINT, forcePathStyle: true } : {}),
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
  });

  await client.send(
    new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key })
  );
}

// ============== Public API ==============

export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType?: string
): Promise<UploadResult> {
  if (STORAGE_BACKEND === "s3") {
    return uploadS3(key, buffer, contentType);
  }
  return uploadLocal(key, buffer);
}

export async function downloadFile(key: string): Promise<Buffer> {
  if (STORAGE_BACKEND === "s3") {
    return downloadS3(key);
  }
  return downloadLocal(key);
}

export async function deleteFile(key: string): Promise<void> {
  if (STORAGE_BACKEND === "s3") {
    return deleteS3(key);
  }
  return deleteLocal(key);
}

/**
 * Generate a unique storage key for a user file
 */
export function generateFileKey(userId: string, filename: string): string {
  const timestamp = Date.now();
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `cvs/${userId}/${timestamp}_${sanitized}`;
}
