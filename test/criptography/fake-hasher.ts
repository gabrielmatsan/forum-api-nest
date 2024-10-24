import { HashCompare } from '@/domain/forum/application/criptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/criptography/hash-generator'

export class FakeHasher implements HashGenerator, HashCompare {
  /**
   * Generates a hashed string from the given plain text input.
   *
   * @param plain - The plain text string to be hashed.
   * @returns A promise that resolves to the hashed string.
   */
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  /**
   * Compares a plain text string with a hashed string and checks if they match.
   *
   * @param plain - The plain text string to be compared.
   * @param hash - The hashed string to be compared.
   * @returns A promise that resolves to a boolean indicating if the strings match.
   */
  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
