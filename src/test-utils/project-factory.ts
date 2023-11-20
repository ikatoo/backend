import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateProjectDto } from 'src/modules/projects/dto/create-project.dto';

const pgp = new PgPromiseService();

const mockedProject: Omit<CreateProjectDto, 'skills' | 'userId'> = {
  title: 'Mocked Title',
  description: 'Mocked description',
  repositoryLink: 'https://mocked.link.com/repo',
  start: new Date('2021/12/12'),
  lastUpdate: new Date('2021/12/12'),
  snapshot: 'https://mocked.com/snapshot',
};

export const projectFactory = async () =>
  await pgp.db.oneOrNone(
    `insert into projects(
        title,
        description,
        snapshot,
        repository_link,
        start,
        last_update
    ) values($1) returning *;`,
    [
      Object.values(mockedProject)
        .map((value) => `'${value}'`)
        .toString(),
    ],
  );
