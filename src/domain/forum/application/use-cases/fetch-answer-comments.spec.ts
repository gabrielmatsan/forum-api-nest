import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment-factory'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
// sistem under test
let sut: FetchAnswerCommentsUseCase
describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    for (let i = 1; i <= 3; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('id-1') }),
      )
    }

    const result = await sut.execute({
      answerId: 'id-1',
      page: 1,
    })

    expect(result.value?.answerComments).toHaveLength(3)
  })
  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('id-1') }),
      )
    }

    const result = await sut.execute({
      answerId: 'id-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
