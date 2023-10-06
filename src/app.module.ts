import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/db/prisma/prisma.module';
import { CryptoModule } from './infra/security/crypto/crypto.module';
import { UserModule } from './modules/user/user.module';
import { AboutPageModule } from './modules/about-page/about-page.module';
import { ContactPageModule } from './modules/contact-page/contact-page.module';

@Module({
  imports: [PrismaModule, CryptoModule, UserModule, AboutPageModule, ContactPageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
