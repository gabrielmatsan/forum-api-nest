import { Module } from '@nestjs/common' // Importa o decorador 'Module' do Nest.js para definir um módulo
import { PrismaService } from './prisma/prisma.service' // Importa o serviço Prisma, que gerencia as operações com o banco de dados
import { CreateAccountController } from './controllers/create-account.controller'
import { ConfigModule } from '@nestjs/config' // Importa o módulo de configuração para gerenciar variáveis de ambiente
import { envSchema } from './env' // Importa o esquema de validação para verificar as variáveis de ambiente
import { authModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'

@Module({
  imports: [
    // ConfigModule para gerenciar e validar as variáveis de ambiente
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env), // Valida as variáveis de ambiente usando o 'envSchema'
      isGlobal: true, // Define o módulo de configuração como global para ser acessível em toda a aplicação
    }),
    // autenticação
    authModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ], // Controlador responsável por lidar com as requisições relacionadas à criação de contas
  providers: [PrismaService], // Provedor do serviço Prisma que será injetado para manipulação de dados no banco
})
export class AppModule {}
