import { UserInfoDTO } from 'src/user/dto/user-info.dto';

export class AuthenticatedUserDTO {
  access_token: string;
  user: UserInfoDTO;
}
