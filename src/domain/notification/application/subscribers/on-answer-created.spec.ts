import { makeAnswer } from 'test/factories/make-answer-factory'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import {
  SendNotificationUseCase,
  sendNotificationUseCaseRequest,
  sendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question-factory'
import { vi, MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersAttachementsRepository: InMemoryAnswerAttachmentsRepository

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let sendNotificationExecuteSpy: MockInstance<
  (
    request: sendNotificationUseCaseRequest,
  ) => Promise<sendNotificationUseCaseResponse>
>

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )

    inMemoryAnswersAttachementsRepository =
      new InMemoryAnswerAttachmentsRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachementsRepository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnAnswerCreated(inMemoryQuestionRepository, sendNotificationUseCase)
  })

  it('should to send a notification when an answer was created', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    // funcao criada loop de 10 ate alcancar 1000 (maximo) esperando a resposta da funcao
    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
