import { Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary';
import { CLOUDINARY_FOLDER } from 'src/constants';

type Image = {
  url: string;
  publicId: string;
};

@Injectable()
export class ImageService {
  private readonly options: UploadApiOptions = {
    unique_filename: true,
    use_filename: false,
    folder: CLOUDINARY_FOLDER,
  };

  async uploadImage(buffer: Buffer): Promise<Image> {
    const { secure_url: url, public_id: publicId } =
      await new Promise<UploadApiResponse>((resolve, reject) =>
        v2.uploader
          .upload_stream(this.options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
          })
          .end(buffer),
      );

    return {
      url,
      publicId,
    };
  }

  async deleteImage(publicId: string): Promise<{ result: 'ok' | unknown }> {
    const result = Promise.resolve(v2.uploader.destroy(publicId, this.options));
    return result;
  }

  async getImage(publicId: string): Promise<string> {
    const result = Promise.resolve(v2.url(publicId, this.options));
    return result;
  }
}
