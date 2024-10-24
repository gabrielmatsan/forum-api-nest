import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './jwt-auth.guard'
import { EnvService } from '../env/env.service'
import { EnvModule } from '../env/env.module'

@Module({
  imports: [
    // O PassportModule é importado para utilizar a estratégia de autenticação com JWT no NestJS.
    PassportModule,

    // Configuração assíncrona do módulo JWT. O `registerAsync` é utilizado para configurar o JWT de forma assíncrona,
    // o que permite que os valores de configuração sejam injetados dinamicamente.
    JwtModule.registerAsync({
      imports: [EnvModule],
      // O serviço EnvService é injetado para buscar variáveis de ambiente que serão usadas para configurar o JWT.
      inject: [EnvService],

      // O atributo `global: true` garante que o JwtModule estará disponível globalmente no aplicativo.
      global: true,

      // A função `useFactory` é chamada para configurar o JWT com base nas variáveis de ambiente. Ela recebe o `ConfigService` injetado.
      useFactory(env: EnvService) {
        // Busca a chave privada (JWT_PRIVATE_KEY) das variáveis de ambiente usando o ConfigService.
        // A opção `infer: true` tenta inferir o tipo da variável.
        const privateKey = env.get('JWT_PRIVATE_KEY')

        // Busca a chave pública (JWT_PUBLIC_KEY) das variáveis de ambiente.
        const publicKey = env.get('JWT_PUBLIC_KEY')

        return {
          // A assinatura do JWT será feita utilizando o algoritmo RS256 (que utiliza chaves RSA).
          signOptions: { algorithm: 'RS256' },

          // A chave privada é convertida de uma string Base64 para um buffer antes de ser usada.
          privateKey: Buffer.from(privateKey, 'base64'),

          // A chave pública é utilizada diretamente, pois ela não precisa ser convertida.
          publicKey,
        }
      },
    }),
  ],
  providers: [
    JwtStrategy,
    EnvService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
// O módulo Auth é exportado para ser utilizado em outras partes da aplicação.
export class authModule {}
