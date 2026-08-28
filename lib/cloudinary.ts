import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary if credentials exist
const hasCloudinary = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId?: string;
  fileName: string;
}

export async function uploadFileBuffer(
  buffer: Buffer,
  originalFilename: string,
  folder: string = 'institute_documents'
): Promise<UploadResult> {
  const extension = path.extname(originalFilename) || '.jpg';
  const cleanOriginalName = path.basename(originalFilename, extension);
  const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${extension}`;

  if (hasCloudinary) {
    try {
      return new Promise<UploadResult>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto',
            public_id: `${cleanOriginalName}_${Date.now()}`,
          },
          (error, result) => {
            if (error || !result) {
              console.warn('Cloudinary upload failed, falling back to local storage:', error?.message);
              // Fallback to local
              saveLocally(buffer, uniqueName, originalFilename)
                .then(resolve)
                .catch(reject);
            } else {
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
                fileName: originalFilename,
              });
            }
          }
        );
        uploadStream.end(buffer);
      });
    } catch (e) {
      console.warn('Cloudinary exception, falling back to local:', e);
      return saveLocally(buffer, uniqueName, originalFilename);
    }
  } else {
    // Save to local public/uploads directory
    return saveLocally(buffer, uniqueName, originalFilename);
  }
}

async function saveLocally(buffer: Buffer, fileName: string, originalName: string): Promise<UploadResult> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, fileName);
  await fs.promises.writeFile(filePath, buffer);

  return {
    url: `/uploads/${fileName}`,
    publicId: fileName,
    fileName: originalName,
  };
}
