export type CreateProjectDto = {
  title: string;
  description: string;
  snapshot: string;
  githubLink: string;
  lastUpdate: Date;
  userId: number;
};
