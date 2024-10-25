import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer-factory'
import { QuestionFactory } from 'test/factories/make-question-factory'
import { StudentFactory } from 'test/factories/make-student-factory'

describe('Edit answer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[PUT] /answers/:id', async () => {
    const anotherUser = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: anotherUser.id,
    })

    const user = await studentFactory.makePrismaStudent()
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })
    const answerId = answer.id.toString()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Change answer test content',
      })
    console.log(response.body)

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: { content: 'Change answer test content' },
    })

    expect(answerOnDatabase).toBeTruthy()
  })
})
