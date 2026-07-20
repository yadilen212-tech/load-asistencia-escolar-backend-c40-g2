import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'

interface LoginResponse {
  accessToken: string
  user: {
    id: number
    email: string
    fullName: string
  }
}

interface JwtPayload {
  sub: number
  email: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required')
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('Email and password must be strings')
    }

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()

    if (!trimmedEmail.includes('@')) {
      throw new BadRequestException('Invalid email format')
    }

    if (trimmedPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters')
    }

    const user = await this.prisma.user.findUnique({ where: { email: trimmedEmail } })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload: JwtPayload = { sub: user.id, email: user.email }
    const accessToken = this.jwt.sign(payload, { expiresIn: '1d' })

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    }
  }
}
