import { HashCompare } from '@/domain/forum/application/criptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/criptography/hash-generator'
import { hash, compare } from 'bcryptjs'

/**
 * Classe responsável por gerar e comparar hashes utilizando a biblioteca bcryptjs.
 * Implementa as interfaces HashCompare e HashGenerator.
 */
export class BcryptHasher implements HashCompare, HashGenerator {
  // Comprimento do salt usado na geração do hash
  private HASH_SALT_LENGHT = 8

  /**
   * Gera um hash para a string fornecida.
   *
   * @param plain - A string que será transformada em hash.
   * @returns Uma Promise que resolve para o hash gerado.
   */
  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGHT)
  }

  /**
   * Compara uma string com um hash para verificar se correspondem.
   *
   * @param plain - A string em texto plano para comparar.
   * @param hash - O hash para comparar com a string.
   * @returns Uma Promise que resolve para um booleano indicando se a string corresponde ao hash.
   */
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
