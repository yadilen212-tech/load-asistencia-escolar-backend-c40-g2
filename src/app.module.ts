import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { StudentModule } from './student/student.module'
import { ReportsModule } from './reports/reports.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [PrismaModule, AuthModule, StudentModule, ReportsModule, UsersModule],
})
export class AppModule {}
