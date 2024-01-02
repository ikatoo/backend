import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { AppModule } from 'src/app.module';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

describe('SkillsController', () => {
  let skillController: SkillsController;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsController],
      providers: [SkillsService, PgPromiseService],
      imports: [AppModule],
    }).compile();

    skillController = module.get<SkillsController>(SkillsController);
    pgp = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(skillController).toBeDefined();
  });

  it('should create skill', async () => {
    const randomTestId = randomBytes(3).toString('hex');
    const mockSkill: CreateSkillDto = {
      title: `title ${randomTestId}`,
    };

    const body = await skillController.create(mockSkill);
    const createdSkill = await pgp.db.one(
      'select * from skills where title=$1',
      [mockSkill.title],
    );

    expect(body).toEqual({ id: createdSkill.id });
    expect(createdSkill).toEqual({
      id: createdSkill.id,
      title: mockSkill.title,
    });
  });
});
