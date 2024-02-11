import { Logger, Module } from '@nestjs/common'
import * as process from 'process'
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import * as path from 'path'

@Module({
  imports: [
    TypeOrmCoreModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        autoLoadEntities: true,
        entities: [
          path.join(__dirname),
          '../../dist/rest/**/*.entity{.ts,.js}',
        ],
        synchronize: process.env.NODE_ENV === 'dev',
        logging: process.env.NODE_ENV === 'dev',
        retryAttempts: 10,
        connectionFactory: (connection) => {
          Logger.log('Database connection established', 'DatabaseModule')
          return connection
        },
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
        retryAttempts: 10,
        connectionFactory: (connection) => {
          Logger.log('Database connection established', 'DatabaseModule')
          return connection
        },
      }),
    }),
  ],
  exports: [TypeOrmCoreModule],
})
export class DatabaseModule {}
