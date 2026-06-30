import { Body, Controller, Get, Post } from '@nestjs/common'
import { StudentService } from './student.service'

@Controller('educacion-asistencia')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body)
  }
}
