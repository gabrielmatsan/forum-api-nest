import { Either, left, right } from '@/core/either'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error'
import { Injectable } from '@nestjs/common'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentsUseCaseRequest {
  fileName: string // Nome do arquivo
  fileType: string // Tipo do arquivo (MIME type)
  body: Buffer // Conteúdo do arquivo em formato Buffer
}

// Define o tipo de resposta para o caso de uso, usando Either para lidar com sucesso ou erro
type UploadAndCreateAttachmentsUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  { attachment: Attachment }
>

@Injectable()
export class UploadAndCreateAttachmentsUseCase {
  // Construtor que injeta as dependências Uploader e AttachmentsRepository
  constructor(
    private uploader: Uploader,
    private attachmentsRepository: AttachmentsRepository,
  ) {}

  // Método principal que executa o caso de uso de upload e criação de anexo
  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentsUseCaseRequest): Promise<UploadAndCreateAttachmentsUseCaseResponse> {
    // Valida o tipo do arquivo usando uma expressão regular (aceita apenas imagens JPEG, PNG e PDFs)
    if (!/^image\/(jpeg|png)$|^application\/pdf$/.test(fileType)) {
      // Retorna um erro se o tipo do arquivo for inválido
      return left(new InvalidAttachmentTypeError(fileType))
    }

    // Chama o método upload do serviço Uploader para enviar o arquivo e obter a URL
    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    // Cria um novo objeto Attachment usando o título e URL fornecidos
    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    // Salva o anexo no repositório de anexos
    await this.attachmentsRepository.create(attachment)

    // Retorna um objeto Either com o anexo criado em caso de sucesso
    return right({ attachment })
  }
}
