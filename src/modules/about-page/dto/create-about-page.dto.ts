export type CreateAboutPageDto = {
  title: string;
  description: string;
  image: {
    imageUrl?: string;
    imageAlt?: string;
  };
  userId: number;
};
