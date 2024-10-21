import {
  Body,
  Controller,
  Post,
  HttpCode,
  UsePipes,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe' // Pipe personalizado para validação usando Zod

// Esquema de validação
const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

// Define um tipo TypeScript baseado no esquema de validação do Zod
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  // O PrismaService é injetado para interagir com o banco de dados
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    // Desestrutura os dados do corpo da requisição
    const { email, name, password } = body

    // Verifica se já existe um usuário com o mesmo email
    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    })

    // Se já houver um usuário com o mesmo email, lança uma exceção de 'BadRequest'
    if (userWithSameEmail) {
      throw new BadRequestException('User with same email already exists')
    }

    // Criptografa a senha usando bcryptjs
    const hashedPassword = await hash(password, 8)

    // Cria um novo usuário no banco de dados com os dados fornecidos e a senha criptografada
    await this.prisma.user.create({
      data: { email, name, password: hashedPassword },
    })
  }
}
