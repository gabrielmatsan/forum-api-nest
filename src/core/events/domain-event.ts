import { UniqueEntityID } from '../entities/unique-entity-id'

// Define a interface para um evento de domínio, que representa um evento significativo em um modelo de domínio
export interface DomainEvent {
  // Propriedade que indica a data e hora em que o evento ocorreu
  ocurredAt: Date

  // Método que retorna o ID da entidade agregada associada ao evento
  getAggregateId(): UniqueEntityID
}
