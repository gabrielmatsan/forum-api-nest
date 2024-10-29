import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment-factory'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student-factory'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchAnswerCommentsUseCase
describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const user = makeStudent()
    inMemoryStudentsRepository.items.push(user)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('id-1'),
      authorId: user.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('id-1'),
      authorId: user.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('id-1'),
      authorId: user.id,
    })
    await inMemoryAnswerCommentsRepository.create(comment1)
    await inMemoryAnswerCommentsRepository.create(comment2)
    await inMemoryAnswerCommentsRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'id-1',
      page: 1,
    })

    expect(result.value?.comments).toHaveLength(3)
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorId: user.id,
          commentId: comment1.id,
        }),
        expect.objectContaining({
          authorId: user.id,
          commentId: comment2.id,
        }),
        expect.objectContaining({
          authorId: user.id,
          commentId: comment3.id,
        }),
      ]),
    )
  })
  it('should be able to fetch paginated answer comments', async () => {
    const user = makeStudent()
    inMemoryStudentsRepository.items.push(user)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('id-1'),
          authorId: user.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'id-1',
      page: 2,
    })

    expect(result.value?.comments).toHaveLength(2)
  })
})
