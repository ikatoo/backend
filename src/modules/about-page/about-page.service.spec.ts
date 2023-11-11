import { Test, TestingModule } from '@nestjs/testing';
import { PgPromiseService } from 'src/infra/db/pg-promise/pg-promise.service';
import { AboutPageService } from './about-page.service';

describe('AboutPageService', () => {
  const userMock = {
    name: 'Teste',
    email: 'teste@teste.com',
    password: 'teste',
  };
  const aboutPageMock = {
    title: 'Olá. Bem vindo❗',
    description:
      '<p>Me chamo Milton Carlos Katoo, moro em Itapira, interior de São Paulo/Brasil. Pai de uma princesa e filho de excelente cozinheira Italiana e um saldoso Japonês faz tudo, sou um desenvolvedor full-stack que ama programação e desenvolvimento de software afim de melhorar a vida das pessoas.</p><p>Pessoa bem organizada, solucionador de problemas, funcionário independente com alta atenção aos detalhes. Gosto de animes, mangas, games, séries de TV e filmes. Pai orgulhoso de uma princesa, sou nascido em 1979 e sou innteressado em todo o espectro de programação.</p><p>🎉Vamos fazer algo especial.😄</p>',
    image: {
      url: '/public/teste.img',
      alt: 'imagem de teste',
    },
  };

  let aboutPageService: AboutPageService;
  let pgp: PgPromiseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AboutPageService, PgPromiseService],
    }).compile();

    aboutPageService = module.get<AboutPageService>(AboutPageService);
    pgp = module.get<PgPromiseService>(PgPromiseService);
    await pgp.db.none('delete from users;');
    await pgp.db.none('delete from about_pages;');
  });

  it('should be defined', () => {
    expect(aboutPageService).toBeDefined();
  });

  it('should get about page', async () => {
    const { id: userId } = await pgp.db.oneOrNone(
      `insert into users(
        name,
        email,
        hash_password
      ) values($1, $2, $3)
      returning id;`,
      [userMock.name, userMock.email, userMock.password],
    );
    const createdAboutPage = await pgp.db.oneOrNone(
      `insert into about_pages(
        title,	
        description,	
        image_url,	
        image_alt,	
        user_id
      ) values($1, $2, $3, $4, $5)
      returning id;`,
      [
        aboutPageMock.title,
        aboutPageMock.description,
        aboutPageMock.image.url,
        aboutPageMock.image.alt,
        userId,
      ],
    );
    const page = await aboutPageService.findByUser(userId);
    const expected = {
      id: createdAboutPage.id,
      title: aboutPageMock.title,
      description: aboutPageMock.description,
      image: {
        url: aboutPageMock.image.url,
        alt: aboutPageMock.image.alt,
      },
    };

    expect(page).toEqual(expected);
  });

  it('should create the about page', async () => {
    const { id: userId } = await pgp.db.one<{ id: number }>(
      'insert into users(name, email, hash_password) values($1, $2, $3) returning id;',
      Object.values(userMock),
    );
    const {
      image: { alt: imageAlt, url: imageUrl },
      ...data
    } = aboutPageMock;
    await aboutPageService.create({
      ...data,
      image: {
        imageUrl,
        imageAlt,
      },
      userId,
    });
  });
});
