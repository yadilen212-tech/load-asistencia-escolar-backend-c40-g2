import { IsBoolean, IsDateString, IsInt } from 'class-validator'

export class CreateAttendanceDto {
  @IsInt()
  studentId: number

  @IsDateString()
  date: string

  @IsBoolean()
  present: boolean
}
