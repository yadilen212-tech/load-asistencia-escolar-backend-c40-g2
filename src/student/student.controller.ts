import { Body, Controller, Get, Post, UseGuards, HttpCode, HttpStatus, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { StudentService } from './student.service'
import { JwtGuard } from '../auth/guards/jwt.guard'
import { CreateAttendanceDto, BulkAttendanceDto } from './dto/create-attendance.dto'

@Controller('educacion-asistencia')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Get()
  @UseGuards(JwtGuard)
  async findAll() {
    try {
      return await this.service.findAll()
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException('Failed to fetch students: ' + error.message)
      }
      throw new InternalServerErrorException('Failed to fetch students')
    }
  }

  @Post()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateAttendanceDto) {
    try {
      if (!body || !body.records) {
        throw new BadRequestException('Invalid request payload')
      }

      if (!Array.isArray(body.records) || body.records.length === 0) {
        throw new BadRequestException('Records array cannot be empty')
      }

      for (const record of body.records) {
        if (typeof record.studentId !== 'number' || record.studentId <= 0) {
          throw new BadRequestException('Invalid studentId in records')
        }
        if (typeof record.present !== 'boolean') {
          throw new BadRequestException('Present field must be boolean')
        }
      }

      return await this.service.create(body)
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException('Failed to create attendance: ' + error.message)
      }
      throw new InternalServerErrorException('Failed to create attendance')
    }
  }

  @Post('bulk')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.CREATED)
  async createBulk(@Body() body: BulkAttendanceDto) {
    try {
      if (!body || !body.records) {
        throw new BadRequestException('Invalid request payload')
      }

      if (!Array.isArray(body.records) || body.records.length === 0) {
        throw new BadRequestException('Records array cannot be empty')
      }

      if (!body.date) {
        throw new BadRequestException('Date is required')
      }

      for (const record of body.records) {
        if (typeof record.studentId !== 'number' || record.studentId <= 0) {
          throw new BadRequestException('Invalid studentId in records')
        }
        if (typeof record.present !== 'boolean') {
          throw new BadRequestException('Present field must be boolean')
        }
      }

      return await this.service.createBulk(body)
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException('Failed to create bulk attendance: ' + error.message)
      }
      throw new InternalServerErrorException('Failed to create bulk attendance')
    }
  }
}
