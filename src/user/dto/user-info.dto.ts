import { plainToInstance, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDTO {
  static plainToInstance(object: any) {
    return plainToInstance(UserInfoDTO, object, {
      excludeExtraneousValues: true,
    });
  }

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  fullName: string;

  @Expose()
  @ApiProperty()
  _id: string;
}
