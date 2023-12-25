import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  controllers: [ImageController],
  providers: [ImageService, CloudinaryProvider],
  exports: [ImageService, CloudinaryProvider],
})
export class ImageModule {}
