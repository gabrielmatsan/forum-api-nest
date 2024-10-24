import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

/**
 * Class Overview
 * The EnvService class is a NestJS injectable service that provides a way to access environment variables.
 *
 * Class Methods
 *
 * constructor: Initializes the EnvService instance with a ConfigService instance, which is used to manage environment variables.
 *
 * get(key: keyof Env): Retrieves the value of an environment variable specified by the key parameter, using the ConfigService instance.
 * The infer: true option allows the service to infer the type of the variable.
 */
@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  /**
   * Retrieves the value of an environment variable specified by the key parameter, using the ConfigService instance.
   * The infer: true option allows the service to infer the type of the variable.
   * @param key The key of the environment variable to retrieve.
   * @returns The value of the environment variable, or undefined if it does not exist.
   */
  get<T extends keyof Env>(key: T) {
    return this.configService.get(key, { infer: true })
  }
}
