import { PrismaService } from '../prisma/prisma.service'
import { AttendanceService } from './attendance.service'
import { CreateAttendanceDto } from './dto/create-attendance.dto'

describe('AttendanceService', () => {
  let service: AttendanceService
  let prisma: {
    attendance: {
      create: jest.Mock
      findMany: jest.Mock
    }
  }

  beforeEach(() => {
    prisma = {
      attendance: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    }
    service = new AttendanceService(prisma as unknown as PrismaService)
  })

  describe('create', () => {
    it('creates an attendance record from the dto', async () => {
      const dto: CreateAttendanceDto = { studentId: 1, date: '2026-01-15', present: true }
      const created = { id: 1, studentId: 1, date: new Date('2026-01-15'), present: true, createdAt: new Date() }
      prisma.attendance.create.mockResolvedValue(created)

      const result = await service.create(dto)

      expect(prisma.attendance.create).toHaveBeenCalledWith({
        data: {
          studentId: 1,
          date: new Date('2026-01-15'),
          present: true,
        },
      })
      expect(result).toEqual(created)
    })
  })

  describe('findByStudent', () => {
    it('queries attendance records for the given student ordered by date desc', async () => {
      const records = [{ id: 1, studentId: 5, date: new Date('2026-01-10'), present: true }]
      prisma.attendance.findMany.mockResolvedValue(records)

      const result = await service.findByStudent(5)

      expect(prisma.attendance.findMany).toHaveBeenCalledWith({
        where: { studentId: 5 },
        orderBy: { date: 'desc' },
      })
      expect(result).toEqual(records)
    })
  })

  describe('findByDate', () => {
    it('queries attendance records for the given date ordered by studentId asc', async () => {
      const records = [{ id: 2, studentId: 3, date: new Date('2026-01-15'), present: false }]
      prisma.attendance.findMany.mockResolvedValue(records)

      const result = await service.findByDate('2026-01-15')

      expect(prisma.attendance.findMany).toHaveBeenCalledWith({
        where: { date: new Date('2026-01-15') },
        orderBy: { studentId: 'asc' },
      })
      expect(result).toEqual(records)
    })
  })
})
