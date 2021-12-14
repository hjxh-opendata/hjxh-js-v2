import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { UsersService } from './service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { DEFAULT_USER_ID } from '../const';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async queryAllUsers() {
    return this.usersService.query();
  }

  @Get('goods')
  // refer: - [javascript - NestJS swagger generated docs do not show param information - Stack Overflow](https://stackoverflow.com/questions/65711755/nestjs-swagger-generated-docs-do-not-show-param-information)
  @ApiQuery({ name: 'userId', description: '用户ID', example: DEFAULT_USER_ID })
  async queryGoodsListOfUsers(
    // refer: 管道 - https://docs.nestjs.cn/7/pipes?id=%e8%bd%ac%e6%8d%a2%e7%ae%a1%e9%81%93
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.usersService.queryGoodsListOfUser(userId);
  }
}
