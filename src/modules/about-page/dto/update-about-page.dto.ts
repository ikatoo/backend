import { CreateAboutPageDto } from './create-about-page.dto';

export type UpdateAboutPageDto = Partial<Omit<CreateAboutPageDto, 'userId'>>;
