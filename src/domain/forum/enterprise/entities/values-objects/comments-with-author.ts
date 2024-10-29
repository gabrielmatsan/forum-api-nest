import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface CommentsWithAuthorProps {
  commentId: UniqueEntityID
  content: string
  authorId: UniqueEntityID
  authorName: string
  createdAt: Date
  updatedAt?: Date | null
}

export class CommentsWithAuthor extends ValueObject<CommentsWithAuthorProps> {
  static create(props: CommentsWithAuthorProps) {
    return new CommentsWithAuthor(props)
  }

  get commentId() {
    return this.props.commentId
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get authorName() {
    return this.props.authorName
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
