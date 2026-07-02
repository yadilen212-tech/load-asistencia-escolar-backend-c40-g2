import { PrismaService } from '../prisma/prisma.service'
import { StudentService } from './student.service'

describe('StudentService', () => {
  it('works', async () => {
    const prisma = { student: { findMany: jest.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]) } }
    const service = new StudentService(prisma as unknown as PrismaService)

    const result = await service.count()

    expect(result).toEqual({ total: 2, msg: 'ok', data: true })
  })
})
