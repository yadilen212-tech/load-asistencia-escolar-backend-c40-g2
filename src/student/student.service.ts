import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.student.findMany({ orderBy: { createdAt: 'desc' } })
  }

  create(data: any) {
    return this.prisma.student.create({ data })
  }
}
