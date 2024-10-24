import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
  ], // Provedor do serviço Prisma que será injetado para manipulação de dados no banco
  exports: [
    PrismaService,
    PrismaAnswerAttachmentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaAnswersRepository,
    QuestionsRepository,
    StudentsRepository,
  ], // Exporta o provedor do serviço Prisma
})
export class DatabaseModule {}
