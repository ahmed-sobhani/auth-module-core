import {
  Inject,
  Injectable,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserSignInDTO } from './dto/signin.dto';
import { HashingHelperService } from 'src/common/helper/hashing.helper.service';
import { UserDocument } from 'src/user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserInfoDTO } from 'src/user/dto/user-info.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthenticatedUserDTO } from './dto/authenticated-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashingHelperService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  /**
   * Login User by email & password
   * @param userData user email and password
   * @returns access_token and user info
   */
  async signIn(userData: UserSignInDTO): Promise<AuthenticatedUserDTO> {
    try {
      const user: UserDocument = await this.userService.findByEmail(
        userData.email,
      );

      if (
        !user ||
        !(await this.hashService.bcryptComparePassword(
          userData.password,
          user?.hashedPassword,
        ))
      )
        throw new UnauthorizedException();

      const payload = {
        email: user.email,
        fullName: user.fullName,
        sub: user.id,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
        user: UserInfoDTO.plainToInstance(user),
      };
    } catch (error) {
      this.logger.error(`${AuthService.name} - Error on SignIn: `, error);
      throw new Error(error);
    }
  }
}
