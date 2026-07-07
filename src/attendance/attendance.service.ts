import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async create(data: { studentId: number; date: Date; present: boolean }) {
    return this.prisma.attendance.create({ data });
  }

  async findByStudent(studentId: number) {
    return this.prisma.attendance.findMany({ where: { studentId } });
  }

  async findByDate(date: Date) {
    return this.prisma.attendance.findMany({ where: { date } });
  }
}
