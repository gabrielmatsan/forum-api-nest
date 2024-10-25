import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { StudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}

@Injectable()
export class StudentFactory {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a student in the database and return the created student.
   *
   * @param data - Optional data to override default values.
   * @returns A Promise that resolves with the created student.
   */
  async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
    const student = makeStudent(data)
    await this.prisma.user.create({
      data: StudentMapper.toPersitent(student),
    })

    return student
  }
}
