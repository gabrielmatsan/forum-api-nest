import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error' // Converte ZodError para um formato mais legível

// Classe ZodValidationPipe implementando PipeTransform do NestJS
export class ZodValidationPipe implements PipeTransform {
  // O construtor recebe um esquema de validação Zod como argumento
  constructor(private schema: ZodSchema) {}

  // O método transform é chamado automaticamente para validar o valor da requisição
  transform(value: unknown) {
    try {
      // O valor é validado usando o esquema Zod fornecido. Se for válido, o valor parseado é retornado
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        // Lança uma exceção BadRequestException com uma mensagem personalizada e detalhes do erro
        throw new BadRequestException({
          message: 'Validation Failed',
          statusCode: 400,
          error: fromZodError(error), // Converte o ZodError para uma mensagem de erro mais legível
        })
      }
      // Se o erro não for de Zod, lança uma exceção genérica de validação falhou
      throw new BadRequestException('Validation failed')
    }
  }
}
