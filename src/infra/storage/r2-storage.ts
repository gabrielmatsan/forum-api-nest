import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client // Declara o cliente S3 para realizar operações de armazenamento

  // Construtor que inicializa o cliente S3 com as configurações de endpoint e credenciais
  constructor(private envService: EnvService) {
    const accountId = envService.get('CLOUDFARE_ACCOUNT_ID') // Obtém o ID da conta Cloudflare do ambiente
    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`, // Configura o endpoint para o serviço R2 da Cloudflare
      region: 'auto', // Define a região como 'auto', pois o R2 não exige uma região específica
      credentials: {
        accessKeyId: envService.get('AWS_ACESS_KEY_ID'), // Obtém a chave de acesso do ambiente
        secretAccessKey: envService.get('AWS_SECRET_ACESS_KEY'), // Obtém a chave secreta do ambiente
      },
    })
  }

  // Método de upload que recebe parâmetros e envia o arquivo para o armazenamento R2
  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID() // Gera um UUID único para garantir que o nome do arquivo seja exclusivo

    const uniqueFileName = `${uploadId}-${fileName}` // Combina o UUID e o nome do arquivo para evitar conflitos de nome

    // Envia o arquivo usando o comando PutObject do cliente S3
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'), // Especifica o bucket onde o arquivo será armazenado
        Key: uniqueFileName, // Nome único do arquivo para evitar sobrescrições
        ContentType: fileType, // Define o tipo de conteúdo do arquivo
        Body: body, // Corpo do arquivo em formato Buffer
      }),
    )

    return {
      url: uniqueFileName, // Retorna o nome único do arquivo como URL de acesso
    }
  }
}
