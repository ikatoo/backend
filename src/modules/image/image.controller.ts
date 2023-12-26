import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  public async getImage(@Body() { publicId }) {
    return await this.imageService.getImage(publicId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const result = await this.imageService.uploadImage(file.buffer);
    return result;
  }

  @Delete()
  public async remove(@Body() { publicId }) {
    return await this.imageService.deleteImage(publicId);
  }
}
