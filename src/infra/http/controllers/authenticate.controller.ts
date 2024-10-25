import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

// Esquema de validação
const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Define um tipo TypeScript baseado no esquema de validação do Zod
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  // inversão de dependência
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema)) // Usa o ZodValidationPipe para validar o corpo da requisição
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value
    // Retorna o token JWT
    return { access_token: accessToken }
  }
}
