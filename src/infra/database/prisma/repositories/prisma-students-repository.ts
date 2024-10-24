import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { StudentMapper } from '../mappers/prisma-student-mapper'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new student
   *
   * @param student - The student to create
   */
  async create(student: Student): Promise<void> {
    const data = StudentMapper.toPersitent(student) // Formato DB Prisma

    await this.prisma.user.create({ data })
  }

  /**
   * Update a student
   *
   * @param student - The student to update
   */
  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!student) {
      return null
    }

    return StudentMapper.toDomain(student)
  }
}
