export abstract class ValueObject<Props> {
  protected props: Props

  // Construtor para inicializar a entidade com propriedades e, opcionalmente
  protected constructor(props: Props) {
    // Atribui as propriedades da entidade
    this.props = props
  }

  // Método para comparar duas entidades e verificar se são equivalentes
  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false
    }

    if (vo.props === undefined) {
      return false
    }

    return JSON.stringify(vo.props) === JSON.stringify(this.props)
  }
}
