// Define a interface para manipuladores de eventos (EventHandler) em um sistema baseado em eventos
export interface EventHandler {
  // Método para configurar as assinaturas de eventos
  setupSubscriptions(): void
}
