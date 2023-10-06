import { CreateProjectDto } from './create-project.dto';

export type UpdateProjectDto = Partial<Omit<CreateProjectDto, 'userId'>>;
