export interface UploadParams {
  fileName: string // Nome do arquivo a ser enviado
  fileType: string // Tipo do arquivo (e.g., 'image/png', 'application/pdf')
  body: Buffer // Conteúdo do arquivo em formato Buffer
}

// Classe abstrata Uploader que define o contrato para upload de arquivos
export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<{ url: string }>
}
