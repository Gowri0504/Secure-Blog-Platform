import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existing) throw new BadRequestException('Email already registered')
    const passwordHash = await bcrypt.hash(dto.password, 12)
    return this.prisma.user.create({
      data: { email: dto.email, passwordHash }
    })
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (!user) throw new UnauthorizedException('Invalid credentials')
    const ok = await bcrypt.compare(dto.password, user.passwordHash)
    if (!ok) throw new UnauthorizedException('Invalid credentials')
    const accessToken = await this.jwtService.signAsync({ sub: user.id, email: user.email })
    const refreshToken = jwt.sign(
      { sub: user.id },
      this.config.get<string>('JWT_REFRESH_SECRET') || this.config.get<string>('JWT_SECRET') || 'changeme',
      { expiresIn: '7d' }
    )
    return { accessToken, refreshToken }
  }

  async me(req: Request) {
    const payload = req.user as { userId?: string; sub?: string }
    const userId = payload.userId ?? payload.sub as string
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, createdAt: true }
    })
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) throw new UnauthorizedException()
    const payload = jwt.verify(
      refreshToken,
      this.config.get<string>('JWT_REFRESH_SECRET') || this.config.get<string>('JWT_SECRET') || 'changeme'
    ) as JwtPayload & { sub: string }
    const accessToken = await this.jwtService.signAsync({ sub: payload.sub })
    return accessToken
  }
}
