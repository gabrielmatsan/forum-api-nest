import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create question (E2E)', () => {
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

  test('[POST] /questions', async () => {
    // Create a user
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    })

    // Generate JWT token
    const accessToken = jwt.sign({ sub: user.id })

    // Verify JWT token
    console.log('Token JWT:', accessToken)

    // Send request to create a question
    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`) // Corrected variable name
      .send({
        title: 'New question',
        content: 'New question test content',
      })

    // Check if the response status is correct
    expect(response.status).toBe(201)

    // Verify the question is in the database
    const questionOnDatabase = await prisma.question.findFirst({
      where: { title: 'New question' },
    })

    // Ensure that the question was created successfully
    expect(questionOnDatabase).toBeTruthy()
  })
})
