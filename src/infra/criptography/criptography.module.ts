import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/forum/application/criptography/encrypter'
import { HashCompare } from '@/domain/forum/application/criptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/criptography/hash-generator'

import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

/**
 * Módulo de Criptografia
 *
 * Responsável por fornecer implementações de serviços de criptografia e hash.
 */
@Module({
  providers: [
    {
      provide: Encrypter, // Provedor para criptografia de JWT
      useClass: JwtEncrypter,
    },
    {
      provide: HashCompare, // Provedor para comparação de hashes
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator, // Provedor para geração de hashes
      useClass: BcryptHasher,
    },
  ],
  exports: [
    Encrypter, // Exporta o serviço de criptografia
    HashCompare, // Exporta o serviço de comparação de hashes
    HashGenerator, // Exporta o serviço de geração de hashes
  ],
})
export class CryptographyModule {}
