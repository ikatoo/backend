type Skill = {
  title: string;
};

export type CreateProjectDto = {
  title: string;
  description: string;
  snapshot: string;
  repositoryLink: string;
  start: Date;
  lastUpdate: Date;
  userId: number;
  skills: Skill[];
};
