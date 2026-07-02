import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { ReportsModule } from './reports/reports.module'
import { StudentModule } from './student/student.module'

@Module({
  imports: [PrismaModule, AuthModule, StudentModule, ReportsModule],
})
export class AppModule {}
