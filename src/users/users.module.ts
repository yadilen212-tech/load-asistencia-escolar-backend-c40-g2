import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    JwtModule.register({
      // Secreto embebido en el código
      secret: 'change-me-in-prod',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
