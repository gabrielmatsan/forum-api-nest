import { Encrypter } from '@/domain/forum/application/criptography/encrypter'

export class FakeEncrypter implements Encrypter {
  /**
   * Encrypts the given payload using a fake encrypter.
   * This is for testing purposes only.
   * @param payload The payload to be encrypted.
   * @returns A promise that resolves to the encrypted payload as a string.
   */
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
