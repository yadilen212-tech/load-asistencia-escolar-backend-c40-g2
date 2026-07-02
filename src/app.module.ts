import { Module } from '@nestjs/common'
import { AttendanceModule } from './attendance/attendance.module'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { StudentModule } from './student/student.module'

@Module({
  imports: [PrismaModule, AuthModule, StudentModule, AttendanceModule],
})
export class AppModule {}
