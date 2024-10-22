import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

// Esquema de validação
const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Define um tipo TypeScript baseado no esquema de validação do Zod
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  // inversão de dependência
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema)) // Usa o ZodValidationPipe para validar o corpo da requisição
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    // Verifica se existe um usuário com o email fornecido
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    // Se não existir um usuário com o email fornecido, lança uma exceção de 'Unauthorized'
    if (!user) {
      throw new UnauthorizedException('User credentials do not match')
    }

    // Verifica se a senha fornecida corresponde a senha do usuário
    const isPasswordValid = await compare(password, user.password)

    // Se a senha fornecida não corresponder à senha do usuário, lança uma exceção de 'Unauthorized'
    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match')
    }

    // Gera o token JWT
    const acessToken = this.jwt.sign({ sub: user.id })

    // Retorna o token JWT
    return { access_token: acessToken }
  }
}
