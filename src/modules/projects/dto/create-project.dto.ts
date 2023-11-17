type Skill = {
  title: string;
};

export type CreateProjectDto = {
  title: string;
  description: string;
  snapshot: string;
  repositoryLink: string;
  lastUpdate: Date;
  userId: number;
  skills: Skill[];
};
