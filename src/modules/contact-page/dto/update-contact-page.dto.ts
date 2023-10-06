import { CreateContactPageDto } from './create-contact-page.dto';

export type UpdateContactPageDto = Partial<
  Omit<CreateContactPageDto, 'userId'>
>;
