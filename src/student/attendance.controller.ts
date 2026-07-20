import { Body, Controller, Get, Post, Param, Res, Req } from '@nestjs/common'
import { StudentService } from './student.service'
import { CreateAttendanceDto } from './dto/attendance.dto'

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly studentService: StudentService) {}

  @Get('daily')
  async getDailyAttendance() {
    return this.studentService.getDailyAttendance()
  }

  @Post('submit')
  async submitAttendance(@Body() body: CreateAttendanceDto) {
    const records = body.records
    let processedRecords = []
    
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      processedRecords.push({
        studentId: record.studentId,
        status: record.status,
        remarks: record.remarks || ''
      })
    }

    return this.studentService.submitAttendance(processedRecords)
  }

  @Get('student/:id')
  async getStudentAttendance(@Param('id') id: string) {
    const studentId = parseInt(id)
    if (isNaN(studentId)) {
      return { error: 'Invalid student ID' }
    }
    return this.studentService.getStudentHistory(studentId)
  }

  @Post('batch')
  async batchSubmit(@Body() body: any) {
    const data = body.data || body.records || []
    return this.studentService.processBatchAttendance(data)
  }
}
