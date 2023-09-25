import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormConfig } from 'src/_common/typeorm.config';
import { ViewModule } from './view/view.module';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { CategoryModule } from './category/category.module';
import { AdminMemberModule } from './admin-member/admin-member.module';
import { BoardModule } from './board/board.module';
import { AdminBoardModule } from './admin-board/admin-board.module';
import { MainDocumentModule } from './main-document/main-document.module';
import { CommentModule } from './comment/comment.module';
import { SlackModule } from './slack/slack.module';
import { UploadModule } from './upload/upload.module';
import { ProductModule } from './product/product.module';
import { IdentityModule } from './identity/identity.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { JwtModule } from '@nestjs/jwt';
import { SearchModule } from './search/search.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminMainboardModule } from './admin-mainboard/admin-mainboard.module';
import { PickModule } from './pick/pick.module';
import { PaymembercheckModule } from './paymembercheck/paymembercheck.module';
import * as process from 'process';
import { HanbyeolBankModule } from './hanbyeol-bank/hanbyeol-bank.module';
import { ReViewModule } from './re-view/review.module';
import { TradesModule } from './trades/trades.module';
import { AdminProductModule } from './admin-product/admin-product.module';
import { EasyPasswordModule } from './easy-password/easy-password.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          store: redisStore,
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          password: process.env.REDIS_PASSWORD,
        };
      },
    }),
    JwtModule,
    ViewModule,
    MemberModule,
    AuthModule,
    CategoryModule,
    AdminMemberModule,
    BoardModule,
    AdminBoardModule,
    MainDocumentModule,
    CommentModule,
    SlackModule,
    UploadModule,
    ProductModule,
    IdentityModule,
    SearchModule,
    AdminMainboardModule,
    PickModule,
    PaymembercheckModule,
    HanbyeolBankModule,
    ReViewModule,
    TradesModule,
    AdminProductModule,
    EasyPasswordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
