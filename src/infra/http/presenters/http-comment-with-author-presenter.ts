import { CommentsWithAuthor } from '@/domain/forum/enterprise/entities/values-objects/comments-with-author'

export class HttpCommentWithAuthorPresenter {
  static toHttp(commentWithAuthor: CommentsWithAuthor) {
    return {
      commentId: commentWithAuthor.commentId.toString(),
      authorId: commentWithAuthor.authorId.toString(),
      authorName: commentWithAuthor.authorName,
      content: commentWithAuthor.content,
      createdAt: commentWithAuthor.createdAt,
    }
  }
}
