import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/create-account.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { FetchRecentQuestionUseCase } from '@/domain/forum/application/use-cases/fetch-recent-question'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { CryptographyModule } from '../criptography/criptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ], // Controlador responsável por lidar com as requisições relacionadas à criação de contas e autenticação
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionUseCase,
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
  ],
})
export class HttpModule {}
