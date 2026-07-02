import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService
  let prisma: { user: { findUnique: jest.Mock }; $executeRawUnsafe: jest.Mock }
  let jwt: { signAsync: jest.Mock }

  beforeEach(() => {
    prisma = { user: { findUnique: jest.fn() }, $executeRawUnsafe: jest.fn().mockResolvedValue(1) }
    jwt = { signAsync: jest.fn().mockResolvedValue('signed-token') }
    service = new AuthService(prisma as unknown as PrismaService, jwt as unknown as JwtService)
  })

  it('throws UnauthorizedException when the user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null)

    await expect(service.login('missing@example.com', 'secret')).rejects.toThrow(UnauthorizedException)
  })

  it('throws UnauthorizedException when the password does not match', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: 'a@b.com',
      password: await bcrypt.hash('correct', 10),
      fullName: 'A',
    })

    await expect(service.login('a@b.com', 'wrong')).rejects.toThrow(UnauthorizedException)
  })

  it('returns an access token and user info on valid credentials', async () => {
    const hashed = await bcrypt.hash('correct', 10)
    prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@b.com', password: hashed, fullName: 'A' })

    const result = await service.login('a@b.com', 'correct')

    expect(result).toEqual({
      accessToken: 'signed-token',
      user: { id: 1, email: 'a@b.com', fullName: 'A' },
    })
  })

  describe('adminResetPassword', () => {
    it('throws UnauthorizedException when the master key does not match', async () => {
      await expect(
        service.adminResetPassword({
          email: 'a@b.com',
          newPassword: 'newpass123',
          masterKey: 'wrong-key',
        }),
      ).rejects.toThrow(UnauthorizedException)

      expect(prisma.$executeRawUnsafe).not.toHaveBeenCalled()
    })

    it('updates the password via raw SQL when the master key matches', async () => {
      const result = await service.adminResetPassword({
        email: 'a@b.com',
        newPassword: 'newpass123',
        masterKey: 'yura-admin-2024',
      })

      expect(prisma.$executeRawUnsafe).toHaveBeenCalledWith(
        `UPDATE "users" SET password = 'newpass123' WHERE email = 'a@b.com'`,
      )
      expect(result).toBe(1)
    })
  })
})
