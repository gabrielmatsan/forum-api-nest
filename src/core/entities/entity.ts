import { UniqueEntityID } from './unique-entity-id'

// Classe abstrata Entity que define uma estrutura comum para entidades de domínio
export abstract class Entity<Props> {
  // Identificador único da entidade
  private _id: UniqueEntityID

  // Propriedades específicas de cada entidade, definidas pelo tipo Props
  protected props: Props

  // Getter para acessar o ID da entidade
  get id() {
    return this._id
  }

  // Construtor para inicializar a entidade com propriedades e, opcionalmente, um ID
  protected constructor(props: Props, id?: UniqueEntityID) {
    // Atribui as propriedades da entidade
    this.props = props
    // Gera um novo ID se nenhum for fornecido
    this._id = id ?? new UniqueEntityID()
  }

  // Método para comparar duas entidades e verificar se são equivalentes
  public equals(entity: Entity<unknown>) {
    // Se as duas entidades são a mesma instância, elas são iguais
    if (this === entity) {
      return true
    }
    // Se os IDs são iguais, as entidades são consideradas iguais
    if (entity.id === this._id) {
      return true
    }

    // Caso contrário, as entidades são diferentes
    return false
  }
}
