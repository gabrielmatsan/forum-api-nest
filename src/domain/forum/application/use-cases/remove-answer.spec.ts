import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { RemoveAnswerUseCase } from './remove-answer'
import { makeAnswer } from 'test/factories/make-answer-factory'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment-factory'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: RemoveAnswerUseCase
describe('Remove Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new RemoveAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to remove a answer', async () => {
    const newAnswer = makeAnswer()

    inMemoryAnswersRepository.create(newAnswer)
    expect(inMemoryAnswersRepository.items).toHaveLength(1)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newAnswer.authorId.toString(),
    })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
  })
  it('should not be able to remove a answer from another user', async () => {
    const newAnswer = makeAnswer()

    inMemoryAnswersRepository.create(newAnswer)

    expect(inMemoryAnswersRepository.items).toHaveLength(1)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: 'another-author',
    })

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
