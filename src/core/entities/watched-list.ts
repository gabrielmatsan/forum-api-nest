// Define uma classe abstrata WatchedList, que monitora uma lista de itens e mantém um histórico das adições e remoções
export abstract class WatchedList<T> {
  public currentItems: T[] // Lista de itens atualmente monitorados
  private initial: T[] // Lista de itens iniciais no momento da criação
  private new: T[] // Itens que foram adicionados à lista desde a criação
  private removed: T[] // Itens que foram removidos da lista desde a criação

  constructor(initialItems?: T[]) {
    this.currentItems = initialItems || [] // Inicializa a lista atual com os itens fornecidos
    this.initial = initialItems || [] // Armazena a lista inicial para referência
    this.new = [] // Inicializa a lista de novos itens vazia
    this.removed = [] // Inicializa a lista de itens removidos vazia
  }

  // Método abstrato para comparar itens, a ser implementado por subclasses
  abstract compareItems(a: T, b: T): boolean

  // Retorna a lista atual de itens
  public getItems(): T[] {
    return this.currentItems
  }

  // Retorna os itens que foram adicionados desde a criação
  public getNewItems(): T[] {
    return this.new
  }

  // Retorna os itens que foram removidos desde a criação
  public getRemovedItems(): T[] {
    return this.removed
  }

  // Verifica se um item está presente na lista atual
  private isCurrentItem(item: T): boolean {
    return (
      this.currentItems.filter((v: T) => this.compareItems(item, v)).length !==
      0
    )
  }

  // Verifica se um item foi adicionado recentemente
  private isNewItem(item: T): boolean {
    return this.new.filter((v: T) => this.compareItems(item, v)).length !== 0
  }

  // Verifica se um item foi removido recentemente
  private isRemovedItem(item: T): boolean {
    return (
      this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  // Remove um item da lista de novos itens
  private removeFromNew(item: T): void {
    this.new = this.new.filter((v) => !this.compareItems(v, item))
  }

  // Remove um item da lista atual
  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter(
      (v) => !this.compareItems(item, v),
    )
  }

  // Remove um item da lista de itens removidos
  private removeFromRemoved(item: T): void {
    this.removed = this.removed.filter((v) => !this.compareItems(item, v))
  }

  // Verifica se o item estava presente na lista inicial
  private wasAddedInitially(item: T): boolean {
    return (
      this.initial.filter((v: T) => this.compareItems(item, v)).length !== 0
    )
  }

  // Verifica se o item existe na lista atual
  public exists(item: T): boolean {
    return this.isCurrentItem(item)
  }

  // Adiciona um item à lista, atualizando as listas de novos e removidos conforme necessário
  public add(item: T): void {
    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item) // Remove da lista de removidos, se presente
    }

    if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
      this.new.push(item) // Adiciona à lista de novos itens se não estiver nela ou na lista inicial
    }

    if (!this.isCurrentItem(item)) {
      this.currentItems.push(item) // Adiciona à lista atual se ainda não estiver lá
    }
  }

  // Remove um item da lista, atualizando as listas de novos e removidos conforme necessário
  public remove(item: T): void {
    this.removeFromCurrent(item) // Remove da lista atual

    if (this.isNewItem(item)) {
      this.removeFromNew(item) // Remove da lista de novos itens, se presente
      return
    }

    if (!this.isRemovedItem(item)) {
      this.removed.push(item) // Adiciona à lista de removidos se ainda não estiver lá
    }
  }

  // Atualiza a lista com novos itens, recalculando as listas de novos e removidos
  public update(items: T[]): void {
    const newItems = items.filter((a) => {
      return !this.getItems().some((b) => this.compareItems(a, b))
    })

    const removedItems = this.getItems().filter((a) => {
      return !items.some((b) => this.compareItems(a, b))
    })

    this.currentItems = items // Atualiza a lista atual com os novos itens
    this.new = newItems // Atualiza a lista de novos itens
    this.removed = removedItems // Atualiza a lista de itens removidos
  }
}
