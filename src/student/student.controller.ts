import { Controller, Get, Post, Body } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('educacion-asistencia')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get('count')
  count() {
    return this.studentService.count();
  }

  @Post()
  create(@Body() data: { fullName: string; grade: string; guardianEmail: string }) {
    return this.studentService.create(data);
  }
}
