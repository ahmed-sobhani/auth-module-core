import { MongooseModuleOptions } from '@nestjs/mongoose';
require('dotenv').config();

/**
 * Common configuration Service
 */
class ConfigService {
  /**
   * Constructor of Configuration Service
   * @param env Array of required enviornment values
   */
  constructor(private env: { [k: string]: string | undefined }) {}

  /**
   * Get value of environment key's
   * @param key key of environment
   * @param throwOnMissing If it was true, it is required to run app
   * @returns The value of env
   */
  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  /**
   * get env key value
   * @param key env KEY
   * @param throwOnMissing Is Requeired?
   * @returns value of env parameter
   */
  public get<T>(key: string, throwOnMissing = false): T {
    return this.getValue(key, throwOnMissing) as unknown as T;
  }

  /**
   * Get Mongo URL Address
   * @returns MongoDB URI
   */
  public getMongoDB_URL() {
    const baseUrl: string = `${
      this.getValue('MONGO_HOST', false) || 'localhost'
    }:${this.getValue('MONGO_PORT', false) || '27017'}`;
    const databaseName = this.getValue('DATABASE_NAME', true);
    const srv = this.getValue('MONGO_SRV', false) || false;

    let uri: string = `mongodb${srv ? '+srv' : ''}://`;
    if (
      this.getValue('DATABASE_USER', false) &&
      this.getValue('DATABASE_PASSWORD', false)
    ) {
      uri = `${uri}${this.getValue('DATABASE_USER', false)}:${this.getValue(
        'DATABASE_PASSWORD',
        false,
      )}@`;
    }

    uri = `${uri}${baseUrl}/${databaseName}`;
    return uri;
  }

  /**
   * Get MongoDB Connection Options
   * @returns MongoDB Connection Options
   */
  public getMongoDBOptions(): MongooseModuleOptions {
    const uri: string = this.getMongoDB_URL();
    const admin = this.getValue('MONGO_ADMIN', false) || 'false';
    console.log(`Mongo uri: ${uri}`);
    const mongooseOptions: MongooseModuleOptions = {
      uri,
    };

    if (admin.toLowerCase() === 'true') {
      mongooseOptions.authSource = 'admin';
      mongooseOptions.ssl = true;
    }

    return mongooseOptions;
  }

  /**
   * Check required key's are exist. If not, app does not run
   * @param keys List of required key's
   * @returns
   */
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  /**
   * Get Port
   * @returns Port value of service
   */
  public getPort() {
    return parseInt(this.getValue('PORT', true));
  }

  /**
   * Production Mode
   * @returns true/false
   */
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  /**
   * Get Token Expire In value
   * @returns TOKEN_EXPIRE_IN environment value
   */
  getTokenExpireIn = () => this.getValue('TOKEN_EXPIRE_IN', true);

  /**
   * Get JWT Token value
   * @returns JWT_SECRET environment value
   */
  getJWTSecret = () => this.getValue('JWT_SECRET', true);
}

/**
 * An object of Configuration
 */
const configService = new ConfigService(process.env).ensureValues([
  'PORT',
  'HOST',
]);

export { configService };
