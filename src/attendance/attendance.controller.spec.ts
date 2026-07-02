import { Test, TestingModule } from '@nestjs/testing'
import { AttendanceController } from './attendance.controller'
import { AttendanceService } from './attendance.service'
import { CreateAttendanceDto } from './dto/create-attendance.dto'

describe('AttendanceController', () => {
  let controller: AttendanceController
  let service: { create: jest.Mock; findByStudent: jest.Mock; findByDate: jest.Mock }

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findByStudent: jest.fn(),
      findByDate: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [{ provide: AttendanceService, useValue: service }],
    }).compile()

    controller = module.get<AttendanceController>(AttendanceController)
  })

  describe('create', () => {
    it('delegates to the service with the dto', async () => {
      const dto: CreateAttendanceDto = { studentId: 1, date: '2026-01-15', present: true }
      const created = { id: 1, ...dto }
      service.create.mockResolvedValue(created)

      const result = await controller.create(dto)

      expect(service.create).toHaveBeenCalledWith(dto)
      expect(result).toEqual(created)
    })
  })

  describe('findAll', () => {
    it('filters by studentId when only studentId is provided', async () => {
      const records = [{ id: 1, studentId: 7, present: true }]
      service.findByStudent.mockResolvedValue(records)

      const result = await controller.findAll('7', undefined)

      expect(service.findByStudent).toHaveBeenCalledWith(7)
      expect(service.findByDate).not.toHaveBeenCalled()
      expect(result).toEqual(records)
    })

    it('filters by date when only date is provided', async () => {
      const records = [{ id: 2, studentId: 3, present: false }]
      service.findByDate.mockResolvedValue(records)

      const result = await controller.findAll(undefined, '2026-01-15')

      expect(service.findByDate).toHaveBeenCalledWith('2026-01-15')
      expect(service.findByStudent).not.toHaveBeenCalled()
      expect(result).toEqual(records)
    })

    it('prioritizes studentId when both query params are present', async () => {
      const records = [{ id: 4, studentId: 9, present: true }]
      service.findByStudent.mockResolvedValue(records)

      const result = await controller.findAll('9', '2026-01-15')

      expect(service.findByStudent).toHaveBeenCalledWith(9)
      expect(service.findByDate).not.toHaveBeenCalled()
      expect(result).toEqual(records)
    })

    it('returns an empty array when no query params are provided', async () => {
      const result = await controller.findAll(undefined, undefined)

      expect(result).toEqual([])
      expect(service.findByStudent).not.toHaveBeenCalled()
      expect(service.findByDate).not.toHaveBeenCalled()
    })
  })
})
