import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator'

export class LoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty()
  email: string

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string
}
