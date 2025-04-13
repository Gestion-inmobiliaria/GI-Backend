import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BranchController } from './controllers/branch.controller';
import { BranchService } from './services/branch.service';
import { BranchEntity } from './entities/branch.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BranchEntity]),
    forwardRef(() => UsersModule)
  ],
  controllers: [BranchController],
  providers: [BranchService],
  exports: [BranchService, TypeOrmModule]
})
export class BranchesModule {} 