import multer from 'multer';
import crypto from 'crypto';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { S3_ACCESS_KEY, S3_BUCKET, S3_ENDPOINT, S3_REGION, S3_SECRET_KEY } from '@/config';

const s3 = new S3Client({
  endpoint: S3_ENDPOINT,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_KEY,
  },
  forcePathStyle: true,
  region: S3_REGION,
});

const storage = multerS3({
  s3,
  bucket: S3_BUCKET,
  acl: 'public-read',
  key: (_, file, cb) => {
    cb(null, `${crypto.randomUUID()}-${file.originalname}`);
  },
});

const UploadMiddleware = multer({
  storage,
  limits: { fieldSize: 25 * 1024 * 1024 },
});

export default UploadMiddleware;
