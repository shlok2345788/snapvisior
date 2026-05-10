import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const bucketId = process.env.B2_BUCKET_ID;
const bucketName = process.env.B2_BUCKET_NAME;
const endpoint = process.env.B2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com';
const accessKeyId = process.env.B2_KEY_ID;
const secretAccessKey = process.env.B2_APP_KEY;

const hasB2BucketConfig = Boolean(bucketName);
const hasB2Credentials = Boolean(accessKeyId && secretAccessKey);

function assertB2Configured() {
  if (!hasB2BucketConfig) {
    throw new Error('Backblaze B2 bucket name is not configured. Set B2_BUCKET_NAME.');
  }

  if (!hasB2Credentials) {
    throw new Error('Backblaze B2 credentials are not configured. Set B2_KEY_ID and B2_APP_KEY.');
  }
}

if (!hasB2BucketConfig || !hasB2Credentials) {
  console.warn('Backblaze B2 environment variables are not fully configured.');
}

const s3Client = new S3Client({
  region: 'us-east-005',
  endpoint,
  credentials: accessKeyId && secretAccessKey ? {
    accessKeyId,
    secretAccessKey,
  } : undefined,
  forcePathStyle: true,
});

export async function uploadImageBufferToB2(buffer: Buffer, key: string, contentType = 'image/jpeg') {
  assertB2Configured();

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return {
    key,
    bucketId: bucketId || null,
  };
}

export async function getB2SignedReadUrl(key: string, expiresInSeconds = 60 * 60) {
  assertB2Configured();

  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
    { expiresIn: expiresInSeconds }
  );
}

export function getB2ObjectKeyFromStoredValue(storedValue: string): string | null {
  const value = storedValue.trim();

  if (!value) {
    return null;
  }

  if (!/^https?:\/\//i.test(value)) {
    return value;
  }

  try {
    const parsed = new URL(value);
    const pathname = decodeURIComponent(parsed.pathname).replace(/^\/+/, '');

    if (!pathname) {
      return null;
    }

    if (bucketName) {
      const bucketPrefix = `${bucketName}/`;
      if (pathname.startsWith(bucketPrefix)) {
        return pathname.slice(bucketPrefix.length);
      }
    }

    return pathname;
  } catch {
    return null;
  }
}

export async function getB2SignedReadUrlFromStoredValue(storedValue: string, expiresInSeconds = 60 * 60) {
  const objectKey = getB2ObjectKeyFromStoredValue(storedValue);

  if (!objectKey) {
    return storedValue;
  }

  if (/^https?:\/\//i.test(storedValue) && !storedValue.includes('backblazeb2.com')) {
    return storedValue;
  }

  return getB2SignedReadUrl(objectKey, expiresInSeconds);
}

export async function deleteB2Object(key: string) {
  assertB2Configured();

  return s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}
