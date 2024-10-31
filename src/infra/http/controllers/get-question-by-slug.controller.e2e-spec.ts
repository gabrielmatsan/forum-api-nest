import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment-factory'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { QuestionFactory } from 'test/factories/make-question-factory'
import { StudentFactory } from 'test/factories/make-student-factory'
// import { PrismaService } from '@/infra/database/prisma/prisma.service'
// caso nao tivesse factory, seria dessa forma

describe('Get Question By Slug(E2E)', () => {
  let app: INestApplication
  // let prisma: PrismaService eslint-disable-line
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentsFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    // prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentsFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)

    await app.init()
  })
  test('[GET] /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const attachment = await attachmentsFactory.makePrismaAttachment({
      title: 'New attachment',
    })

    await questionAttachmentFactory.makePrismaAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/questions/${question.slug.value}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: question.title,
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
      }),
    })
  })
})
