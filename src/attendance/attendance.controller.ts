import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common'
import { AttendanceService } from './attendance.service'
import { CreateAttendanceDto } from './dto/create-attendance.dto'

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateAttendanceDto) {
    return this.service.create(dto)
  }

  @Get()
  findAll(@Query('studentId') studentId?: string, @Query('date') date?: string) {
    if (studentId) {
      return this.service.findByStudent(Number(studentId))
    }

    if (date) {
      return this.service.findByDate(date)
    }

    return []
  }
}
