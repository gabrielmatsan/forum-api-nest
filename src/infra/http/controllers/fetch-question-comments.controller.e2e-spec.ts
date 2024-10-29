import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionCommentFactory } from 'test/factories/make-question-comment-factory'
import { QuestionFactory } from 'test/factories/make-question-factory'
import { StudentFactory } from 'test/factories/make-student-factory'

describe('Fetch Question Comments(E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let questionFactory: QuestionFactory
  let questionCommentFactory: QuestionCommentFactory
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    questionCommentFactory = moduleRef.get(QuestionCommentFactory)

    await app.init()
  })
  test('[GET] /questions/:questionId/comments', async () => {
    // cria user
    const user = await studentFactory.makePrismaStudent({
      name: 'John Doe',
    })
    // cria question
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    // cria comments
    for (let i = 1; i <= 22; i++) {
      await questionCommentFactory.makePrismaQuestionComment({
        authorId: user.id,
        questionId: question.id,
      })
    }

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)

    expect(response.body.comments).not.toBeNull()
    expect(response.body.comments).not.toBeUndefined()
    expect(response.body.comments.length).toBe(20) // Verifica se 20 perguntas foram, devido a paginacao

    expect(response.body).toEqual(
      expect.objectContaining({
        comments: expect.arrayContaining([
          expect.objectContaining({
            authorName: 'John Doe',
          }),
        ]),
      }),
    )
  })
})
