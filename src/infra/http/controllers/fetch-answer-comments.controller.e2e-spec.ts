import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment-factory'
import { AnswerFactory } from 'test/factories/make-answer-factory'
import { QuestionFactory } from 'test/factories/make-question-factory'
import { StudentFactory } from 'test/factories/make-student-factory'

describe('Fetch Answer Comments(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService

  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerCommentFactory: AnswerCommentFactory
  let answerFactory: AnswerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerCommentFactory,
        AnswerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerCommentFactory = moduleRef.get(AnswerCommentFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })
  test('[GET] /answers/:answerId/comments', async () => {
    // cria user
    const user = await studentFactory.makePrismaStudent()
    // cria question
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    // cria answer
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    // cria comments da resposta
    for (let i = 1; i <= 22; i++) {
      await answerCommentFactory.makePrismaAnswerComment({
        authorId: user.id,
        answerId: answer.id,
      })
    }

    const accessToken = jwt.sign({ sub: user.id.toString() })

    // lista comments da resposta
    const response = await request(app.getHttpServer())
      .get(`/answers/${answer.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)

    expect(response.body.comment).not.toBeNull()
    expect(response.body.comment).not.toBeUndefined()
    expect(response.body.comment.length).toBe(20) // Verifica se 20 perguntas foram, devido a paginacao

    expect(response.body).toEqual(
      expect.objectContaining({
        comment: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            content: expect.any(String),
            // authorId: expect.any(String), nao retornado mais devido ao mapper
          }),
        ]),
      }),
    )
  })
})
