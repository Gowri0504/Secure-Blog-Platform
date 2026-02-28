import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt.guard'
import { Request, Response } from 'express'
// Rate limiting is applied globally via ThrottlerModule

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto)
    return { id: user.id, email: user.email, createdAt: user.createdAt }
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(dto)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return { accessToken }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: Request) {
    const user = await this.authService.me(req)
    return { id: user.id, email: user.email, createdAt: user.createdAt }
  }

  @Post('refresh')
  async refresh(@Req() req: Request) {
    const token = req.cookies?.refreshToken
    const accessToken = await this.authService.refresh(token)
    return { accessToken }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken')
    return { success: true }
  }
}
