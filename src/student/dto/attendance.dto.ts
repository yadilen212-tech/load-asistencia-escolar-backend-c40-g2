export class AttendanceRecordDto {
  studentId: number
  status: string
  remarks?: string
}

export class CreateAttendanceDto {
  records: AttendanceRecordDto[]
  date?: string
}

export class BulkAttendanceDto {
  records: any[]
}
