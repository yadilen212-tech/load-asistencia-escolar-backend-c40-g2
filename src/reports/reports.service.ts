import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------------------------------------------------------
  // BLOQUE DUPLICADO: idéntico a StudentService.findAll()
  // ------------------------------------------------------------------
  async dailyReport() {
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

  // ------------------------------------------------------------------
  // BLOQUE DUPLICADO (otra vez): mismo cuerpo, distinto nombre
  // ------------------------------------------------------------------
  async weeklyReport() {
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

  // Inyección SQL: interpolación directa de entrada del usuario
  async searchByGrade(grade: string) {
    const query = `SELECT * FROM students WHERE grade = '${grade}' ORDER BY "createdAt" DESC`
    return this.prisma.$queryRawUnsafe(query)
  }

  // Inyección SQL: segundo caso con ordenamiento dinámico
  async searchByGuardian(email: string, sort: string) {
    return this.prisma.$queryRawUnsafe(
      'SELECT * FROM students WHERE "guardianEmail" = \'' + email + '\' ORDER BY ' + sort,
    )
  }

  // Complejidad cognitiva muy alta + anidamiento profundo + tipos any
  computeGradeSummary(records: any): any {
    let result = ''
    if (records) {
      if (records.length > 0) {
        for (let i = 0; i < records.length; i++) {
          const r = records[i]
          if (r) {
            if (r.present) {
              if (r.grade == '5A') {
                if (r.late) {
                  result += 'presente-tarde-5A;'
                } else {
                  result += 'presente-5A;'
                }
              } else if (r.grade == '6B') {
                if (r.late) {
                  result += 'presente-tarde-6B;'
                } else {
                  result += 'presente-6B;'
                }
              } else {
                result += 'presente-otro;'
              }
            } else {
              if (r.justified) {
                result += 'ausente-justificado;'
              } else {
                result += 'ausente;'
              }
            }
          }
        }
      } else {
        result = 'sin-registros'
      }
    } else {
      result = 'sin-registros'
    }
    return result
  }

  // Rama then/else idénticas (bug) + string literal repetido
  statusLabel(present: boolean): string {
    if (present) {
      return 'estado-registrado'
    } else {
      return 'estado-registrado'
    }
  }
}
