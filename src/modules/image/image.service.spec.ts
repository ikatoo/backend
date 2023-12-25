import { Test, TestingModule } from '@nestjs/testing';
import { v2 } from 'cloudinary';
import { AppModule } from 'src/app.module';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let imageService: ImageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageService],
      imports: [AppModule],
    }).compile();

    imageService = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(imageService).toBeDefined();
  });

  it('should upload a file and return a url of the file', async () => {
    const mockedFile = {
      size: 1024,
    } as Express.Multer.File;
    const uploadSpy = jest.spyOn(v2.uploader, 'upload_stream');

    await imageService.uploadImage(mockedFile);

    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });

  // it('should get url of the image by public id', async () => {
  //   const expected = 'https://cloudinary.com/folder/image.png';
  //   const public_id = 'folder/image.png';
  //   const urlSpy = jest.spyOn(v2, 'url').mockResolvedValue(expected);

  //   const result = await imageService.getImage(public_id);

  //   expect(result).toEqual(expected);
  //   expect(urlSpy).toHaveBeenCalledTimes(1);
  //   expect(urlSpy).toHaveBeenCalledWith(public_id, {
  //     use_filename: true,
  //     unique_filename: false,
  //     overwrite: true,
  //     folder: CLOUDINARY_FOLDER,
  //   });
  // });

  // it('should delete the image by public id', async () => {
  //   const expected = { result: 'ok' };
  //   const public_id = 'folder/image.png';
  //   const destroySpy = jest
  //     .spyOn(v2.uploader, 'destroy')
  //     .mockResolvedValue(expected);

  //   const result = await imageService.deleteImage(public_id);

  //   expect(result).toEqual(expected);
  //   expect(destroySpy).toHaveBeenCalledTimes(1);
  //   expect(destroySpy).toHaveBeenCalledWith(public_id, {
  //     use_filename: true,
  //     unique_filename: false,
  //     overwrite: true,
  //     folder: CLOUDINARY_FOLDER,
  //   });
  // });
});
