import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Fetch Recent Questions(E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })
  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })
    const accessToken = jwt.sign({ sub: user.id })

    for (let i = 1; i <= 22; i++) {
      await prisma.question.create({
        data: {
          title: `Question title ${i}`,
          content: `Question content ${i}`,
          authorId: user.id,
          slug: `question-title-${i}`,
        },
      })
    }

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()
    expect(response.status).toBe(200)

    expect(response.body.questions.length).toBe(20) // Verifica se 20 perguntas foram

    expect(response.body).toEqual(
      expect.objectContaining({
        questions: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            content: expect.any(String),
            slug: expect.any(String),
            authorId: expect.any(String),
          }),
        ]),
      }),
    )
  })
})
