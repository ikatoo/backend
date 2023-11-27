import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateProjectDto } from 'src/modules/projects/dto/create-project.dto';

const pgp = new PgPromiseService();

export const mockedProject: Omit<CreateProjectDto, 'skills' | 'userId'> = {
  title: 'Mocked Title',
  description: 'Mocked description',
  snapshot: 'https://mocked.com/snapshot',
  repositoryLink: 'https://mocked.link.com/repo',
  start: new Date('2021/12/12'),
  lastUpdate: new Date('2021/12/12'),
};

export const projectFactory = async (modifier?: () => void) => {
  !!modifier && modifier();

  const projectExists = await pgp.db.oneOrNone(
    'select * from projects where title=$1;',
    [mockedProject.title],
  );
  if (!!projectExists)
    await pgp.db.none('delete from projects where id=$1;', [projectExists.id]);

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
