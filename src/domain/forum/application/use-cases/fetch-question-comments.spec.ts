import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment-factory'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student-factory'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    // cria o student e o adiciona ao repositório
    const student = makeStudent()
    inMemoryStudentsRepository.items.push(student)

    // cria comentários com o student
    for (let i = 1; i <= 3; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('id-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'id-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: student.name,
        }),
      ]),
    )
  })
  it('should be able to fetch paginated question comments', async () => {
    // cria o student e o adiciona ao repositório
    const student = makeStudent()
    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('id-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'id-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
