import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { AuthMapper } from './mappers/usuarios.mapper'
import { JwtModule } from '@nestjs/jwt'
import * as process from 'process'
import { PassportModule } from '@nestjs/passport'
import { JwtAuthStrategy } from './strategies/jwt-strategy'

@Module({
  imports: [
    JwtModule.register({
      secret: Buffer.from(
        process.env.TOKEN_SECRET || 'contrasenasegura',
        'utf-8',
      ).toString('base64'),
      signOptions: {
        expiresIn: Number(process.env.TOKEN_EXPIRES) || 3600,
        algorithm: 'HS512',
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper, JwtAuthStrategy],
})
export class AuthModule {}
