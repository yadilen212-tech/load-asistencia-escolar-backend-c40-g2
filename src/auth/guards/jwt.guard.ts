import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

interface JwtPayload {
  sub: number
  email: string
  iat?: number
  exp?: number
}

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found')
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new BadRequestException('Invalid authorization header format')
    }

    const token = parts[1]

    try {
      const payload: JwtPayload = this.jwt.verify(token)
      request.user = payload
      return true
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'jwt expired') {
          throw new UnauthorizedException('Token has expired')
        }
        throw new UnauthorizedException('Invalid token: ' + error.message)
      }
      throw new UnauthorizedException('Invalid token')
    }
  }
}
