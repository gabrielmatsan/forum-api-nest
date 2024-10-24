import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { HashCompare } from '../criptography/hash-compare'
import { Encrypter } from '../criptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { StudentsRepository } from '../repositories/students-repository'

export interface AuthenticateStudentRequest {
  email: string
  password: string
}

type AuthenticateStudentResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashCompare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  /**
   * Authenticate a student and return an access token
   * @param request The request to authenticate a student
   * @returns An either with the access token or a WrongCredentialsError
   */
  async execute({
    email,
    password,
  }: AuthenticateStudentRequest): Promise<AuthenticateStudentResponse> {
    // Find the student by email
    const student = await this.studentsRepository.findByEmail(email)

    // If the student is not found, return an error
    if (!student) {
      return left(new WrongCredentialsError())
    }

    // Compare the password
    const isPasswordValid = await this.hashCompare.compare(
      password,
      student.password,
    )

    // If the password is invalid, return an error
    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    // Generate an access token
    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    // Return the access token
    return right({
      accessToken,
    })
  }
}
