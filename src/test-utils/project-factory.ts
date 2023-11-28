import { randomBytes, randomInt } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateProjectDto } from 'src/modules/projects/dto/create-project.dto';

const pgp = new PgPromiseService();

export const projectFactory = async () => {
  const randomTestId = randomBytes(10).toString('hex');
  const start = new Date(`2021/${randomInt(1, 13)}/${randomInt(1, 28)}`);
  const lastUpdate = new Date();
  lastUpdate.setDate(start.getDate() + randomInt(500));

  const mockedProject: Omit<CreateProjectDto, 'skills' | 'userId'> = {
    title: `Mocked Title ${randomTestId}`,
    description: `Mocked description ${randomTestId}`,
    snapshot: `https://mocked.com/snapshot/${randomTestId}.png`,
    repositoryLink: `https://mocked.link.com/repo/${randomTestId}`,
    start,
    lastUpdate,
  };

  const remmapedMock = {
    ...mockedProject,
    start: mockedProject.start.toISOString(),
    lastUpdate: mockedProject.lastUpdate.toISOString(),
  };

  return await pgp.db.oneOrNone(
    `insert into projects(
        title,
        description,
        snapshot,
        repository_link,
        start,
        last_update
    ) values($1:raw) returning *;`,
    [
      Object.values(remmapedMock)
        .map((value) => `'${value}'`)
        .toString(),
    ],
  );
};
