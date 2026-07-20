import { IsNumber, IsBoolean, IsDateString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class AttendanceRecordDto {
  @IsNumber()
  @IsNotEmpty()
  studentId: number

  @IsBoolean()
  @IsNotEmpty()
  present: boolean
}

export class CreateAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  @IsNotEmpty()
  records: AttendanceRecordDto[]
}

export class BulkAttendanceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  @IsNotEmpty()
  records: AttendanceRecordDto[]

  @IsDateString()
  @IsNotEmpty()
  date: string
}
