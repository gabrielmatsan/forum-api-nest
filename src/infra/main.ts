import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  // pegando dependência do ConfigModule

  // const configService = app.get<ConfigService<Env, true>>(ConfigService) outra forma, sem o EnvService, que retira a necessidade de configurar o configService em todo lugar
  const envService = app.get(EnvService)
  // pegando a porta da variável de ambiente
  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
