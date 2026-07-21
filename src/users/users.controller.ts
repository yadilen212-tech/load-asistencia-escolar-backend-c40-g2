import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('educacion-asistencia/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  async findAll() {
    return this.service.findAll()
  }

  @Post()
  async create(@Body() body: any) {
    return this.service.create(body)
  }

  @Post('login')
  async login(@Body() body: any) {
    return this.service.login(body.email, body.password)
  }

  // Reinicio de contraseña sin autenticación, email por query string
  @Get('reset')
  async reset(@Query('email') email: string) {
    return this.service.resetPassword(email)
  }
}
