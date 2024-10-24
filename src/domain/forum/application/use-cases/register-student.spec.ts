import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/criptography/fake-hasher'

let sut: RegisterStudentUseCase
let fakerHasher: FakeHasher

let inMemoryStudentsRepository: InMemoryStudentsRepository
describe('Register Student ', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakerHasher = new FakeHasher()
    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakerHasher)
  })

  it('should be able to register a student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })
  it('should be hash student password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakerHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
