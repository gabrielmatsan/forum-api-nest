import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport' // Importa o PassportStrategy para definir uma nova estratégia de autenticação.
import { ExtractJwt, Strategy } from 'passport-jwt' // Importa a estratégia JWT e o método de extração de tokens JWT da biblioteca passport-jwt.
import { Env } from '@/infra/env'
import { z } from 'zod' //

// Define um esquema de validação do payload do token JWT, com o campo `sub` sendo um UUID.
const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
})

// Cria um tipo baseado no esquema de validação, para ser usado nas funções de validação.
export type UserPayload = z.infer<typeof tokenPayloadSchema>

// Define a classe JwtStrategy que estende a classe base PassportStrategy. A estratégia é usada para validar tokens JWT.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // O construtor recebe o `ConfigService`, que acessa as variáveis de ambiente. Ele é usado para buscar a chave pública.
  constructor(config: ConfigService<Env, true>) {
    // Busca a chave pública (JWT_PUBLIC_KEY) das variáveis de ambiente.
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    // A função `super` chama o construtor da classe `PassportStrategy` e define as opções da estratégia JWT.
    super({
      // O token JWT é extraído do cabeçalho de autorização como um token Bearer (Bearer token).
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // A chave pública é usada para verificar a assinatura do token. Ela é decodificada de Base64 para um buffer.
      secretOrKey: Buffer.from(publicKey, 'base64'),

      // Define o algoritmo de assinatura utilizado para verificar o token. Neste caso, o algoritmo é RS256 (assinatura com chave RSA).
      algorithms: ['RS256'],
    })
  }

  // O método `validate` é chamado para validar o payload do token JWT. Ele utiliza o esquema Zod para verificar o payload.
  async validate(payload: UserPayload) {
    // Valida o payload do token com o esquema `tokenPayloadSchema`, garantindo que ele tenha um UUID válido no campo `sub`.
    return tokenPayloadSchema.parse(payload)
  }
}
