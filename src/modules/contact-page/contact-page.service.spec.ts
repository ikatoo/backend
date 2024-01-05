import { Test, TestingModule } from '@nestjs/testing';
import { randomBytes, randomInt } from 'crypto';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { contactPageFactory } from 'src/test-utils/contact_page-factory';
import { userFactory } from 'src/test-utils/user-factory';
import { ContactPageService } from './contact-page.service';
import { CreateContactPageDto } from './dto/create-contact-page.dto';

describe('ContactPageService', () => {
  let contactPageService: ContactPageService;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactPageService, PgPromiseService],
    }).compile();

    contactPageService = module.get<ContactPageService>(ContactPageService);
    pgp = module.get<PgPromiseService>(PgPromiseService);
  });

  it('should be defined', () => {
    expect(contactPageService).toBeDefined();
  });

  it('should get contact-page by user-id', async () => {
    const createdUser = await userFactory();
    const createdPage = await contactPageFactory(createdUser.id).then(
      ({ user_id: userId, ...page }) => ({
        ...page,
        userId,
      }),
    );

    const result = await contactPageService.findByUser(createdUser.id);

    expect(result).toEqual(createdPage);
  });

  it('should create contact-page', async () => {
    const createdUser = await userFactory();
    const randomTestId = randomBytes(10).toString('hex');
    const randomNumber = randomInt(10, 100).toLocaleString('en-US', {
      minimumIntegerDigits: 3,
      useGrouping: false,
    });
    const mockedData: CreateContactPageDto = {
      title: `${randomTestId} title`,
      description: `${randomTestId} description`,
      email: `${randomTestId}@email.com`,
      localization: {
        lat: +`-22.4191${randomNumber}`,
        lng: +`-46.8320${randomNumber}`,
      },
      userId: createdUser.id,
    };

    await contactPageService.create(mockedData);

    const result = await pgp.db
      .one(
        `select
        title,
        description,
        email,
        localization,
        user_id as "userId"
      from contact_pages
      where user_id=$1;`,
        [createdUser.id],
      )
      .then(({ localization, ...page }) => ({
        ...page,
        localization: {
          lat: localization.x,
          lng: localization.y,
        },
      }));

    expect(result).toEqual(mockedData);
  });

  it('should update a existent contact-page', async () => {
    const createdUser = await userFactory();
    const randomTestId = randomBytes(10).toString('hex');
    const randomNumber = randomInt(10, 100).toLocaleString('en-US', {
      minimumIntegerDigits: 3,
      useGrouping: false,
    });
    const existentPage = await contactPageFactory(createdUser.id).then(
      ({ user_id: userId, ...page }) => ({
        ...page,
        userId,
      }),
    );
    const newData: Partial<CreateContactPageDto> = {
      description: `${randomTestId} description`,
      email: `${randomTestId}@email.com`,
      localization: {
        lat: +`-22.4191${randomNumber}`,
        lng: +`-46.8320${randomNumber}`,
      },
    };
    const expected = {
      ...existentPage,
      ...newData,
    };

    await contactPageService.update(createdUser.id, newData);

    const updatedPage = await pgp.db
      .one('select * from contact_pages where user_id=$1;', [createdUser.id])
      .then(({ localization, user_id: userId, ...page }) => ({
        ...page,
        localization: {
          lat: localization.x,
          lng: localization.y,
        },
        userId,
      }));

    expect(updatedPage).toEqual(expected);
  });

  it('should delete a existent contact-page', async () => {
    const createdUser = await userFactory();
    const existentPage = await contactPageFactory(createdUser.id);
    await contactPageService.remove(createdUser.id);

    const result = await pgp.db.oneOrNone(
      'select * from contact_pages where user_id=$1 and id=$2;',
      [createdUser.id, existentPage.id],
    );

    expect(result).toBeNull();
  });
});
