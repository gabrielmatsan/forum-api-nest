import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './values-objects/slug'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  description: string
  slug: Slug
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.description.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(newTitle: string) {
    this.props.title = newTitle
    this.props.slug = Slug.createFromText(newTitle)
    this.touch()
  }

  set description(newDescription: string) {
    this.props.description = newDescription
    this.touch()
  }

  /**
   * Sets the best answer ID of the question.
   *
   * If the ID is undefined, do nothing.
   *
   * If the ID is different from the current best answer ID,
   * add a domain event to the question.
   *
   * @param newBestAnswerId The new best answer ID.
   */
  set bestAnswerId(newBestAnswerId: UniqueEntityID | undefined) {
    if (newBestAnswerId === undefined) {
      // if the new best answer ID is undefined, do nothing
      return
    }

    if (
      this.props.bestAnswerId === undefined ||
      // if the new best answer ID is different from the current one,
      // add a domain event to the question
      !this.props.bestAnswerId.equals(newBestAnswerId)
    ) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, newBestAnswerId),
      )
    }

    // update the best answer ID
    this.props.bestAnswerId = newBestAnswerId

    // update the question's updatedAt timestamp
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
