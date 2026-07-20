import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateAttendanceDto, BulkAttendanceDto } from './dto/create-attendance.dto'

@Injectable()
export class StudentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(end.getDate() + 1)

    const students = await this.prisma.student.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        attendances: {
          where: {
            date: {
              gte: start,
              lt: end,
            },
          },
          take: 1,
        },
      },
    })

    return students.map((s) => {
      const todayAttendance = s.attendances && s.attendances.length ? s.attendances[0] : null
      return {
        id: s.id,
        fullName: s.fullName,
        grade: s.grade,
        guardianEmail: s.guardianEmail,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        attendanceToday: todayAttendance,
        present: todayAttendance ? todayAttendance.present : null,
      }
    })
  }

  async create(data: CreateAttendanceDto) {
    const records = data.records

    if (!records || records.length === 0) {
      throw new BadRequestException('Records cannot be empty')
    }

    const date = new Date()
    date.setHours(0, 0, 0, 0)

    const ops = records.map((r) => {
      return this.prisma.attendance.upsert({
        where: { studentId_date: { studentId: r.studentId, date } },
        create: {
          studentId: r.studentId,
          date,
          present: !!r.present,
        },
        update: {
          present: !!r.present,
        },
      })
    })

    return this.prisma.$transaction(ops)
  }

  async createBulk(data: BulkAttendanceDto) {
    const records = data.records

    if (!records || records.length === 0) {
      throw new BadRequestException('Records cannot be empty')
    }

    let date: Date
    try {
      date = new Date(data.date)
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format')
      }
    } catch (error) {
      throw new BadRequestException('Invalid date format: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }

    date.setHours(0, 0, 0, 0)

    const ops = records.map((r) => {
      return this.prisma.attendance.upsert({
        where: { studentId_date: { studentId: r.studentId, date } },
        create: {
          studentId: r.studentId,
          date,
          present: !!r.present,
        },
        update: {
          present: !!r.present,
        },
      })
    })

    return this.prisma.$transaction(ops)
  }
}
