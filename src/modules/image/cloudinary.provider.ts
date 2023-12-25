import { v2 as cloudinary } from 'cloudinary';
import {
  CLOUDINARY,
  CLOUDINARY_APIKEY,
  CLOUDINARY_APISECRET,
  CLOUDINARY_CLOUDNAME,
} from 'src/constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return cloudinary.config({
      cloud_name: CLOUDINARY_CLOUDNAME,
      api_key: CLOUDINARY_APIKEY,
      api_secret: CLOUDINARY_APISECRET,
      secure: true,
    });
  },
};
