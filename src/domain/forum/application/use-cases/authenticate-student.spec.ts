import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/criptography/fake-hasher'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeEncrypter } from 'test/criptography/fake-encrypter'
import { makeStudent } from 'test/factories/make-student-factory'

let sut: AuthenticateStudentUseCase
let fakerHasher: FakeHasher
let fakerEncrypter: FakeEncrypter

let inMemoryStudentsRepository: InMemoryStudentsRepository
describe('Authenticate Student ', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakerHasher = new FakeHasher()
    fakerEncrypter = new FakeEncrypter()
    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakerHasher,
      fakerEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakerHasher.hash('123456'),
    })

    inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    console.log(result)

    expect(result.isRight()).toBe(true)

    expect(result.value).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
