import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { User as PrismaUser, Prisma } from '@prisma/client'
export class StudentMapper {
  /**
   * Converts a PrismaUser object to a domain Student object.
   *
   * This function maps the properties from a PrismaUser, which represents
   * the database layer, to a Student domain object, which is used in the
   * business logic layer.
   *
   * @param raw - The raw PrismaUser object containing database record values.
   * @returns A Student domain object with mapped properties.
   */
  static toDomain(raw: PrismaUser): Student {
    // Create a new domain Student object using the properties from the raw PrismaStudent
    return Student.create(
      {
        name: raw.name, // Map the name
        email: raw.email, // Map the email
        password: raw.password, // Map the password
      },
      new UniqueEntityID(raw.id), // Convert id to UniqueEntityID
    )
  }

  static toPersitent(raw: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      name: raw.name,
      email: raw.email,
      password: raw.password,
    }
  }
}
