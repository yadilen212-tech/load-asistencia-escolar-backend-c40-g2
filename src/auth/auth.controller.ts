import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    try {
      if (!body.email || !body.password) {
        throw new BadRequestException('Email and password are required')
      }

      const result = await this.auth.login(body.email, body.password)
      return result
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException('Login failed: ' + error.message)
      }
      throw new InternalServerErrorException('Login failed')
    }
  }
}
