import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDTO } from './dto/create-user.dto';
import { HashingHelperService } from 'src/common/helper/hashing.helper.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashingService: HashingHelperService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  /**
   * Finding user with email
   * @param email User Email
   * @returns User Model
   */
  async findByEmail(email: string): Promise<UserDocument | undefined> {
    return await this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  /**
   * Creating a new user
   * @param createUserDto User DTO
   * @returns created user
   */
  async create(createUserDto: CreateUserDTO): Promise<User | string> {
    try {
      if (await this.findByEmail(createUserDto.email)) {
        return 'Email exist!';
      }

      const hashedPassword = await this.hashingService.hashPassword(
        createUserDto.password,
      );
      const newUser = new this.userModel({ ...createUserDto, hashedPassword });
      return await newUser.save();
    } catch (error) {
      this.logger.error(`${UserService.name} - Error on create user: `, error);
      throw new Error(`${error}`);
    }
  }

  /**
   * Finding a user by Id
   * @param id User Id
   * @returns User info
   */
  async findById(id: ObjectId): Promise<User | undefined> {
    return await this.userModel.findById(id).exec();
  }
}
