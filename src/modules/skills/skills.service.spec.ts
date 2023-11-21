import { Test, TestingModule } from '@nestjs/testing';
import { SkillsService } from './skills.service';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { userFactory } from 'src/test-utils/user-factory';
import { mockedSkill, skillFactory } from 'src/test-utils/skill-factory';
import { skillOnUserProjectFactory } from 'src/test-utils/skill_on_user_project-factory';
import { projectFactory } from 'src/test-utils/project-factory';
import { projectOnUserFactory } from 'src/test-utils/project_on_user-factory';

describe('SkillsService', () => {
  let skillsService: SkillsService;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillsService, PgPromiseService],
    }).compile();

    skillsService = module.get<SkillsService>(SkillsService);
    pgp = module.get<PgPromiseService>(PgPromiseService);

    await pgp.db.none('delete from skills;');
    await pgp.db.none('delete from skills_on_users;');
    await pgp.db.none('delete from users;');
  });

  it('should be defined', () => {
    expect(skillsService).toBeDefined();
  });

  it('should create a skill relationated a user project', async () => {
    const { id: userId } = await userFactory();
    const mock = { title: 'Skill title', userId };

    await skillsService.create(mock);
    const createdSkill = await pgp.db.many(
      'select skills.id as id, skills.title as title, sou.user_id as user_id from skills, skills_on_users as sou where sou.skill_id=skills.id and sou.user_id=$1',
      [userId],
    );
    const expected = {
      id: createdSkill[0].id,
      title: mock.title,
      user_id: userId,
    };

    expect(createdSkill[0]).toEqual(expected);
  });

  it('should get skill relationed with a user project', async () => {
    const { id: userId } = await userFactory();
    const { id: projectId } = await projectFactory();
    const { id: projectOnUserId } = await projectOnUserFactory(
      projectId,
      userId,
    );
    const { id: skillId } = await skillFactory();
    await skillOnUserProjectFactory(skillId, projectOnUserId);

    const skills = await skillsService.findByUser(userId);
    const expected = [{ id: skills[0].id, ...mockedSkill }];

    expect(skills).toEqual(expected);
  });

  it('should update skill title', async () => {
    const newTitle = 'New Title';
    const { id: userId } = await userFactory();
    const { id: skillId, title: oldTitle } = await skillFactory();

    await skillsService.update(skillId, newTitle);
    const updatedSkill = await pgp.db.many(
      'select skills.id as id, skills.title as title, sou.user_id as user_id from skills, skills_on_users as sou where sou.skill_id=skills.id and sou.user_id=$1',
      [userId],
    );

    expect(oldTitle).not.toEqual(updatedSkill[0].title);
    expect(updatedSkill[0].title).toEqual(newTitle);
  });

  it('should remove the skill of the user project', async () => {
    const { id: userId } = await userFactory();
    const { id: skillId } = await skillFactory();

    await skillsService.remove(skillId);

    const removedSkill = await pgp.db.oneOrNone(
      'select * from skills where id=$1',
      [skillId],
    );

    expect(removedSkill).toBeNull();
  });

  it('should remove skill of the user but not delete the skill', async () => {
    const { id: userId } = await userFactory();
    const { id: skillId } = await skillFactory();
    await skillOnUserFactory(+userId, +skillId);

    await skillsService.removeOfTheUser(userId, skillId);

    const removedSkill = await pgp.db.oneOrNone(
      `select 
        skills.id as id,
        skills.title as title,
        sou.user_id as userId
      from skills, skills_on_users as sou
      where sou.skill_id=$1 and sou.user_id=$2`,
      [skillId, userId],
    );

    expect(removedSkill).toBeNull();
  });
});
