import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question-factory'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeStudent } from 'test/factories/make-student-factory'
import { makeAttachment } from 'test/factories/make-attachment-factory'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { Slug } from '../../enterprise/entities/values-objects/slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
// sistem under test
let sut: GetQuestionBySlugUseCase
describe('Get Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()

    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    // criando user
    const user = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(user)

    // criando question
    const newQuestion = makeQuestion({
      authorId: user.id,
      slug: Slug.create('example-question'),
    })
    inMemoryQuestionsRepository.create(newQuestion)

    // criando anexo
    const attachment = makeAttachment({ title: 'Some Attachment' })
    inMemoryAttachmentsRepository.create(attachment)

    // linkando anexo a pergunta
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: attachment.id,
      }),
    )

    // executando usecase
    const result = await sut.execute({
      slug: 'example-question',
    })

    // esperado
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
      }),
    })
  })
})

// expect(result.value).toMatchObject({
//   question: expect.objectContaining({
//     props: expect.objectContaining({
//       title: newQuestion.title,
//       authorName: 'John Doe',
//       attachments: [
//         expect.objectContaining({
//           props: expect.objectContaining({
//             title: 'Some Attachment',
//           }),
//         }),
//       ],
//     }),
//   }),
// })
