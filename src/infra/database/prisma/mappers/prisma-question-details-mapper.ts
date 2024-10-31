import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/values-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/values-objects/slug'
import {
  Question as PrismaQuestion,
  User as PrismaUser,
  Attachment as PrismaAttachment,
} from '@prisma/client'
import { AttachmentMapper } from './prisma-attachment-mapper'

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser
  attachments: PrismaAttachment[]
}

export class QuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.author.id),
      authorName: raw.author.name,
      slug: Slug.create(raw.slug),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      title: raw.title,
      content: raw.content,
      attachments: raw.attachments.map(AttachmentMapper.toDomain),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
    })
  }
}
