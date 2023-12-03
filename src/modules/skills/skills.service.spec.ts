import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { userFactory } from 'src/test-utils/user-factory';
import { mockedSkill, skillFactory } from 'src/test-utils/skill-factory';
import { skillOnUserProjectFactory } from 'src/test-utils/skill_on_user_project-factory';
import { projectFactory } from 'src/test-utils/project-factory';
import { projectOnUserFactory } from 'src/test-utils/project_on_user-factory';
import { randomBytes } from 'crypto';

describe('SkillsService', () => {
  let skillsService: SkillsService;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillsService, PgPromiseService],
    }).compile();

    skillsService = module.get<SkillsService>(SkillsService);
    pgp = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(skillsService).toBeDefined();
  });

  it('should create a skill', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const mock = { title: `Skill title ${randomTestId}` };

    await skillsService.create(mock);
    const createdSkill = await pgp.db.many(
      `select
        skills.id as id,
        skills.title as title
      from
        skills
      where
        title=$1
      ;`,
      [mock.title],
    );
    const expected = {
      id: createdSkill[0].id,
      title: mock.title,
    };

    expect(createdSkill[0]).toEqual(expected);
  });

  it('should get skill relationed with a user project', async () => {
    const { id: userId } = await userFactory();
    const { id: projectId } = await projectFactory();
    const { id: userProjectId } = await projectOnUserFactory(projectId, userId);
    const { id: skillId } = await skillFactory();
    await skillOnUserProjectFactory(skillId, userProjectId);

    const skills = await skillsService.findByUser(userId);
    const expected = [{ id: skills[0].id, ...mockedSkill }];

    expect(skills).toEqual(expected);
  });

  it('should update skill title', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const newTitle = `New Title ${randomTestId}`;

    const { id: userId } = await userFactory();
    const { id: skillId, title: oldTitle } = await skillFactory();
    const { id: projectId } = await projectFactory();
    const { id: userProjectId } = await projectOnUserFactory(projectId, userId);
    await skillOnUserProjectFactory(skillId, userProjectId);

    await skillsService.update(skillId, newTitle);
    const updatedSkill = await pgp.db.many(
      `select
        skills.title as title
      from
        skills,
        skills_on_users_projects as soup,
        projects_on_users as pou
      where
        soup.skill_id=skills.id and
        soup.project_on_user_id=pou.id and
        pou.user_id=$1
      ;`,
      [userId],
    );

    expect(oldTitle).not.toEqual(updatedSkill[0].title);
    expect(updatedSkill[0].title).toEqual(newTitle);
  });

  it('should remove skill of the user project but not delete the skill', async () => {
    const { id: userId } = await userFactory();
    const { id: skillId, title } = await skillFactory();
    const { id: projectId } = await projectFactory();
    const { id: userProjectId } = await projectOnUserFactory(projectId, userId);
    await skillOnUserProjectFactory(skillId, userProjectId);

    await skillsService.removeOfTheUserProject(userProjectId, skillId);

    const removedSkillOnProject = await pgp.db.oneOrNone(
      `select
        skills.id as id,
        skills.title as title
      from
        skills,
        skills_on_users_projects as soup,
        projects_on_users as pou
      where soup.skill_id=$1 and pou.user_id=$2`,
      [skillId, userId],
    );
    const skill = await pgp.db.one('select * from skills where id=$1', [
      skillId,
    ]);

    expect(removedSkillOnProject).toBeNull();
    expect(skill).toBeDefined();
    expect(skill.title).toEqual(title);
  });
});
