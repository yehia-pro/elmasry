/**
 * Client-Side Image Compressor using HTML5 Canvas
 * Reduces large smartphone photos (5MB - 12MB) down to 150KB - 300KB
 * without losing readability on National IDs or certificates.
 */

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  ratio: number; // percentage saved, e.g. 92%
}

export async function compressImage(
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.78
): Promise<CompressionResult> {
  // If not an image (e.g. PDF), return original as-is
  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      ratio: 0,
    };
  }

  // If already under 250KB, no need to compress further
  if (file.size <= 250 * 1024) {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      ratio: 0,
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate bounded dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback if canvas context fails
          return resolve({
            file,
            originalSize: file.size,
            compressedSize: file.size,
            ratio: 0,
          });
        }

        // Draw image onto canvas with smooth scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob with JPEG (universal compatibility across Egyptian mobile devices)
        const outputMime = file.type === 'image/png' && hasAlpha(ctx, width, height)
          ? 'image/png'
          : 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compression didn't reduce size, keep original
              return resolve({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                ratio: 0,
              });
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], cleanFileName, {
              type: outputMime,
              lastModified: Date.now(),
            });

            const ratio = Math.round(((file.size - blob.size) / file.size) * 100);

            resolve({
              file: compressedFile,
              originalSize: file.size,
              compressedSize: blob.size,
              ratio,
            });
          },
          outputMime,
          quality
        );
      };

      img.onerror = () => {
        resolve({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          ratio: 0,
        });
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      resolve({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        ratio: 0,
      });
    };

    reader.readAsDataURL(file);
  });
}

function hasAlpha(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  try {
    const data = ctx.getImageData(0, 0, Math.min(width, 100), Math.min(height, 100)).data;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) return true;
    }
  } catch {
    return false;
  }
  return false;
}

