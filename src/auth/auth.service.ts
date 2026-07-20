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

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponse> {
    // Validate input
    if (!email || !password) {
      throw new BadRequestException('Email and password are required')
    }

    // Find user by email
    const user = await this.prisma.user.findUnique({ where: { email } })

    // Validate user exists and password is correct
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Generate JWT token
    const accessToken = this.jwt.sign(
      { sub: user.id, email },
      { expiresIn: '1d' },
    )

    // Return token and user info (exclude password)
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
