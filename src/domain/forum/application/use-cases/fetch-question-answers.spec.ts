import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer-factory'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
// sistem under test
let sut: FetchQuestionAnswersUseCase
describe('Fetch Questions Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to fetch answers by question', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        createdAt: new Date(2022, 0, 20),
        questionId: new UniqueEntityID('id-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        createdAt: new Date(2023, 0, 20),
        questionId: new UniqueEntityID('id-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        createdAt: new Date(2024, 2, 19),
        questionId: new UniqueEntityID('id-1'),
      }),
    )

    const result = await sut.execute({
      page: 1,
      questionId: 'id-1',
    })

    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to pagine the answers of a question', async () => {
    for (let i = 1; i <= 21; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('id-1') }),
      )
    }

    const questionsPageOne = await sut.execute({
      page: 1,
      questionId: 'id-1',
    })

    const questionsPageTwo = await sut.execute({
      page: 2,
      questionId: 'id-1',
    })
    expect(questionsPageOne.value?.answers).toHaveLength(20)
    expect(questionsPageTwo.value?.answers).toHaveLength(1)
  })
})
