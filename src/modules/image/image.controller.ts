import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadSingleImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.imageService.uploadImage(file);
    return result;
  }

  @Delete()
  public async remove(@Body() { publicId }) {
    return await this.imageService.deleteImage(publicId);
  }
}
