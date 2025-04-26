/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [CloudinaryProvider, UploadFilesService],
  exports: [UploadFilesService],
})
export class UploadFilesModule {}
