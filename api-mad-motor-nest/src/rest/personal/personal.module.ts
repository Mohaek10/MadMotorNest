import { Module } from '@nestjs/common'
import { PersonalService } from './personal.service'
import { PersonalController } from './personal.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Personal } from './entities/personal.entity'
import { CacheModule } from '@nestjs/cache-manager'

@Module({
  imports: [TypeOrmModule.forFeature([Personal]), CacheModule.register()],
  controllers: [PersonalController],
  providers: [PersonalService],
})
export class PersonalModule {}
