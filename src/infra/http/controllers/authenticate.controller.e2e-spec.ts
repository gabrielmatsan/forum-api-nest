import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { StudentFactory } from 'test/factories/make-student-factory'

describe('Authenticate Controller (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    studentFactory = moduleRef.get(StudentFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    // Create a user
    const user = await studentFactory.makePrismaStudent({
      password: await hash('123456', 8),
    })

    // Generate JWT token
    const accessToken = jwt.sign({ sub: user.id.toString() })

    // Send request to create a question
    const response = await request(app.getHttpServer())
      .post('/sessions')
      .set('Authorization', `Bearer ${accessToken}`) // Corrected variable name
      .send({
        email: user.email,
        password: '123456',
      })

    // Check if the response status is correct
    expect(response.status).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
