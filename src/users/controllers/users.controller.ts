import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { ResponseMessage } from 'src/common/interfaces';
import { QueryDto } from 'src/common/dto/query.dto';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { PermissionAccess } from '../decorators/permissions.decorator';
import { PERMISSION } from 'src/users/constants/permission.constant';
import { ORDER_ENUM } from 'src/common/constants';



@ApiTags('Users')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}
  @PermissionAccess(PERMISSION.USER)
  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.userService.create(createUserDto),
    };
  }

  @PermissionAccess(PERMISSION.USER, PERMISSION.USER_SHOW)
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const { countData, data } = await this.userService.findAll(queryDto);
    return {
      statusCode: 200,
      data,
      countData,
    };
  }

  @PermissionAccess(PERMISSION.USER, PERMISSION.USER_SHOW)
  @ApiParam({ name: 'userId', type: 'string' })
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.userService.findOne(userId),
    };
  }

  @PermissionAccess(PERMISSION.USER)
  @ApiParam({ name: 'userId', type: 'string' })
  @Patch(':userId')
  public async update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.userService.update(userId, updateUserDto),
    };
  }

  @PermissionAccess(PERMISSION.USER)
  @ApiParam({ name: 'userId', type: 'string' })
  @Delete(':userId')
  public async remove(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ResponseMessage> {
    return await this.userService.delete(userId);
  }
}
