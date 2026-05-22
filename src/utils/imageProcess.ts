import { supabase } from './supabase';

/**
 * Compresses an image file using Canvas.
 * @param file The original image file
 * @param maxWidth Max width in pixels
 * @param quality Quality from 0 to 1
 * @returns A Promise that resolves to a Blob
 */
export async function compressImage(file: File, maxWidth = 1200, quality = 0.7): Promise<Blob | File> {
  // If the file is small enough, don't compress
  if (file.size < 200 * 1024) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas toBlob failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Image load failed'));
    };
    reader.onerror = () => reject(new Error('File reader failed'));
  });
}

/**
 * Uploads an image to Supabase Storage and returns the public URL.
 * @param file The file or blob to upload
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(file: File | Blob): Promise<string> {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
  const filePath = `journal-images/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('images') // Assumes a bucket named 'images' exists
    .upload(filePath, file, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (uploadError) {
    // If bucket doesn't exist, this might fail. 
    // In a real app, we'd ensure the bucket exists.
    console.error('Upload error:', uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('images').getPublicUrl(filePath);
  return data.publicUrl;
}
