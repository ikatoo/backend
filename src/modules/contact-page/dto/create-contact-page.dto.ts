export type CreateContactPageDto = {
  title: string;
  description: string;
  localization: {
    lat: number;
    lng: number;
  };
  email: string;
  userId: number;
};
