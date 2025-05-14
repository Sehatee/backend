import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary.response';
import * as streamifier from 'streamifier';
import * as sharp from 'sharp';

@Injectable()
export class UploadFilesService {
  async uploadFile(file: any): Promise<CloudinaryResponse> {
    // Resize image before upload
    const resizedBuffer = await sharp(file.buffer)
      .resize(300, 400, {
        fit: 'contain',
        background: 'transparent',
      })
      .toBuffer();

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'sehatee',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(resizedBuffer).pipe(uploadStream);
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
}
