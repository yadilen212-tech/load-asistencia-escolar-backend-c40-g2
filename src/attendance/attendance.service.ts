import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAttendanceDto } from './dto/create-attendance.dto'

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAttendanceDto) {
    return this.prisma.attendance.create({
      data: {
        studentId: dto.studentId,
        date: new Date(dto.date),
        present: dto.present,
      },
    })
  }

  findByStudent(studentId: number) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
    })
  }

  findByDate(date: string) {
    return this.prisma.attendance.findMany({
      where: { date: new Date(date) },
      orderBy: { studentId: 'asc' },
    })
  }
}
