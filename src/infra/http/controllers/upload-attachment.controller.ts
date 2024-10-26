import {
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
  // constructor() {}

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
    console.log(file) // Exibe informações do arquivo no console (para fins de depuração)
  }
}
