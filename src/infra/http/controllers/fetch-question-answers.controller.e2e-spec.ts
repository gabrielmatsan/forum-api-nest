import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer-factory'
import { QuestionFactory } from 'test/factories/make-question-factory'
import { StudentFactory } from 'test/factories/make-student-factory'

describe('Fetch Question Answers (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })
  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const questionId = question.id.toString()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    for (let i = 1; i <= 22; i++) {
      await answerFactory.makePrismaAnswer({
        questionId: question.id,
        authorId: user.id,
      })
    }

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.status).toBe(200)

    expect(response.body.answers).not.toBeNull()
    expect(response.body.answers).not.toBeUndefined()
    expect(response.body.answers.length).toBe(20) // Verifica se 20 perguntas foram

    expect(response.body).toEqual(
      expect.objectContaining({
        answers: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            content: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            // content: expect.any(String), nao retornado mais devido ao mapper
            // authorId: expect.any(String), nao retornado mais devido ao mapper
          }),
        ]),
      }),
    )
  })
})
