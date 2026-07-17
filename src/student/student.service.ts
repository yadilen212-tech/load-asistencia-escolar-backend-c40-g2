import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

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

  async create(data: any) {
    const records = Array.isArray(data) ? data : data.records ?? []

    const date = new Date()
    date.setHours(0, 0, 0, 0)

    const ops = records.map((r: any) => {
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
