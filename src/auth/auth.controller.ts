import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignInDTO } from './dto/signin.dto';
import { Throttle } from '@nestjs/throttler';
import { UserInfoDTO } from 'src/user/dto/user-info.dto';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import { ResponseDTO } from 'src/common/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({})
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDTO<UserInfoDTO>,
  })
  async signIn(@Body() body: UserSignInDTO, @Res() response: Response) {
    const { access_token, user } = await this.authService.signIn(body);
    response.cookie('access_token', access_token);
    return response.status(HttpStatus.OK).send({
      data: user,
      success: true,
      message: 'user created successfully!',
    } as ResponseDTO<UserInfoDTO>);
  }
}
