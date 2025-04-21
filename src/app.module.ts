import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { StockModule } from './stocks/stock.module';
import { UserModule } from './users/user.module';
import { TransactionModule } from './transactions/transaction.module';
import { ProjectModule } from './project-tracking/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true, // ⚠️ Set to false in production
    }),
    UserModule, // ✅ FIXED: Include UserModule
    ProjectModule, // ✅ FIXED: Include ProjectModule
    ItemsModule, // ✅ FIXED: Include ItemsModule
    StockModule, // ✅ FIXED: Include StockModule
    TransactionModule,
  ],
})
export class AppModule {}
