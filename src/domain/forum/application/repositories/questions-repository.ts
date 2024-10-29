import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/values-objects/question-details'

export abstract class QuestionsRepository {
  abstract create(question: Question): Promise<void>
  abstract update(question: Question): Promise<void>
  abstract delete(question: Question): Promise<void>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findByID(id: string): Promise<Question | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
}
