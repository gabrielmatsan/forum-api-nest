import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionCommentFactory } from 'test/factories/make-question-comment-factory'
import { QuestionFactory } from 'test/factories/make-question-factory'
import { StudentFactory } from 'test/factories/make-student-factory'

describe('Delete Question Comment (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[DELETE] /questions/comments/:id', async () => {
    // Criando user
    const user = await studentFactory.makePrismaStudent()
    // cria pergunta
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    // token
    const accessToken = jwt.sign({ sub: user.id.toString() })

    // user cria um comment
    const comment = await questionCommentFactory.makePrismaQuestionComment({
      authorId: user.id,
      questionId: question.id,
    })

    const commentId = comment.id.toString()

    // user deleta seu comment
    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.status).toBe(204)

    const commentOnDatabase = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    expect(commentOnDatabase).toBeNull()
  })
})
