import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateAttendanceRate } from './attendance-rate.util';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getAttendanceSummary() {
    const students = await this.prisma.student.findMany();
    return students.map((student) => ({
      studentId: student.id,
      name: student.fullName,
      attendanceRate: calculateAttendanceRate(10, 20),
    }));
  }
}
