import { Test, TestingModule } from '@nestjs/testing';
import { v2 } from 'cloudinary';
import { fs } from 'mz';
import { AppModule } from 'src/app.module';
import { CLOUDINARY_FOLDER } from 'src/constants';
import { ImageService } from './image.service';

jest.mock('cloudinary');

describe('ImageService', () => {
  let imageService: ImageService;
  const options = {
    unique_filename: true,
    use_filename: false,
    folder: CLOUDINARY_FOLDER,
  };

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
    (v2.uploader.upload_stream as jest.Mock).mockImplementation(
      (_options: any, callback: any) => {
        const fakeResult = { public_id: 'fakePublicId', secure_url: 'fakeUrl' };
        callback(null, fakeResult);
      },
    );

    const testImagePath = `${__dirname}/../../../test/test-image.png`;
    const buffer = await fs.readFile(testImagePath);
    const result = await imageService.uploadImage(buffer);

    expect(v2.uploader.upload_stream).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ url: 'fakeUrl', publicId: 'fakePublicId' });
  });

  it('should get url of the image by public id', async () => {
    const expected = 'https://cloudinary.com/folder/image.png';
    const public_id = 'folder/image.png';
    const spy = jest.spyOn(v2, 'url').mockResolvedValue(expected as never);

    const result = await imageService.getImage(public_id);

    expect(result).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(public_id, options);
  });

  it('should delete the image by public id', async () => {
    const expected = { result: 'ok' };
    const public_id = 'folder/image.png';
    const spy = jest.spyOn(v2.uploader, 'destroy').mockResolvedValue(expected);

    const result = await imageService.deleteImage(public_id);

    expect(result).toEqual(expected);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(public_id, options);
  });
});
