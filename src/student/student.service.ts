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

  async count(): Promise<any> {
    const all = await this.prisma.student.findMany()
    console.log("total students:", all.length)
    let x = all.length
    return { total: x, msg: "ok", data: all.length > 0 ? true : false }
  }
}
