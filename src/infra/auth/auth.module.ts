import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Env } from '@/infra/env'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    // O PassportModule é importado para utilizar a estratégia de autenticação com JWT no NestJS.
    PassportModule,

    // Configuração assíncrona do módulo JWT. O `registerAsync` é utilizado para configurar o JWT de forma assíncrona,
    // o que permite que os valores de configuração sejam injetados dinamicamente.
    JwtModule.registerAsync({
      // O serviço ConfigService é injetado para buscar variáveis de ambiente que serão usadas para configurar o JWT.
      inject: [ConfigService],

      // O atributo `global: true` garante que o JwtModule estará disponível globalmente no aplicativo.
      global: true,

      // A função `useFactory` é chamada para configurar o JWT com base nas variáveis de ambiente. Ela recebe o `ConfigService` injetado.
      useFactory(config: ConfigService<Env, true>) {
        // Busca a chave privada (JWT_PRIVATE_KEY) das variáveis de ambiente usando o ConfigService.
        // A opção `infer: true` tenta inferir o tipo da variável.
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })

        // Busca a chave pública (JWT_PUBLIC_KEY) das variáveis de ambiente.
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

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
  providers: [JwtStrategy],
})
// O módulo Auth é exportado para ser utilizado em outras partes da aplicação.
export class authModule {}
