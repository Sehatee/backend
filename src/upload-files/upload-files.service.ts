import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
import * as streamifier from 'streamifier';
import * as sharp from 'sharp';

@Injectable()
export class UploadFilesService {
  async uploadFile(file?: any): Promise<CloudinaryResponse> {
    const buffer = file.buffer;
    let uploadBuffer = buffer;
    const isImage = file.mimetype ? file.mimetype.startsWith('image/') : true;

    if (isImage) {
      try {
        uploadBuffer = await sharp(buffer)
          .resize(300, 400, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }, // خلفية شفافة
          })
          .toBuffer();
      } catch (sharpError) {
        // في حال فشل sharp (مثلاً الملف ليس صورة حقيقية أو بصيغة غير مدعومة)، نمرر الـ buffer الأصلي
        console.warn(
          'Sharp failed to process image, uploading raw buffer instead:',
          sharpError,
        );
        uploadBuffer = buffer;
      }
    }

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sehatee',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(uploadBuffer).pipe(uploadStream);
    });
  }

  async uploadFiles(files: any[]): Promise<string[]> {
    const files_upload = await Promise.all(
      files.map((file) => this.uploadFile(file)),
    );
    const urls = files_upload.map((file) => {
      return file.secure_url;
    });
    return urls;
  }
  async uploadMessageFiles(
    files: any[],
  ): Promise<{ type: 'image' | 'document' | 'audio'; url: string }[]> {
    if (!files || files.length === 0) {
      return [];
    }

    // 1. معالجة ورفع كل ملف داخل المصفوفة بالتوازي
    const uploadPromises = files.map(async (fileInput) => {
      let buffer: Buffer;

      if (Buffer.isBuffer(fileInput)) {
        buffer = fileInput;
      } else if (fileInput?.buffer && Buffer.isBuffer(fileInput.buffer)) {
        buffer = fileInput.buffer;
      } else if (fileInput?.buffer) {
        buffer = Buffer.from(fileInput.buffer);
      } else {
        buffer = Buffer.from(fileInput);
      }

      if (!buffer || buffer.length === 0) {
        throw new Error('Invalid or empty buffer provided');
      }

      let uploadBuffer = buffer;

      // ب) محاولة معالجة الملف بواسطة Sharp (للصور فقط)
      try {
        uploadBuffer = await sharp(buffer)
          .resize(300, 400, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .png() // إجبار إخراج الصيغة كـ PNG لدعم الشفافية ومنع خطأ unsupported image format
          .toBuffer();
      } catch (sharpError) {
        // في حال كان الملف غير صورة (PDF, Audio, Raw File) نتجاهل Sharp ونمرر الـ Buffer الأصلي
        console.warn(
          'Sharp skipped/failed (not a valid image), uploading raw buffer:',
          sharpError?.message || sharpError,
        );
        uploadBuffer = buffer;
      }

      // ج) رفع الـ Buffer الناتج إلى Cloudinary
      const cloudinaryResponse = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'sehatee',
            resource_type: 'auto', // اكتشاف نوع الملف تلقائياً من Cloudinary
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        streamifier.createReadStream(uploadBuffer).pipe(uploadStream);
      });

      return cloudinaryResponse;
    });

    // 2. انتظار اكتمال رفع جميع الملفات
    const uploadedResults = await Promise.all(uploadPromises);

    // 3. تحويل استجابة Cloudinary إلى الشكل المطلوب (Type & URL)
    const urls = uploadedResults.map((file) => {
      let type: 'image' | 'document' | 'audio' = 'document';

      if (file.resource_type === 'image') {
        type = 'image';
      } else if (
        file.resource_type === 'video' ||
        file.format === 'mp3' ||
        file.format === 'wav' ||
        file.format === 'ogg'
      ) {
        type = 'audio';
      }

      return {
        type,
        url: file.secure_url,
      };
    });

    return urls;
  }
}
