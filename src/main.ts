import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import type { Env } from './env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  // pegando dependência do ConfigModule
  // const configService: ConfigService<Env,true> = app.get(ConfigService), outra forma de fazer config
  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  // pegando a porta da variável de ambiente
  const port = configService.get('PORT', { infer: true })

  await app.listen(port)
}
bootstrap()
