import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type-error'
import { UploadAndCreateAttachmentsUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachments'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private uploadAndCreateAttachments: UploadAndCreateAttachmentsUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file')) // Usa o interceptor para processar o upload do arquivo
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        // Aplica validações de arquivo
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // Define o tamanho máximo do arquivo como 2MB
          }),
          new FileTypeValidator({
            fileType: '.(jpg|jpeg|png|pdf)', // Define os tipos de arquivo permitidos
          }),
        ],
      }),
    )
    file: Express.Multer.File, // Representa o arquivo enviado como um objeto Multer
  ) {
    const result = await this.uploadAndCreateAttachments.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      // Criado switch caso seja criado outro erro no futuro
      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { attachment } = result.value

    return { attachmentId: attachment.id.toString() }
  }
}
