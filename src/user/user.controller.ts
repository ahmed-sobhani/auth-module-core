import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UserInfoDTO } from './dto/user-info.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseDTO } from 'src/common/dto/response.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('sign-up')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'SignUp was successfully',
    type: ResponseDTO<UserInfoDTO>,
  })
  async signUp(@Body() body: CreateUserDTO, @Res() res: Response) {
    const result = await this.userService.create(body);

    if (typeof result == 'string') {
      return res.status(HttpStatus.FORBIDDEN).send({
        data: null,
        success: false,
        message: result,
      } as ResponseDTO<UserInfoDTO>);
    }

    const user = UserInfoDTO.plainToInstance(result);
    const payload = {
      email: user.email,
      fullName: user.fullName,
      sub: user._id,
    };
    const access_token = await this.jwtService.signAsync(payload);
    res.cookie('access_token', access_token);

    return res.status(HttpStatus.CREATED).send({
      data: user,
      success: true,
      message: 'user created successfully!',
    } as ResponseDTO<UserInfoDTO>);
  }
}
