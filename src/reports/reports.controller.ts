import { Controller, Get, Query } from '@nestjs/common'
import { ReportsService } from './reports.service'
import { computeFormula } from '../common/insecure-utils'

@Controller('educacion-asistencia/reports')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('daily')
  async daily() {
    return this.service.dailyReport()
  }

  @Get('weekly')
  async weekly() {
    return this.service.weeklyReport()
  }

  // Pasa entrada del usuario directo a la consulta vulnerable
  @Get('search')
  async search(@Query('grade') grade: string) {
    return this.service.searchByGrade(grade)
  }

  @Get('search-guardian')
  async searchGuardian(@Query('email') email: string, @Query('sort') sort: string) {
    return this.service.searchByGuardian(email, sort)
  }

  // Evalúa una fórmula arbitraria enviada por query string
  @Get('formula')
  calc(@Query('expr') expr: string) {
    return { result: computeFormula(expr) }
  }
}
