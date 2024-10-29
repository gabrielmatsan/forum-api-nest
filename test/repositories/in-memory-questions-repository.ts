import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/values-objects/question-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  constructor(
    private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private attachmentsRepository: InMemoryAttachmentsRepository,
    private studentsRepository: InMemoryStudentsRepository,
  ) {}

  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async update(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }

  async findBySlug(slug: string) {
    const question = await this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findByID(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  // Função assíncrona que busca os detalhes de uma pergunta a partir do slug
  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    // Procura a pergunta na lista `items` (uma coleção de perguntas) com base no valor do slug
    const question = this.items.find((item) => item.slug.value === slug)

    // Se a pergunta não for encontrada, retorna `null`
    if (!question) {
      return null
    }

    // Busca o autor da pergunta no repositório de estudantes usando o `authorId` da pergunta
    const author = this.studentsRepository.items.find((student) => {
      return student.id.equals(question.authorId)
    })

    // Se o autor não for encontrado, lança um erro informando que o autor não foi localizado
    if (!author) {
      throw new Error(
        `Author with ID ${question.authorId.toString()} not found`,
      )
    }

    // Filtra os anexos relacionados à pergunta a partir do repositório de anexos
    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => {
        return questionAttachment.questionId.equals(question.id)
      },
    )

    // questionAttachments é apenas o "linkagem" entre o anexo e a pergunta, agora é preciso buscar o anexo no repositório de anexos

    // Mapeia os anexos da pergunta para buscar os detalhes completos de cada um
    const attachments = questionAttachments.map((questionAttachment) => {
      // Encontra o anexo específico associado ao ID do anexo da pergunta
      const attachment = this.attachmentsRepository.items.find((attachment) => {
        return attachment.id.equals(questionAttachment.attachmentId)
      })

      // Se o anexo não for encontrado, lança um erro informando o ID do anexo ausente
      if (!attachment) {
        throw new Error(
          `Attachment with ID ${questionAttachment.attachmentId.toString()} not found`,
        )
      }

      // Retorna o anexo encontrado para incluir na lista de anexos da pergunta
      return attachment
    })

    // Retorna um objeto `QuestionDetails` com todos os dados detalhados da pergunta
    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      authorName: author.name,
      title: question.title,
      slug: question.slug,
      content: question.content,
      bestAnswerId: question.bestAnswerId,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      attachments,
    })
  }
}
