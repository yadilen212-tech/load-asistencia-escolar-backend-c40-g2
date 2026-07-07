import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post()
  create(@Body() data: { studentId: number; date: string; present: boolean }) {
    return this.attendanceService.create({
      ...data,
      date: new Date(data.date),
    });
  }

  @Get()
  find(
    @Query('studentId') studentId?: string,
    @Query('date') date?: string,
  ) {
    if (studentId) {
      return this.attendanceService.findByStudent(parseInt(studentId));
    }
    if (date) {
      return this.attendanceService.findByDate(new Date(date));
    }
    return [];
  }
}
