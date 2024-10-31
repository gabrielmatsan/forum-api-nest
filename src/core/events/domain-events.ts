import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

// Define um tipo para callbacks de eventos de domínio, que recebem o evento como parâmetro
type DomainEventCallback = (event: unknown) => void

// Classe para gerenciar eventos de domínio, centralizando o registro, despacho e limpeza de eventos
export class DomainEvents {
  // Mapeia os nomes dos eventos para uma lista de callbacks associados
  private static handlersMap: Record<string, DomainEventCallback[]> = {}

  // Armazena agregados marcados que possuem eventos para serem despachados
  private static markedAggregates: AggregateRoot<unknown>[] = []

  public static shouldRun: boolean = true

  // Marca um agregado para despacho de eventos, caso ainda não tenha sido marcado
  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id)

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate) // Adiciona à lista de agregados marcados
    }
  }

  // Despacha os eventos do agregado especificado, chamando todos os handlers registrados para cada evento
  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) => this.dispatch(event))
  }

  // Remove o agregado da lista de agregados marcados para despacho
  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate))

    if (index !== -1) {
      this.markedAggregates.splice(index, 1) // Remove o agregado da lista se encontrado
    }
  }

  // Encontra um agregado marcado pelo seu ID
  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id))
  }

  // Despacha os eventos para um agregado específico pelo ID e depois limpa os eventos
  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateByID(id)

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate) // Despacha todos os eventos do agregado
      aggregate.clearEvents() // Limpa os eventos do agregado após o despacho
      this.removeAggregateFromMarkedDispatchList(aggregate) // Remove da lista de marcados
    }
  }

  // Registra um callback para um tipo de evento específico
  public static register(
    callback: DomainEventCallback,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [] // Inicializa a lista de callbacks para o evento
    }

    this.handlersMap[eventClassName].push(callback) // Adiciona o callback à lista de handlers
  }

  // Limpa todos os handlers registrados
  public static clearHandlers() {
    this.handlersMap = {}
  }

  // Limpa todos os agregados marcados para despacho
  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }

  // Despacha um evento específico, executando todos os handlers registrados para ele
  private static dispatch(event: DomainEvent) {
    const eventClassName: string = event.constructor.name

    const isEventRegistered = eventClassName in this.handlersMap

    if (!this.shouldRun) {
      return
    }

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName]

      for (const handler of handlers) {
        handler(event) // Executa cada callback associado ao evento
      }
    }
  }
}
