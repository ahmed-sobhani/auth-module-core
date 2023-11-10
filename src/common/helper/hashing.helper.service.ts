import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class HashingHelperService {
  constructor() {}

  /**
   * Generate Random Salt
   * @returns generated random salt string
   */
  async randomSalt(): Promise<string> {
    return genSalt(16);
  }

  /**
   *  Bycrypt Hash Password
   * @param passwordString Password String
   * @param salt  Salt
   * @returns Hashed Password String
   */
  async bcryptHashPassword(password: string, salt: string): Promise<string> {
    return hash(password, salt);
  }

  /**
   * Compare Password And Hashed Password
   * @param password Password String
   * @param hashed Hashed Password
   * @returns If password and hashedPassword are same, return true. else false
   */
  async bcryptComparePassword(
    password: string,
    hashed: string,
  ): Promise<boolean> {
    return compare(password, hashed);
  }

  /**
   * Hash a password
   * @param password Password String
   * @returns hashed password string
   */
  async hashPassword(password: string) {
    const salt: string = await this.randomSalt();
    return await this.bcryptHashPassword(password, salt);
  }
}
