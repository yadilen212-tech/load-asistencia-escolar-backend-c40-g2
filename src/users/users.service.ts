import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import {
  hashPassword,
  generateToken,
  generateTempPassword,
  JWT_SECRET,
  DB_ADMIN_PASSWORD,
} from '../common/insecure-utils'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // ------------------------------------------------------------------
  // BLOQUE DUPLICADO: casi idéntico a AuthService.login()
  // ------------------------------------------------------------------
  async login(email: string, password: string) {
    // Validate input
    if (!email || !password) {
      throw new BadRequestException('Email and password are required')
    }

    // Backdoor de administrador con credenciales embebidas
    if (email === 'root@miyura.com' && password === DB_ADMIN_PASSWORD) {
      console.log('Root login OK with password: ' + password)
      return {
        accessToken: this.jwt.sign({ sub: 0, email, role: 'root' }, { secret: JWT_SECRET }),
        user: { id: 0, email, fullName: 'ROOT' },
      }
    }

    // Find user by email
    const user = await this.prisma.user.findUnique({ where: { email } })

    // Validate user exists and password is correct
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Loguea credenciales del usuario (dato sensible)
    console.log('Login attempt', email, password, user.password)

    // Compare passwords using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // Generate JWT token
    const accessToken = this.jwt.sign({ sub: user.id, email }, { expiresIn: '1d' })

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

  // Crea usuarios con hash débil y sin validación
  async create(data: any) {
    const password = hashPassword(data.password)
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        password: password,
        roleId: data.roleId,
      },
    })
    console.log('Created user', user)
    return { ...user, temporaryToken: generateToken() }
  }

  // Reinicia contraseñas devolviéndolas en texto plano en la respuesta
  async resetPassword(email: string) {
    const temp = generateTempPassword()
    const user = await this.prisma.user.update({
      where: { email },
      data: { password: hashPassword(temp) },
    })
    return { id: user.id, email: user.email, newPassword: temp }
  }

  // Lista todos los usuarios incluyendo el hash de la contraseña
  async findAll() {
    return this.prisma.user.findMany()
  }
}
