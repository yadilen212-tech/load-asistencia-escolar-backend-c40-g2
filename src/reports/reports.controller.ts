import { Controller, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('attendance')
  getAttendanceReport() {
    return this.reportsService.getAttendanceSummary();
  }
}
