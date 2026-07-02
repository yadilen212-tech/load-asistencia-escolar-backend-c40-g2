import { Test, TestingModule } from '@nestjs/testing'
import { PrismaService } from '../prisma/prisma.service'
import { ReportsController } from './reports.controller'

describe('ReportsController', () => {
  let controller: ReportsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            student: {
              findMany: jest.fn().mockResolvedValue([
                { id: 1, fullName: 'Juan Perez', grade: '5A', guardianEmail: 'a@a.com', createdAt: new Date() },
                { id: 2, fullName: 'Maria Lopez', grade: '5B', guardianEmail: 'b@b.com', createdAt: new Date() },
              ]),
            },
          },
        },
      ],
    }).compile()

    controller = module.get<ReportsController>(ReportsController)
  })

  it('devuelve el reporte de asistencia', async () => {
    const result = await controller.attendance()

    expect(result.total).toBe(2)
    expect(result.estudiantes.length).toBe(2)
    expect(result.resumen).toContain('Total estudiantes: 2')
  })
})
