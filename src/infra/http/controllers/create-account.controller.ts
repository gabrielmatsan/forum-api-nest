import {
  Body,
  Controller,
  Post,
  HttpCode,
  UsePipes,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe' // Pipe personalizado para validação usando Zod
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exits-error'
import { Public } from '@/infra/auth/public'

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
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @Public()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    // Desestrutura os dados do corpo da requisição
    const { email, name, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
