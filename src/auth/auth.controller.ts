import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password)
  }

  @Post('admin/reset-password')
  adminResetPassword(@Body() body: { email: string; newPassword: string; masterKey: string }) {
    return this.auth.adminResetPassword(body)
  }
}
