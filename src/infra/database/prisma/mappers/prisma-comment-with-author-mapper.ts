import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CommentsWithAuthor } from '@/domain/forum/enterprise/entities/values-objects/comments-with-author'
import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export class CommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentsWithAuthor {
    return CommentsWithAuthor.create({
      commentId: new UniqueEntityID(raw.id),
      authorId: new UniqueEntityID(raw.author.id),
      content: raw.content,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      authorName: raw.author.name,
    })
  }
}
