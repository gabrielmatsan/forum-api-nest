import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment-factory'
import { NotAllowedError } from '../../../../core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Comment On Question Use Case', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )

    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(questionComment)

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    })
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(questionComment)

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1)

    const result = await sut.execute({
      authorId: 'wrong-user',
      questionCommentId: questionComment.id.toString(),
    })
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
