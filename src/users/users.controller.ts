import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { AllowAnonymous } from 'src/auth/allowAll.metas';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  @AllowAnonymous()
  async login(
    @Body('username') username: string,
    @Body('number') number: string,
  ): Promise<any> {
    if (!username || !number) {
      throw new HttpException(
        'Username and phone number are required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.usersService.login(username, number);
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
